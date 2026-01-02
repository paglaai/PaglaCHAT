import { useState } from "react";
import { Download, Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageDisplayProps {
  imageUrl: string;
  prompt?: string;
  onEdit?: (prompt: string) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function ImageDisplay({
  imageUrl,
  prompt,
  onEdit,
  onDelete,
  isLoading,
}: ImageDisplayProps) {
  const [showEditPrompt, setShowEditPrompt] = useState(false);
  const [editPrompt, setEditPrompt] = useState(prompt || "");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded");
  };

  const handleEdit = () => {
    if (editPrompt.trim() && onEdit) {
      onEdit(editPrompt);
      setShowEditPrompt(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative group inline-block">
        <img
          src={imageUrl}
          alt={prompt || "Generated image"}
          className="max-w-sm rounded border border-border"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {prompt && (
        <p className="text-sm text-muted-foreground italic">
          Prompt: {prompt}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        {onEdit && (
          <Button
            onClick={() => setShowEditPrompt(!showEditPrompt)}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}

        {onDelete && (
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>

      {showEditPrompt && onEdit && (
        <div className="space-y-2 p-3 bg-muted rounded">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="Describe the changes you want to make..."
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              size="sm"
              className="bg-accent text-accent-foreground hover:opacity-90"
              disabled={isLoading || !editPrompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Editing...
                </>
              ) : (
                "Apply Edit"
              )}
            </Button>
            <Button
              onClick={() => setShowEditPrompt(false)}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
