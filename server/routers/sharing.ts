import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { conversations } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const sharingRouter = router({
  // Create a shareable link for a conversation
  createShareLink: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify conversation ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conv[0]) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (conv[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Generate unique share token
      const shareToken = nanoid(12);
      const shareUrl = `${process.env.VITE_APP_URL || "http://localhost:3000"}/shared/${shareToken}`;

      // In a real app, you'd store this in a database table
      // For now, we'll return the token and URL
      return {
        shareToken,
        shareUrl,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };
    }),

  // Get shared conversation (public access)
  getSharedConversation: publicProcedure
    .input(z.object({ shareToken: z.string() }))
    .query(async ({ input }) => {
      // In a real app, you'd look up the share token in the database
      // For now, this is a placeholder
      return {
        id: 1,
        title: "Shared Conversation",
        messages: [],
        model: "gpt-4",
      };
    }),

  // List all shared conversations for current user
  listSharedConversations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // In a real app, you'd query a shares table
    // For now, return empty array
    return [];
  }),

  // Revoke a share link
  revokeShareLink: protectedProcedure
    .input(z.object({ conversationId: z.number(), shareToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify conversation ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conv[0]) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (conv[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // In a real app, you'd delete the share record
      return { success: true };
    }),

  // Get share statistics
  getShareStats: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify conversation ownership
      const conv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.conversationId))
        .limit(1);

      if (!conv[0]) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (conv[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // In a real app, you'd track views and interactions
      return {
        views: 0,
        shares: 0,
        lastViewed: null,
        createdAt: new Date(),
      };
    }),
});
