import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Plus, Trash2, Archive } from "lucide-react";
import { Streamdown } from "streamdown";

interface Conversation {
  id: number;
  title: string;
  modelId: number;
  systemPromptId?: number | null;
  isArchived: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string | any;
  createdAt: Date;
}

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversationsList } = trpc.chat.listConversations.useQuery();
  const { data: modelsList } = trpc.chat.listModels.useQuery();
  const { data: systemPromptsList } = trpc.chat.listSystemPrompts.useQuery();

  // Mutations
  const createConvMutation = trpc.chat.createConversation.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const deleteConvMutation = trpc.chat.deleteConversation.useMutation();
  const archiveConvMutation = trpc.chat.archiveConversation.useMutation();

  useEffect(() => {
    if (conversationsList) {
      setConversations(conversationsList);
    }
  }, [conversationsList]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateConversation = async () => {
    if (!selectedModel) return;

    try {
      const result = await createConvMutation.mutateAsync({
        title: `Conversation - ${new Date().toLocaleDateString()}`,
        modelId: parseInt(selectedModel),
        systemPromptId: selectedSystemPrompt ? parseInt(selectedSystemPrompt) : undefined,
      });

      // Refresh conversations list
      if (conversationsList) {
        setConversations(conversationsList);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation) return;

    setIsLoading(true);
    try {
      const result = await sendMessageMutation.mutateAsync({
        conversationId: currentConversation.id,
        content: messageInput,
      });

      // Add messages to the list
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          conversationId: currentConversation.id,
          role: "user",
          content: result.userMessage,
          createdAt: new Date(),
        },
        {
          id: Date.now() + 1,
          conversationId: currentConversation.id,
          role: "assistant",
          content: result.assistantMessage,
          createdAt: new Date(),
        },
      ]);

      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (convId: number) => {
    try {
      await deleteConvMutation.mutateAsync({ conversationId: convId });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleArchiveConversation = async (convId: number) => {
    try {
      await archiveConvMutation.mutateAsync({ conversationId: convId });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, isArchived: true } : c))
      );
    } catch (error) {
      console.error("Failed to archive conversation:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">TogetherChat</h1>
          <p className="text-sm text-muted-foreground mt-1">Multi-Model AI Chat</p>
        </div>

        {/* New Conversation */}
        <div className="p-6 border-b border-border space-y-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {modelsList?.map((model: any) => (
                <SelectItem key={model.id} value={model.id.toString()}>
                  {model.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSystemPrompt} onValueChange={setSelectedSystemPrompt}>
            <SelectTrigger>
              <SelectValue placeholder="System Prompt (Optional)" />
            </SelectTrigger>
            <SelectContent>
              {systemPromptsList?.map((prompt: any) => (
                <SelectItem key={prompt.id} value={prompt.id.toString()}>
                  {prompt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleCreateConversation}
            className="w-full bg-accent text-accent-foreground hover:opacity-90"
            disabled={!selectedModel}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations
            .filter((c) => !c.isArchived)
            .map((conv) => (
              <div
                key={conv.id}
                className={`p-3 cursor-pointer border border-border hover:bg-muted transition-colors ${
                  currentConversation?.id === conv.id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setCurrentConversation(conv);
                  setMessages([]);
                }}
              >
                <p className="text-sm font-semibold text-foreground truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveConversation(conv.id);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Archive className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-border p-6 bg-card">
              <h2 className="text-2xl font-bold text-foreground">{currentConversation.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Model: {modelsList?.find((m: any) => m.id === currentConversation.modelId)?.displayName}
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-foreground">Start a conversation</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Send your first message to begin
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xl px-6 py-4 border ${
                        msg.role === "user"
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <Streamdown>{msg.content}</Streamdown>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-6 bg-card">
              <div className="flex gap-4">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !messageInput.trim()}
                  className="bg-accent text-accent-foreground hover:opacity-90"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-accent mx-auto mb-6"></div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to TogetherChat</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Select a model and create a new conversation to get started
              </p>
              <p className="text-sm text-muted-foreground">
                Multi-model AI chat with support for OpenAI, Anthropic, Groq, and more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
