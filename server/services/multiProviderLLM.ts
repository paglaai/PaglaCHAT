import { invokeLLM } from "../_core/llm";

export type ProviderType = "openai" | "anthropic" | "groq" | "gemini" | "openrouter" | "ollama" | "lmstudio" | "llama-cpp" | "llamabarn" | "qwen" | "zhipu" | "kimi" | "comfyui" | "together";

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | object;
}

export interface ProviderConfig {
  provider: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface LocalModelConfig {
  modelPath: string;
  format: "gguf" | "mlx" | "safetensors";
  quantization?: string;
  metalAcceleration?: boolean;
  coreMLConversion?: boolean;
  maxMemory?: number; // in GB
  threadCount?: number;
}

/**
 * Multi-Provider LLM Service
 * Handles requests to different LLM providers with unified interface
 */
export class MultiProviderLLMService {
  /**
   * Invoke LLM with provider-specific handling
   */
  static async invoke(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    switch (config.provider) {
      case "openai":
        return this.invokeOpenAI(messages, config);
      case "anthropic":
        return this.invokeAnthropic(messages, config);
      case "groq":
        return this.invokeGroq(messages, config);
      case "gemini":
        return this.invokeGemini(messages, config);
      case "openrouter":
        return this.invokeOpenRouter(messages, config);
      case "ollama":
        return this.invokeOllama(messages, config);
      case "lmstudio":
        return this.invokeLMStudio(messages, config);
      case "llama-cpp":
        return this.invokeLlamaCpp(messages, config);
      case "llamabarn":
        return this.invokeLlamaBarn(messages, config);
      case "qwen":
        return this.invokeQwen(messages, config);
      case "zhipu":
        return this.invokeZhipu(messages, config);
      case "kimi":
        return this.invokeKimi(messages, config);
      case "comfyui":
        return this.invokeComfyUI(messages, config);
      case "together":
        return this.invokeTogether(messages, config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  /**
   * OpenAI API (GPT-4, GPT-3.5-Turbo)
   */
  private static async invokeOpenAI(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Anthropic API (Claude)
   */
  private static async invokeAnthropic(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens || 2048,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
          })),
        system: messages.find((m) => m.role === "system")?.content || "",
      }),
    });

    const data = (await response.json()) as { content: Array<{ text: string }> };
    return data.content[0]?.text || "";
  }

  /**
   * Groq API (Fast inference)
   */
  private static async invokeGroq(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Google Gemini API
   */
  private static async invokeGemini(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages
            .filter((m) => m.role !== "system")
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [
                {
                  text: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
                },
              ],
            })),
          generationConfig: {
            temperature: config.temperature || 0.7,
            maxOutputTokens: config.maxTokens || 2048,
            topP: config.topP || 0.95,
          },
        }),
      }
    );

    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    return data.candidates[0]?.content.parts[0]?.text || "";
  }

  /**
   * OpenRouter API (Multi-model aggregator)
   */
  private static async invokeOpenRouter(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Ollama (Local model inference)
   */
  private static async invokeOllama(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const baseUrl = config.baseUrl || "http://localhost:11434";
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        stream: false,
        options: {
          temperature: config.temperature || 0.7,
          num_predict: config.maxTokens || 2048,
        },
      }),
    });

    const data = (await response.json()) as { message: { content: string } };
    return data.message.content || "";
  }

  /**
   * LM Studio (Local model inference)
   */
  private static async invokeLMStudio(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const baseUrl = config.baseUrl || "http://localhost:1234";
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Llama.cpp (Local inference with .gguf models)
   */
  private static async invokeLlamaCpp(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const baseUrl = config.baseUrl || "http://localhost:8000";
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * LlamaBarn (Model hosting and inference)
   */
  private static async invokeLlamaBarn(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.llamabarn.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Qwen (Alibaba's LLM)
   */
  private static async invokeQwen(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        input: {
          messages: messages.map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
          })),
        },
        parameters: {
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 2048,
        },
      }),
    });

    const data = (await response.json()) as { output: { text: string } };
    return data.output.text || "";
  }

  /**
   * Zhipu (Chinese LLM)
   */
  private static async invokeZhipu(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * Kimi (Chinese LLM)
   */
  private static async invokeKimi(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 2048,
      }),
    });

    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content || "";
  }

  /**
   * ComfyUI (Image generation and processing)
   */
  private static async invokeComfyUI(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const baseUrl = config.baseUrl || "http://localhost:8188";
    // ComfyUI is primarily for image generation, but can be integrated for workflow execution
    const response = await fetch(`${baseUrl}/api/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: messages.find((m) => m.role === "user")?.content || "",
        // Additional ComfyUI-specific parameters would go here
      }),
    });

    const data = (await response.json()) as { status: string };
    return data.status || "ComfyUI workflow executed";
  }

  /**
   * Together AI (Multi-model inference)
   */
  private static async invokeTogether(
    messages: LLMMessage[],
    config: ProviderConfig
  ): Promise<string> {
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        prompt: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
        max_tokens: config.maxTokens || 2048,
        temperature: config.temperature || 0.7,
      }),
    });

    const data = (await response.json()) as { output: { choices: Array<{ text: string }> } };
    return data.output.choices[0]?.text || "";
  }

  /**
   * Check provider availability
   */
  static async checkProviderHealth(config: ProviderConfig): Promise<boolean> {
    try {
      const testMessage: LLMMessage[] = [
        {
          role: "user",
          content: "ping",
        },
      ];
      await this.invoke(testMessage, config);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get provider info
   */
  static getProviderInfo(provider: ProviderType): {
    name: string;
    type: "cloud" | "local" | "hybrid";
    requiresAuth: boolean;
    supportedFormats: string[];
  } {
    const providerInfo: Record<
      ProviderType,
      { name: string; type: "cloud" | "local" | "hybrid"; requiresAuth: boolean; supportedFormats: string[] }
    > = {
      openai: {
        name: "OpenAI",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      anthropic: {
        name: "Anthropic",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      groq: {
        name: "Groq",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      gemini: {
        name: "Google Gemini",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      openrouter: {
        name: "OpenRouter",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      ollama: {
        name: "Ollama",
        type: "local",
        requiresAuth: false,
        supportedFormats: ["gguf"],
      },
      "lmstudio": {
        name: "LM Studio",
        type: "local",
        requiresAuth: false,
        supportedFormats: ["gguf", "safetensors"],
      },
      "llama-cpp": {
        name: "Llama.cpp",
        type: "local",
        requiresAuth: false,
        supportedFormats: ["gguf"],
      },
      llamabarn: {
        name: "LlamaBarn",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      qwen: {
        name: "Qwen",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      zhipu: {
        name: "Zhipu",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      kimi: {
        name: "Kimi",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
      comfyui: {
        name: "ComfyUI",
        type: "local",
        requiresAuth: false,
        supportedFormats: ["safetensors", "ckpt"],
      },
      together: {
        name: "Together AI",
        type: "cloud",
        requiresAuth: true,
        supportedFormats: ["api"],
      },
    };

    return providerInfo[provider];
  }
}
