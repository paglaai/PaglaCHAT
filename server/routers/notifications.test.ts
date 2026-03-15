import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("notifications router", () => {
  it("create should add a new notification", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.create({
      type: "info",
      title: "Test Notification",
      message: "This is a test notification",
      icon: "bell",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("list should return notifications for current user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.list({
      limit: 10,
      offset: 0,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getUnreadCount should return count of unread notifications", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.getUnreadCount();

    expect(result).toBeDefined();
    expect(result.count).toBeDefined();
    expect(typeof result.count).toBe("number");
  });

  it("getPreferences should return notification preferences", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.getPreferences();

    // May be null if no preferences exist yet
    expect(result === null || typeof result === "object").toBe(true);
  });

  it("updatePreferences should update notification settings", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.updatePreferences({
      enableNotifications: true,
      enableSoundNotifications: false,
      enableBadgeNotifications: true,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("markAllAsRead should mark all notifications as read", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.markAllAsRead();

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
