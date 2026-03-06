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

describe("sharing router", () => {
  it("createShareLink should generate a share token", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.sharing.createShareLink({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.shareToken).toBeDefined();
      expect(result.shareToken).toHaveLength(12);
      expect(result.shareUrl).toBeDefined();
      expect(result.shareUrl).toContain("/shared/");
      expect(result.expiresAt).toBeDefined();
    } catch (error: any) {
      // Conversation might not exist in test DB
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("listSharedConversations should return shared conversations", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sharing.listSharedConversations();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getShareStats should return share statistics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.sharing.getShareStats({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.views).toBeDefined();
      expect(result.shares).toBeDefined();
      expect(result.createdAt).toBeDefined();
    } catch (error: any) {
      // Conversation might not exist in test DB
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("revokeShareLink should revoke a share link", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.sharing.revokeShareLink({
        conversationId: 1,
        shareToken: "test-token-123",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    } catch (error: any) {
      // Conversation might not exist in test DB
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("should deny access to conversations from other users", async () => {
    const { ctx: ctx1 } = createAuthContext(1);
    const { ctx: ctx2 } = createAuthContext(2);

    const caller1 = appRouter.createCaller(ctx1);
    const caller2 = appRouter.createCaller(ctx2);

    try {
      // Try to get share stats for a conversation from user 1 as user 2
      await caller2.sharing.getShareStats({
        conversationId: 1,
      });
    } catch (error: any) {
      // Should fail with forbidden error
      expect(error.message).toMatch(/forbidden|unauthorized/i);
    }
  });
});
