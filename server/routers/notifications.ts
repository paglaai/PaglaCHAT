import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  notifications,
  notificationPreferences,
} from "../../drizzle/notifications";

export const notificationsRouter = router({
  // Create a notification
  create: protectedProcedure
    .input(
      z.object({
        type: z
          .enum(["info", "success", "warning", "error", "custom"])
          .default("info"),
        title: z.string().min(1).max(255),
        message: z.string().min(1),
        icon: z.string().optional(),
        action: z.string().optional(),
        actionLabel: z.string().optional(),
        expiresAt: z.date().optional(),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(notifications).values({
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        message: input.message,
        icon: input.icon,
        action: input.action,
        actionLabel: input.actionLabel,
        expiresAt: input.expiresAt,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      } as any);

      return { success: true };
    }),

  // Get all notifications for current user
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        unreadOnly: z.boolean().optional(),
        type: z
          .enum(["info", "success", "warning", "error", "custom"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const whereConditions: any[] = [eq(notifications.userId, ctx.user.id)];

      if (input.unreadOnly) {
        whereConditions.push(eq(notifications.isRead, false));
      }

      if (input.type) {
        whereConditions.push(eq(notifications.type, input.type));
      }

      const result = await db
        .select()
        .from(notifications)
        .where(
          whereConditions.length > 1
            ? and(...whereConditions)
            : whereConditions[0]
        )
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const notif = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id))
        .limit(1);

      if (!notif[0] || notif[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  // Pin/unpin notification
  togglePin: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const notif = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id))
        .limit(1);

      if (!notif[0] || notif[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const newPinnedState = !notif[0].isPinned;
      await db
        .update(notifications)
        .set({ isPinned: newPinnedState })
        .where(eq(notifications.id, input.id));

      return { success: true, isPinned: newPinnedState };
    }),

  // Delete notification
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const notif = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id))
        .limit(1);

      if (!notif[0] || notif[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.delete(notifications).where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Get notification preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, ctx.user.id))
      .limit(1);

    return prefs[0] || null;
  }),

  // Update notification preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        enableNotifications: z.boolean().optional(),
        enableSoundNotifications: z.boolean().optional(),
        enableBadgeNotifications: z.boolean().optional(),
        enableEmailNotifications: z.boolean().optional(),
        notificationTypes: z.array(z.string()).optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id))
        .limit(1);

      if (existing[0]) {
        await db
          .update(notificationPreferences)
          .set({
            enableNotifications:
              input.enableNotifications ?? existing[0].enableNotifications,
            enableSoundNotifications:
              input.enableSoundNotifications ??
              existing[0].enableSoundNotifications,
            enableBadgeNotifications:
              input.enableBadgeNotifications ??
              existing[0].enableBadgeNotifications,
            enableEmailNotifications:
              input.enableEmailNotifications ??
              existing[0].enableEmailNotifications,
            notificationTypes: input.notificationTypes
              ? JSON.stringify(input.notificationTypes)
              : existing[0].notificationTypes,
            quietHoursStart:
              input.quietHoursStart ?? existing[0].quietHoursStart,
            quietHoursEnd: input.quietHoursEnd ?? existing[0].quietHoursEnd,
          } as any)
          .where(eq(notificationPreferences.userId, ctx.user.id));
      } else {
        await db.insert(notificationPreferences).values({
          userId: ctx.user.id,
          enableNotifications: input.enableNotifications ?? true,
          enableSoundNotifications: input.enableSoundNotifications ?? true,
          enableBadgeNotifications: input.enableBadgeNotifications ?? true,
          enableEmailNotifications: input.enableEmailNotifications ?? false,
          notificationTypes: input.notificationTypes
            ? JSON.stringify(input.notificationTypes)
            : null,
          quietHoursStart: input.quietHoursStart,
          quietHoursEnd: input.quietHoursEnd,
        } as any);
      }

      return { success: true };
    }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const result = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.isRead, false)
        )
      );

    return { count: result.length };
  }),
});
