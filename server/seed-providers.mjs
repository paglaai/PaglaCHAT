import mysql from "mysql2/promise";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const providers = [
  // Cloud-based providers
  {
    name: "Gemini",
    type: "cloud",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    description: "Google's Gemini AI models",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 32768,
    temperature: "0.7",
  },
  {
    name: "OpenRouter",
    type: "cloud",
    baseUrl: "https://openrouter.ai/api/v1",
    description: "Multi-model aggregator supporting 100+ models",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 8192,
    temperature: "0.7",
  },
  {
    name: "LlamaBarn",
    type: "cloud",
    baseUrl: "https://api.llamabarn.com/v1",
    description: "Llama model hosting and inference",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 4096,
    temperature: "0.7",
  },
  {
    name: "Qwen",
    type: "cloud",
    baseUrl: "https://dashscope.aliyuncs.com/api/v1",
    description: "Alibaba's Qwen LLM models",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 8192,
    temperature: "0.7",
  },
  {
    name: "Zhipu",
    type: "cloud",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    description: "Zhipu AI models (Chinese)",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 8192,
    temperature: "0.7",
  },
  {
    name: "Kimi",
    type: "cloud",
    baseUrl: "https://api.moonshot.cn/v1",
    description: "Kimi AI models (Chinese)",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 8192,
    temperature: "0.7",
  },
  {
    name: "Together AI",
    type: "cloud",
    baseUrl: "https://api.together.xyz",
    description: "Together AI multi-model inference",
    requiresAuth: 1,
    supportedFormats: ["api"],
    maxTokens: 4096,
    temperature: "0.7",
  },
  // Local providers
  {
    name: "Ollama",
    type: "local",
    baseUrl: "http://localhost:11434",
    description: "Local model inference with Ollama",
    requiresAuth: 0,
    supportedFormats: ["gguf"],
    maxTokens: 4096,
    temperature: "0.7",
  },
  {
    name: "LM Studio",
    type: "local",
    baseUrl: "http://localhost:1234",
    description: "LM Studio local model inference",
    requiresAuth: 0,
    supportedFormats: ["gguf", "safetensors"],
    maxTokens: 4096,
    temperature: "0.7",
  },
  {
    name: "Llama.cpp",
    type: "local",
    baseUrl: "http://localhost:8000",
    description: "Llama.cpp with .gguf model support",
    requiresAuth: 0,
    supportedFormats: ["gguf"],
    maxTokens: 4096,
    temperature: "0.7",
  },
  // Hybrid providers
  {
    name: "ComfyUI",
    type: "local",
    baseUrl: "http://localhost:8188",
    description: "ComfyUI for image generation and workflows",
    requiresAuth: 0,
    supportedFormats: ["safetensors", "ckpt"],
    maxTokens: 2048,
    temperature: "0.7",
  },
];

async function seedProviders() {
  let connection;
  try {
    connection = await mysql.createConnection(connectionString);

    console.log("🌱 Seeding LLM providers...");

    for (const provider of providers) {
      const query = `
        INSERT INTO providers (name, type, baseUrl, description, requiresAuth, supportedFormats, maxTokens, temperature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          type = VALUES(type),
          baseUrl = VALUES(baseUrl),
          description = VALUES(description),
          requiresAuth = VALUES(requiresAuth),
          supportedFormats = VALUES(supportedFormats),
          maxTokens = VALUES(maxTokens),
          temperature = VALUES(temperature)
      `;

      await connection.execute(query, [
        provider.name,
        provider.type,
        provider.baseUrl,
        provider.description,
        provider.requiresAuth,
        JSON.stringify(provider.supportedFormats),
        provider.maxTokens,
        provider.temperature,
      ]);

      console.log(`✓ Seeded provider: ${provider.name}`);
    }

    console.log("\n✅ All providers seeded successfully!");
    console.log(`Total providers: ${providers.length}`);
    console.log("\nProvider Summary:");
    console.log(
      "- Cloud providers: 7 (Gemini, OpenRouter, LlamaBarn, Qwen, Zhipu, Kimi, Together AI)"
    );
    console.log("- Local providers: 4 (Ollama, LM Studio, Llama.cpp, ComfyUI)");
  } catch (error) {
    console.error("❌ Error seeding providers:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedProviders();
