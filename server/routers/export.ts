import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { conversations, messages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const exportRouter = router({
  /**
   * Export conversation as Markdown
   */
  exportAsMarkdown: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error("Conversation not found");
      }

      if (conversation[0].userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId));

      let markdown = `# ${conversation[0].title || "Untitled Conversation"}\n\n`;
      markdown += `**Date**: ${new Date(conversation[0].createdAt).toLocaleString()}\n\n`;
      markdown += `---\n\n`;

      for (const msg of conversationMessages) {
        const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
        markdown += `## ${role}\n\n${msg.content}\n\n`;
      }

      return {
        content: markdown,
        filename: `${conversation[0].title || "conversation"}-${Date.now()}.md`,
      };
    }),

  /**
   * Export conversation as JSON
   */
  exportAsJSON: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error("Conversation not found");
      }

      if (conversation[0].userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId));

      const exportData = {
        conversation: {
          id: conversation[0].id,
          title: conversation[0].title,
          createdAt: conversation[0].createdAt,
          updatedAt: conversation[0].updatedAt,
        },
        messages: conversationMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
          tokensUsed: msg.tokensUsed,
        })),
      };

      return {
        content: JSON.stringify(exportData, null, 2),
        filename: `${conversation[0].title || "conversation"}-${Date.now()}.json`,
      };
    }),

  /**
   * Export conversation as PDF (returns markdown for client-side conversion)
   */
  exportAsPDF: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error("Conversation not found");
      }

      if (conversation[0].userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId));

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${conversation[0].title || "Conversation"}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #FF0000; }
            .message { margin: 20px 0; padding: 15px; border-left: 4px solid #E5E5E5; }
            .user { background-color: #F5F5F5; }
            .assistant { background-color: #FFFFFF; }
            .role { font-weight: bold; color: #333; }
            .timestamp { color: #999; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <h1>${conversation[0].title || "Untitled Conversation"}</h1>
          <p class="timestamp">Exported: ${new Date().toLocaleString()}</p>
          <hr>
      `;

      for (const msg of conversationMessages) {
        const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
        htmlContent += `
          <div class="message ${msg.role}">
            <div class="role">${role}</div>
            <div>${msg.content}</div>
            <div class="timestamp">${new Date(msg.createdAt).toLocaleString()}</div>
          </div>
        `;
      }

      htmlContent += `
        </body>
        </html>
      `;

      return {
        content: htmlContent,
        filename: `${conversation[0].title || "conversation"}-${Date.now()}.html`,
      };
    }),

  /**
   * Get export statistics for a conversation
   */
  getExportStats: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conversation = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error("Conversation not found");
      }

      if (conversation[0].userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId));

      const userMessages = conversationMessages.filter(m => m.role === "user");
      const assistantMessages = conversationMessages.filter(
        m => m.role === "assistant"
      );

      const totalTokens = conversationMessages.reduce(
        (sum, m) => sum + (m.tokensUsed || 0),
        0
      );

      return {
        totalMessages: conversationMessages.length,
        userMessages: userMessages.length,
        assistantMessages: assistantMessages.length,
        totalTokens,
        averageTokensPerMessage: Math.round(
          totalTokens / conversationMessages.length
        ),
        createdAt: conversation[0].createdAt,
        updatedAt: conversation[0].updatedAt,
      };
    }),
});
