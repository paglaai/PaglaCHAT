import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tools } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Tool definitions for external integrations
const AVAILABLE_TOOLS = [
  {
    name: "web_search",
    description: "Search the web for information",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        limit: {
          type: "number",
          description: "Maximum number of results",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "weather",
    description: "Get weather information for a location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or coordinates",
        },
        units: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "Temperature units",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Mathematical expression to evaluate",
        },
      },
      required: ["expression"],
    },
  },
  {
    name: "code_execution",
    description: "Execute Python code safely",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Python code to execute",
        },
      },
      required: ["code"],
    },
  },
];

export const toolsRouter = router({
  // Get available tools
  listAvailableTools: protectedProcedure.query(async () => {
    return AVAILABLE_TOOLS;
  }),

  // Get user's enabled tools
  listEnabledTools: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const enabledTools = await db
      .select()
      .from(tools)
      .where(eq(tools.isEnabled, true));

    return enabledTools;
  }),

  // Enable a tool for the user
  enableTool: protectedProcedure
    .input(
      z.object({
        toolName: z.string(),
        endpoint: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const toolDef = AVAILABLE_TOOLS.find((t) => t.name === input.toolName);
      if (!toolDef) {
        throw new Error("Tool not found");
      }

      const result = await db.insert(tools).values({
        name: input.toolName,
        description: toolDef.description,
        parameters: toolDef.parameters,
        endpoint: input.endpoint,
        method: "POST",
        isEnabled: true,
      });

      return { success: true, toolId: (result as any).insertId };
    }),

  // Disable a tool
  disableTool: protectedProcedure
    .input(z.object({ toolId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(tools)
        .set({ isEnabled: false })
        .where(eq(tools.id, input.toolId));

      return { success: true };
    }),

  // Execute a tool
  executeTool: protectedProcedure
    .input(
      z.object({
        toolName: z.string(),
        parameters: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify tool is enabled
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userTool = await db
        .select()
        .from(tools)
        .where(eq(tools.name, input.toolName))
        .limit(1);

      if (!userTool || userTool.length === 0 || !(userTool[0] as any).isEnabled) {
        throw new Error("Tool not enabled");
      }

      // Execute tool based on name
      try {
        let result: any;

        switch (input.toolName) {
          case "calculator":
            result = await executeCalculator(input.parameters);
            break;
          case "web_search":
            result = await executeWebSearch(input.parameters);
            break;
          case "weather":
            result = await executeWeather(input.parameters);
            break;
          case "code_execution":
            result = await executeCode(input.parameters);
            break;
          default:
            throw new Error("Unknown tool");
        }

        return {
          success: true,
          result,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),
});

// Tool execution functions
async function executeCalculator(params: any): Promise<any> {
  try {
    // Simple calculator - in production, use a safer evaluation method
    const expression = params.expression;
    // Validate expression contains only safe characters
    if (!/^[\d+\-*/().%\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }
    const result = Function('"use strict"; return (' + expression + ")")();
    return { expression, result };
  } catch (error: any) {
    throw new Error(`Calculation error: ${error.message}`);
  }
}

async function executeWebSearch(params: any): Promise<any> {
  // Placeholder for web search implementation
  // In production, integrate with a search API like SerpAPI or Google Custom Search
  const query = params.query;
  const limit = params.limit || 5;

  return {
    query,
    limit,
    results: [
      {
        title: "Search result placeholder",
        url: "https://example.com",
        snippet: "This is a placeholder for web search results",
      },
    ],
    note: "Web search integration requires API key configuration",
  };
}

async function executeWeather(params: any): Promise<any> {
  // Placeholder for weather API integration
  // In production, integrate with OpenWeatherMap or similar service
  const location = params.location;
  const units = params.units || "celsius";

  return {
    location,
    units,
    temperature: 20,
    condition: "Partly Cloudy",
    note: "Weather data requires API key configuration",
  };
}

async function executeCode(params: any): Promise<any> {
  // Placeholder for code execution
  // In production, use a sandboxed environment like Pyodide or a remote service
  const code = params.code;

  return {
    code,
    output: "Code execution requires sandboxed environment setup",
    note: "Direct code execution disabled for security",
  };
}
