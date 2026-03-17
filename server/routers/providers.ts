import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { MultiProviderLLMService } from "../services/multiProviderLLM";
import { AppleSiliconOptimizer } from "../services/appleSiliconOptimizer";

export const providersRouter = router({
  /**
   * Get all available LLM providers
   */
  listProviders: publicProcedure.query(async () => {
    // In production, fetch from database
    // For now, return the provider list from MultiProviderLLMService
    const providerTypes: Array<"openai" | "anthropic" | "groq" | "gemini" | "openrouter" | "ollama" | "lmstudio" | "llama-cpp" | "llamabarn" | "qwen" | "zhipu" | "kimi" | "comfyui" | "together"> = [
      "openai",
      "anthropic",
      "groq",
      "gemini",
      "openrouter",
      "ollama",
      "lmstudio",
      "llama-cpp",
      "llamabarn",
      "qwen",
      "zhipu",
      "kimi",
      "comfyui",
      "together",
    ];

    return providerTypes.map((provider) => {
      const info = MultiProviderLLMService.getProviderInfo(provider);
      return {
        id: provider,
        ...info,
      };
    });
  }),

  /**
   * Get provider details
   */
  getProvider: publicProcedure
    .input(z.object({ provider: z.string() }))
    .query(({ input }) => {
      const info = MultiProviderLLMService.getProviderInfo(
        input.provider as any
      );
      return {
        id: input.provider,
        ...info,
      };
    }),

  /**
   * Check provider health/availability
   */
  checkProviderHealth: protectedProcedure
    .input(
      z.object({
        provider: z.string(),
        apiKey: z.string().optional(),
        baseUrl: z.string().optional(),
        model: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const isHealthy = await MultiProviderLLMService.checkProviderHealth({
          provider: input.provider as any,
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          model: input.model,
        });

        return {
          healthy: isHealthy,
          provider: input.provider,
          timestamp: new Date(),
        };
      } catch (error) {
        return {
          healthy: false,
          provider: input.provider,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
        };
      }
    }),

  /**
   * Get Apple Silicon optimization recommendations
   */
  getAppleSiliconOptimization: publicProcedure
    .input(
      z.object({
        modelPath: z.string(),
        format: z.enum(["gguf", "mlx", "safetensors"]),
        quantization: z.enum(["Q4_K_M", "Q5_K_S", "Q6_K", "Q8_0", "F16", "F32"]),
        maxMemoryGB: z.number().default(12),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await AppleSiliconOptimizer.optimizeModel({
          modelPath: input.modelPath,
          format: input.format,
          quantization: input.quantization,
          enableMetalAcceleration: AppleSiliconOptimizer.getMetalCompatibility(
            input.format,
            input.quantization
          ),
          enableCoreMLConversion: AppleSiliconOptimizer.getCoreMLCompatibility(
            input.format
          ),
          maxMemoryUsage: input.maxMemoryGB,
          threadCount: 8,
          batchSize: 1,
          useMemoryMapping: true,
        });

        return result;
      } catch (error) {
        throw new Error(
          `Optimization failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Get recommended quantization for model
   */
  getRecommendedQuantization: publicProcedure
    .input(
      z.object({
        modelSizeGB: z.number(),
        maxMemoryGB: z.number().default(16),
      })
    )
    .query(({ input }) => {
      const quantization = AppleSiliconOptimizer.recommendQuantization(
        input.modelSizeGB,
        input.maxMemoryGB
      );

      return {
        modelSize: input.modelSizeGB,
        recommendedQuantization: quantization,
        metalSupport: true,
        estimatedMemory: input.modelSizeGB * 0.5, // Rough estimate for Q4_K_M
      };
    }),

  /**
   * Get recommended models for M2 Pro
   */
  getRecommendedModels: publicProcedure.query(() => {
    return AppleSiliconOptimizer.getRecommendedModels();
  }),

  /**
   * Get M2 Pro specifications
   */
  getM2ProSpecs: publicProcedure.query(() => {
    return {
      name: "Apple M2 Pro",
      cpuCores: 10,
      gpuCores: 16,
      unifiedMemory: 16,
      memoryBandwidth: 100,
      peakFP32Performance: 3.5,
      peakFP16Performance: 7,
      supportedFormats: ["gguf", "mlx", "safetensors"],
      metalSupport: true,
      coreMLSupport: true,
    };
  }),

  /**
   * Get optimization report
   */
  getOptimizationReport: publicProcedure
    .input(
      z.object({
        modelPath: z.string(),
        format: z.enum(["gguf", "mlx", "safetensors"]),
        quantization: z.enum(["Q4_K_M", "Q5_K_S", "Q6_K", "Q8_0", "F16", "F32"]),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await AppleSiliconOptimizer.optimizeModel({
          modelPath: input.modelPath,
          format: input.format,
          quantization: input.quantization,
          enableMetalAcceleration: AppleSiliconOptimizer.getMetalCompatibility(
            input.format,
            input.quantization
          ),
          enableCoreMLConversion: AppleSiliconOptimizer.getCoreMLCompatibility(
            input.format
          ),
          maxMemoryUsage: 12,
          threadCount: 8,
          batchSize: 1,
          useMemoryMapping: true,
        });

        const report = AppleSiliconOptimizer.generateOptimizationReport(result);
        return {
          result,
          report,
        };
      } catch (error) {
        throw new Error(
          `Report generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * List all local models
   */
  listLocalModels: protectedProcedure.query(async ({ ctx }) => {
    // In production, fetch from database
    // For now, return empty array
    return [];
  }),

  /**
   * Add local model
   */
  addLocalModel: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        modelPath: z.string(),
        format: z.enum(["gguf", "mlx", "safetensors", "other"]),
        quantization: z.string().optional(),
        parameters: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, save to database
      return {
        id: Math.random(),
        userId: ctx.user.id,
        ...input,
        createdAt: new Date(),
      };
    }),

  /**
   * Delete local model
   */
  deleteLocalModel: protectedProcedure
    .input(z.object({ modelId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // In production, delete from database
      return {
        success: true,
        modelId: input.modelId,
      };
    }),

  /**
   * Get provider credentials
   */
  getCredentials: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ ctx, input }) => {
      // In production, fetch from database
      return {
        provider: input.provider,
        configured: false,
      };
    }),

  /**
   * Set provider credentials
   */
  setCredentials: protectedProcedure
    .input(
      z.object({
        provider: z.string(),
        apiKey: z.string(),
        apiEndpoint: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, save to database with encryption
      return {
        success: true,
        provider: input.provider,
        message: `Credentials saved for ${input.provider}`,
      };
    }),

  /**
   * Get Apple Silicon settings
   */
  getAppleSiliconSettings: protectedProcedure.query(async ({ ctx }) => {
    // In production, fetch from database
    return {
      userId: ctx.user.id,
      enableMetalAcceleration: true,
      enableCoreMLConversion: true,
      maxMemoryUsage: 12,
      enableMemoryMapping: true,
      threadCount: 8,
      batchSize: 1,
      preferredFormat: "auto",
    };
  }),

  /**
   * Update Apple Silicon settings
   */
  updateAppleSiliconSettings: protectedProcedure
    .input(
      z.object({
        enableMetalAcceleration: z.boolean().optional(),
        enableCoreMLConversion: z.boolean().optional(),
        maxMemoryUsage: z.number().optional(),
        enableMemoryMapping: z.boolean().optional(),
        threadCount: z.number().optional(),
        batchSize: z.number().optional(),
        preferredFormat: z.enum(["gguf", "mlx", "auto"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, save to database
      return {
        success: true,
        userId: ctx.user.id,
        settings: input,
      };
    }),
});
