import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProviderConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string | null;
  providerName: string;
  onSave: (config: Record<string, string>) => void;
}

export function ProviderConfigDialog({
  isOpen,
  onClose,
  provider,
  providerName,
  onSave,
}: ProviderConfigDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [localModelPath, setLocalModelPath] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const config: Record<string, string> = {};
      if (apiKey) config.apiKey = apiKey;
      if (baseUrl) config.baseUrl = baseUrl;
      if (localModelPath) config.localModelPath = localModelPath;

      onSave(config);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isLocalProvider = [
    "ollama",
    "lmstudio",
    "llama-cpp",
    "comfyui",
  ].includes(provider || "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {providerName}</DialogTitle>
          <DialogDescription>
            Set up your {providerName} provider configuration
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={isLocalProvider ? "local" : "cloud"}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cloud">Cloud API</TabsTrigger>
            <TabsTrigger value="local">Local Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="cloud" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Keep your API keys secure. Never share them publicly.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base-url">Base URL (Optional)</Label>
              <Input
                id="base-url"
                type="url"
                placeholder="https://api.example.com"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure your local model path for offline inference
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="model-path">Model Path</Label>
              <Input
                id="model-path"
                type="text"
                placeholder="/path/to/model.gguf"
                value={localModelPath}
                onChange={e => setLocalModelPath(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base-url-local">Base URL</Label>
              <Input
                id="base-url-local"
                type="url"
                placeholder="http://localhost:8000"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
