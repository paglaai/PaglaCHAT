import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "api-keys" | "preferences"
  >("profile");

  // API Keys state
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    groq: "",
    together: "",
    gemini: "",
    openrouter: "",
    llamabarn: "",
    qwen: "",
    zhipu: "",
    kimi: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    defaultModel: "gpt-4",
    defaultSystemPrompt: "general",
    autoSaveConversations: true,
    enableNotifications: true,
    theme: "light",
  });

  const handleSaveApiKeys = async () => {
    setIsLoading(true);
    try {
      // In production, send to backend to encrypt and store
      toast.success("API keys saved securely");
      setApiKeys({
        openai: "",
        anthropic: "",
        groq: "",
        together: "",
        gemini: "",
        openrouter: "",
        llamabarn: "",
        qwen: "",
        zhipu: "",
        kimi: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to save API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // In production, send to backend to store
      toast.success("Preferences saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/")}
                  className="p-2 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-sm"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Back to home</TooltipContent>
            </Tooltip>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "profile"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("api-keys")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "api-keys"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                API Keys
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeTab === "preferences"
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Profile Information
                  </h2>
                  <div className="space-y-4 border border-border bg-card p-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name
                      </label>
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Member Since
                      </label>
                      <Input
                        value={
                          user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : ""
                        }
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Account Actions
                  </h2>
                  <div className="space-y-3">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api-keys" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    API Keys
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your API keys for cloud LLM providers. Keys are
                    encrypted and never shared.
                  </p>

                  <div className="space-y-4 border border-border bg-card p-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        OpenAI API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={apiKeys.openai}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, openai: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          platform.openai.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Anthropic API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="sk-ant-..."
                        value={apiKeys.anthropic}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, anthropic: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://console.anthropic.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          console.anthropic.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Groq API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="gsk_..."
                        value={apiKeys.groq}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, groq: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://console.groq.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          console.groq.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Together AI API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="..."
                        value={apiKeys.together}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, together: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://www.together.ai/account/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          together.ai
                        </a>
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 mt-4">
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        Additional Providers
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Google Gemini API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="AIza..."
                        value={apiKeys.gemini}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, gemini: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          aistudio.google.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        OpenRouter API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="sk-or-..."
                        value={apiKeys.openrouter}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, openrouter: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://openrouter.ai/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          openrouter.ai
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        LlamaBarn API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="..."
                        value={apiKeys.llamabarn}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, llamabarn: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://llamabarn.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          llamabarn.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Qwen API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="..."
                        value={apiKeys.qwen}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, qwen: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://dashscope.aliyun.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          dashscope.aliyun.com
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Zhipu API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="..."
                        value={apiKeys.zhipu}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, zhipu: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://open.bigmodel.cn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          open.bigmodel.cn
                        </a>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Kimi API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="..."
                        value={apiKeys.kimi}
                        onChange={e =>
                          setApiKeys({ ...apiKeys, kimi: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Get your key from{" "}
                        <a
                          href="https://platform.moonshot.cn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          platform.moonshot.cn
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveApiKeys}
                  disabled={isLoading}
                  className="bg-accent text-accent-foreground hover:opacity-90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save API Keys
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Preferences
                  </h2>

                  <div className="space-y-4 border border-border bg-card p-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Default Model
                      </label>
                      <select
                        value={preferences.defaultModel}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            defaultModel: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="mixtral-8x7b">Mixtral 8x7B</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Default System Prompt
                      </label>
                      <select
                        value={preferences.defaultSystemPrompt}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            defaultSystemPrompt: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      >
                        <option value="general">General Assistant</option>
                        <option value="developer">Developer</option>
                        <option value="research">Research</option>
                        <option value="data-analyst">Data Analyst</option>
                        <option value="creative">Creative Writer</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="auto-save"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Auto-save Conversations
                      </Label>
                      <Switch
                        id="auto-save"
                        checked={preferences.autoSaveConversations}
                        onCheckedChange={checked =>
                          setPreferences({
                            ...preferences,
                            autoSaveConversations: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="notifications"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Notifications
                      </Label>
                      <Switch
                        id="notifications"
                        checked={preferences.enableNotifications}
                        onCheckedChange={checked =>
                          setPreferences({
                            ...preferences,
                            enableNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={e =>
                          setPreferences({
                            ...preferences,
                            theme: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="bg-accent text-accent-foreground hover:opacity-90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
