import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

type AuthenticatedUser = User;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
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
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("chat router", () => {
  describe("listModels", () => {
    it("should return a list of active models", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const models = await caller.chat.listModels();

      expect(Array.isArray(models)).toBe(true);
    });
  });

  describe("listSystemPrompts", () => {
    it("should return a list of active system prompts", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const prompts = await caller.chat.listSystemPrompts();

      expect(Array.isArray(prompts)).toBe(true);
    });
  });

  describe("listConversations", () => {
    it("should require authentication", async () => {
      const ctx = createAuthContext();
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.listConversations();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return conversations for authenticated user", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const conversations = await caller.chat.listConversations();

      expect(Array.isArray(conversations)).toBe(true);
    });
  });

  describe("createConversation", () => {
    it("should require authentication", async () => {
      const ctx = createAuthContext();
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.createConversation({
          title: "Test",
          modelId: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should create a conversation with valid input", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.createConversation({
        title: "Test Conversation",
        modelId: 1,
      });

      expect(result).toBeDefined();
    });

    it("should create a conversation with system prompt", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.createConversation({
        title: "Test Conversation with Prompt",
        modelId: 1,
        systemPromptId: 1,
      });

      expect(result).toBeDefined();
    });
  });

  describe("deleteConversation", () => {
    it("should require authentication", async () => {
      const ctx = createAuthContext();
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.deleteConversation({
          conversationId: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return error for non-existent conversation", async () => {
      const ctx = createAuthContext(1);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.deleteConversation({
          conversationId: 99999,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("archiveConversation", () => {
    it("should require authentication", async () => {
      const ctx = createAuthContext();
      ctx.user = null as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.archiveConversation({
          conversationId: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });
});
