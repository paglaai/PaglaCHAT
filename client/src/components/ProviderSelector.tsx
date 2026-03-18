import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: "cloud" | "local" | "hybrid";
  requiresAuth: boolean;
  supportedFormats: string[];
}

interface ProviderSelectorProps {
  selectedProvider: string | null;
  onProviderChange: (provider: string) => void;
  onProviderConfigClick?: () => void;
}

export function ProviderSelector({
  selectedProvider,
  onProviderChange,
  onProviderConfigClick,
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const { data: providersList } = trpc.providers.listProviders.useQuery();
  const checkHealthMutation = trpc.providers.checkProviderHealth.useMutation();

  useEffect(() => {
    if (providersList) {
      setProviders(providersList as Provider[]);
      setIsLoading(false);
    }
  }, [providersList]);

  const checkProviderHealth = async (providerId: string | null) => {
    if (!providerId) return;
    setIsCheckingHealth(true);
    try {
      const result = await checkHealthMutation.mutateAsync({
        provider: providerId,
        model: "gpt-3.5-turbo", // Default model for health check
      });
      setHealthStatus((prev) => ({
        ...prev,
        [providerId]: result.healthy,
      }));
    } catch (error) {
      console.error(`Failed to check health for ${providerId}:`, error);
      setHealthStatus((prev) => ({
        ...prev,
        [providerId]: false,
      }));
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const getProviderColor = (type: string) => {
    switch (type) {
      case "cloud":
        return "bg-blue-100 text-blue-800";
      case "local":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedProviderData = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          LLM Provider
        </label>
        {selectedProvider && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onProviderConfigClick}
            className="text-xs h-6"
          >
            Configure
          </Button>
        )}
      </div>

      <Select value={selectedProvider || ""} onValueChange={onProviderChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an LLM provider..." />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {isLoading ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Loading providers...
            </div>
          ) : (
            providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center gap-2">
                  <span>{provider.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getProviderColor(provider.type)}`}
                  >
                    {provider.type}
                  </Badge>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedProviderData && (
        <div className="mt-3 p-3 bg-card rounded-lg border border-border space-y-2">
          <p className="text-sm text-foreground font-medium">
            {selectedProviderData.name}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {selectedProviderData.type}
            </Badge>
            {selectedProviderData.requiresAuth && (
              <Badge variant="secondary" className="text-xs">
                API Key Required
              </Badge>
            )}
            {selectedProviderData.supportedFormats.map((format) => (
              <Badge key={format} variant="secondary" className="text-xs">
                {format.toUpperCase()}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedProvider && checkProviderHealth(selectedProvider)}
              disabled={isCheckingHealth || !selectedProvider}
              className="text-xs h-7"
            >
              {isCheckingHealth ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Health"
              )}
            </Button>

            {selectedProvider && healthStatus[selectedProvider] !== undefined && (
              <div className="flex items-center gap-1">
                {healthStatus[selectedProvider] ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">Healthy</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600">Unavailable</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
