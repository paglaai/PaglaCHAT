import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, Trash2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocalModel {
  id: string;
  name: string;
  path: string;
  format: "gguf" | "mlx" | "safetensors";
  size: number;
  quantization?: string;
  optimized: boolean;
}

interface LocalModelManagerProps {
  provider: string | null;
  onModelSelect: (modelPath: string) => void;
}

export function LocalModelManager({
  provider,
  onModelSelect,
}: LocalModelManagerProps) {
  const [modelPath, setModelPath] = useState("");
  const [modelFormat, setModelFormat] = useState<"gguf" | "mlx" | "safetensors">("gguf");
  const [quantization, setQuantization] = useState("Q4_K_M");
  const [isLoading, setIsLoading] = useState(false);
  const [localModels, setLocalModels] = useState<LocalModel[]>([]);

  const optimizeQuery = trpc.providers.getAppleSiliconOptimization.useQuery;
  const recommendQuantizationQuery = trpc.providers.getRecommendedQuantization.useQuery;

  const handleAddModel = async () => {
    if (!modelPath.trim()) return;

    setIsLoading(true);
    try {
      // Add model to local list (in production, this would be persisted to database)
      const newModel: LocalModel = {
        id: Date.now().toString(),
        name: modelPath.split("/").pop() || "Unknown",
        path: modelPath,
        format: modelFormat,
        size: 0, // Would be calculated in production
        quantization,
        optimized: false,
      };

      setLocalModels((prev) => [...prev, newModel]);
      setModelPath("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizeModel = async (model: LocalModel) => {
    try {
      // In production, this would call the query
      // For now, just mark as optimized
      const result = {
        recommendedQuantization: quantization,
      };

      // Update model with optimization results
      setLocalModels((prev) =>
        prev.map((m) =>
          m.id === model.id
            ? {
                ...m,
                optimized: true,
                quantization: result?.recommendedQuantization || quantization,
              }
            : m
        )
      );
    } catch (error) {
      console.error("Failed to optimize model:", error);
    }
  };

  const handleGetRecommendedQuantization = async (modelSizeGB: number) => {
    try {
      // In production, this would call the query
      // For now, just set a default
      const result = {
        recommendedQuantization: "Q4_K_M",
      };
      setQuantization(result.recommendedQuantization);
    } catch (error) {
      console.error("Failed to get recommended quantization:", error);
    }
  };

  const handleRemoveModel = (modelId: string) => {
    setLocalModels((prev) => prev.filter((m) => m.id !== modelId));
  };

  const isLocalProvider = ["ollama", "lmstudio", "llama-cpp", "comfyui"].includes(
    provider || ""
  );

  if (!isLocalProvider) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Local Model Manager</CardTitle>
        <CardDescription>
          Manage and optimize local models for offline inference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Local models are optimized for Apple Silicon (M2 Pro) with Metal acceleration
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-path">Model Path</Label>
            <Input
              id="model-path"
              type="text"
              placeholder="/path/to/model.gguf"
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={modelFormat} onValueChange={(value: any) => setModelFormat(value)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gguf">GGUF</SelectItem>
                  <SelectItem value="mlx">MLX</SelectItem>
                  <SelectItem value="safetensors">SafeTensors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantization">Quantization</Label>
              <Select value={quantization} onValueChange={setQuantization}>
                <SelectTrigger id="quantization">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q4_K_M">Q4_K_M</SelectItem>
                  <SelectItem value="Q5_K_S">Q5_K_S</SelectItem>
                  <SelectItem value="Q6_K">Q6_K</SelectItem>
                  <SelectItem value="Q8_0">Q8_0</SelectItem>
                  <SelectItem value="F16">F16</SelectItem>
                  <SelectItem value="F32">F32</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAddModel} disabled={isLoading || !modelPath.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Add Model
              </>
            )}
          </Button>
        </div>

        {localModels.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Loaded Models</h3>
            {localModels.map((model) => (
              <div
                key={model.id}
                className="p-3 bg-card rounded-lg border border-border space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{model.name}</p>
                    <p className="text-xs text-muted-foreground break-all">{model.path}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveModel(model.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {model.format.toUpperCase()}
                  </Badge>
                  {model.quantization && (
                    <Badge variant="secondary" className="text-xs">
                      {model.quantization}
                    </Badge>
                  )}
                  {model.optimized && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Optimized
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOptimizeModel(model)}
                    disabled={model.optimized}
                    className="text-xs h-7"
                  >
                    {model.optimized ? "Optimized" : "Optimize"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModelSelect(model.path)}
                    className="text-xs h-7"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
