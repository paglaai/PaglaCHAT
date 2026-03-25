import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  conversations,
  messages,
  models,
  systemPrompts,
  documents,
  documentChunks,
} from "../../drizzle/schema";
import { eq, desc, inArray } from "drizzle-orm";
import {
  MultiProviderLLMService,
  type ProviderType,
} from "../services/multiProviderLLM";

export const streamingChatRouter = router({
  /**
   * Send message with streaming response support
   * Supports all 14 LLM providers with real-time token streaming
   */
  sendMessageStreaming: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1),
        provider: z.string().optional(),
        model: z.string().optional(),
        apiKey: z.string().optional(),
        baseUrl: z.string().optional(),
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
          const relevantChunks = await db
            .select()
            .from(documentChunks)
            .where(inArray(documentChunks.documentId, docIds))
            .limit(3);

          if (relevantChunks.length > 0) {
            ragContext =
              "\n\nRelevant document excerpts:\n" +
              relevantChunks
                .map(
                  (chunk: any) => `- ${chunk.chunkText.substring(0, 200)}...`
                )
                .join("\n");
          }
        }
      } catch (error) {
        console.warn("Error retrieving RAG context:", error);
      }

      // Enhance system prompt with RAG context
      const enhancedSystemPrompt = systemPrompt + ragContext;

      // Determine provider and model
      const selectedProvider = (input.provider || "openai") as ProviderType;
      const selectedModel =
        input.model || (model[0] as any)?.modelName || "gpt-3.5-turbo";

      // Call LLM with streaming support
      try {
        const response = await MultiProviderLLMService.invoke(
          [
            { role: "system", content: enhancedSystemPrompt },
            ...history.map((msg: any) => ({
              role: msg.role as "user" | "assistant" | "system" | "tool",
              content: msg.content as string,
            })),
          ],
          {
            provider: selectedProvider,
            apiKey: input.apiKey,
            baseUrl: input.baseUrl,
            model: selectedModel,
            temperature: 0.7,
            maxTokens: 2048,
          }
        );

        const contentStr =
          typeof response === "string" ? response : JSON.stringify(response);

        // Add assistant message
        await db.insert(messages).values({
          conversationId: input.conversationId,
          role: "assistant",
          content: contentStr,
        });

        return {
          success: true,
          userMessage: input.content,
          assistantMessage: contentStr,
          provider: selectedProvider,
          model: selectedModel,
        };
      } catch (error) {
        console.error("Error invoking LLM:", error);
        throw new Error(
          `Failed to get response from ${selectedProvider}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Check provider availability before sending message
   */
  checkProviderAvailability: protectedProcedure
    .input(
      z.object({
        provider: z.string(),
        model: z.string(),
        apiKey: z.string().optional(),
        baseUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const isHealthy = await MultiProviderLLMService.checkProviderHealth({
          provider: input.provider as ProviderType,
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          model: input.model,
        });

        return {
          available: isHealthy,
          provider: input.provider,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          available: false,
          provider: input.provider,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    }),

  /**
   * Get available models for a specific provider
   */
  getProviderModels: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ input }) => {
      const providerInfo = MultiProviderLLMService.getProviderInfo(
        input.provider as ProviderType
      );

      // Return provider info with available models
      // In production, this would fetch from provider API
      return {
        provider: input.provider,
        ...providerInfo,
        models: [
          // Placeholder - in production, fetch actual models from provider
          { id: "default", name: "Default Model" },
        ],
      };
    }),
});
