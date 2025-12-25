import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getUserConversations, getConversationWithMessages, addMessage, getActiveModels, getSystemPrompts, getUserDocuments } from "../db";
import { getDb } from "../db";
import { conversations, messages, models, systemPrompts, documents, documentChunks } from "../../drizzle/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const chatRouter = router({
  // Get all conversations for the current user
  listConversations: protectedProcedure.query(async ({ ctx }) => {
    return getUserConversations(ctx.user.id);
  }),

  // Get a specific conversation with all its messages
  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const conversation = await getConversationWithMessages(input.conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      // Verify ownership
      if ((conversation as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return conversation;
    }),

  // Create a new conversation
  createConversation: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        modelId: z.number(),
        systemPromptId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(conversations).values({
        userId: ctx.user.id,
        title: input.title,
        modelId: input.modelId,
        systemPromptId: input.systemPromptId,
      });

      return result;
    }),

  // Send a message and get a response from the LLM
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify conversation ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (conv.length === 0 || (conv[0] as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Add user message
      await db.insert(messages).values({
        conversationId: input.conversationId,
        role: "user",
        content: input.content,
      });

      // Get conversation history
      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(messages.createdAt);

      // Get model and system prompt
      const model = await db
        .select()
        .from(models)
        .where(eq(models.id, (conv[0] as any).modelId))
        .limit(1);

      let systemPrompt = "You are a helpful AI assistant.";
      if ((conv[0] as any).systemPromptId) {
        const prompt = await db
          .select()
          .from(systemPrompts)
          .where(eq(systemPrompts.id, (conv[0] as any).systemPromptId))
          .limit(1);
        if (prompt.length > 0) {
          systemPrompt = (prompt[0] as any).prompt;
        }
      }

      // Retrieve relevant document chunks for RAG if documents exist
      let ragContext = "";
      try {
        const userDocs = await db
          .select()
          .from(documents)
          .where(eq(documents.userId, ctx.user.id))
          .limit(5);

        if (userDocs.length > 0) {
          const docIds = userDocs.map((d: any) => d.id);
          // Simple retrieval - in production, use vector similarity search
          const relevantChunks = await db
            .select()
            .from(documentChunks)
            .where(inArray(documentChunks.documentId, docIds))
            .limit(3);

          if (relevantChunks.length > 0) {
            ragContext = "\n\nRelevant document excerpts:\n" +
              relevantChunks
                .map((chunk: any) => `- ${chunk.chunkText.substring(0, 200)}...`)
                .join("\n");
          }
        }
      } catch (error) {
        console.warn("Error retrieving RAG context:", error);
      }

      // Enhance system prompt with RAG context
      const enhancedSystemPrompt = systemPrompt + ragContext;

      // Call LLM with enhanced context
      const response = await invokeLLM({
        messages: [
          { role: "system" as const, content: enhancedSystemPrompt },
          ...history.map((msg: any) => ({
            role: msg.role as "user" | "assistant" | "system" | "tool",
            content: msg.content as string,
          })),
        ] as any,
      });

      const assistantContent =
        response.choices[0]?.message?.content || "Unable to generate response";
      
      const contentStr = typeof assistantContent === 'string' ? assistantContent : JSON.stringify(assistantContent);

      // Add assistant message
      await addMessage(input.conversationId, "assistant", contentStr);

      return {
        userMessage: input.content,
        assistantMessage: assistantContent,
      };
    }),

  // Get all available models
  listModels: publicProcedure.query(async () => {
    return getActiveModels();
  }),

  // Get all system prompts
  listSystemPrompts: publicProcedure.query(async () => {
    return getSystemPrompts();
  }),

  // Delete a conversation
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (conv.length === 0 || (conv[0] as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Delete all messages first
      await db
        .delete(messages)
        .where(eq(messages.conversationId, input.conversationId));

      // Delete conversation
      await db
        .delete(conversations)
        .where(eq(conversations.id, input.conversationId));

      return { success: true };
    }),

  // Archive a conversation
  archiveConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (conv.length === 0 || (conv[0] as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await db
        .update(conversations)
        .set({ isArchived: true })
        .where(eq(conversations.id, input.conversationId));

      return { success: true };
    }),
});
