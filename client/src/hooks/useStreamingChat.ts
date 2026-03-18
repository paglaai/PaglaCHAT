import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

interface StreamingMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
  isStreaming?: boolean;
}

interface UseStreamingChatOptions {
  conversationId: number;
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}

export function useStreamingChat({
  conversationId,
  provider = "openai",
  model,
  apiKey,
  baseUrl,
}: UseStreamingChatOptions) {
  const [messages, setMessages] = useState<StreamingMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessageMutation = trpc.streamingChat.sendMessageStreaming.useMutation();
  const checkProviderMutation = trpc.streamingChat.checkProviderAvailability.useMutation();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setError(null);
      setIsLoading(true);

      try {
        // Check provider availability first
        const healthCheck = await checkProviderMutation.mutateAsync({
          provider,
          model: model || "default",
          apiKey,
          baseUrl,
        });

        if (!healthCheck.available) {
          throw new Error(`Provider ${provider} is not available`);
        }

        // Send message with streaming
        const result = await sendMessageMutation.mutateAsync({
          conversationId,
          content,
          provider,
          model,
          apiKey,
          baseUrl,
        });

        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}`,
            role: "user",
            content: result.userMessage,
          },
        ]);

        // Add assistant message with streaming simulation
        const assistantId = `assistant-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            provider: result.provider,
            model: result.model,
            isStreaming: true,
          },
        ]);

        // Simulate streaming by gradually adding content
        // In production, this would use Server-Sent Events (SSE) or WebSocket
        let currentContent = "";
        const fullContent = result.assistantMessage;
        const chunkSize = Math.max(1, Math.floor(fullContent.length / 20));

        for (let i = 0; i < fullContent.length; i += chunkSize) {
          currentContent += fullContent.substring(i, i + chunkSize);
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: currentContent }
                : msg
            )
          );

          // Add a small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);
        console.error("Streaming chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, provider, model, apiKey, baseUrl, sendMessageMutation, checkProviderMutation]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
