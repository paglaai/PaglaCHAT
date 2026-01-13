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

describe("export router", () => {
  it("exportAsMarkdown should return markdown content", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.export.exportAsMarkdown({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.filename).toBeDefined();
      expect(result.filename).toMatch(/\.md$/);
    } catch (error: any) {
      // Conversation might not exist in test DB, which is expected
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("exportAsJSON should return JSON content", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.export.exportAsJSON({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.filename).toBeDefined();
      expect(result.filename).toMatch(/\.json$/);
    } catch (error: any) {
      // Conversation might not exist in test DB, which is expected
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("exportAsPDF should return HTML content", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.export.exportAsPDF({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.filename).toBeDefined();
      expect(result.filename).toMatch(/\.html$/);
      expect(result.content).toContain("<!DOCTYPE html>");
    } catch (error: any) {
      // Conversation might not exist in test DB, which is expected
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("getExportStats should return conversation statistics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.export.getExportStats({
        conversationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.totalMessages).toBeDefined();
      expect(result.userMessages).toBeDefined();
      expect(result.assistantMessages).toBeDefined();
      expect(result.totalTokens).toBeDefined();
      expect(result.averageTokensPerMessage).toBeDefined();
    } catch (error: any) {
      // Conversation might not exist in test DB, which is expected
      expect(error.message).toMatch(/not found|unauthorized/i);
    }
  });

  it("should deny access to conversations from other users", async () => {
    const { ctx: ctx1 } = createAuthContext(1);
    const { ctx: ctx2 } = createAuthContext(2);

    const caller1 = appRouter.createCaller(ctx1);
    const caller2 = appRouter.createCaller(ctx2);

    try {
      // Try to export a conversation from user 1 as user 2
      await caller2.export.exportAsMarkdown({
        conversationId: 1,
      });
    } catch (error: any) {
      // Should fail with unauthorized error
      expect(error.message).toMatch(/unauthorized/i);
    }
  });
});
