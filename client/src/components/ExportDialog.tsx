import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileText, FileCode } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ExportDialogProps {
  conversationId: number;
  conversationTitle?: string;
}

export function ExportDialog({
  conversationId,
  conversationTitle,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const exportMarkdown = trpc.export.exportAsMarkdown.useQuery(
    { conversationId },
    { enabled: false }
  );

  const exportJSON = trpc.export.exportAsJSON.useQuery(
    { conversationId },
    { enabled: false }
  );

  const exportPDF = trpc.export.exportAsPDF.useQuery(
    { conversationId },
    { enabled: false }
  );

  const handleExport = async (format: "markdown" | "json" | "pdf") => {
    setExporting(format);
    try {
      let data;
      let filename;
      let mimeType;

      switch (format) {
        case "markdown":
          data = await exportMarkdown.refetch();
          if (data.data) {
            filename = data.data.filename;
            mimeType = "text/markdown";
            downloadFile(data.data.content, filename, mimeType);
          }
          break;

        case "json":
          data = await exportJSON.refetch();
          if (data.data) {
            filename = data.data.filename;
            mimeType = "application/json";
            downloadFile(data.data.content, filename, mimeType);
          }
          break;

        case "pdf":
          data = await exportPDF.refetch();
          if (data.data) {
            filename = data.data.filename;
            mimeType = "text/html";
            downloadFile(data.data.content, filename, mimeType);
          }
          break;
      }

      toast.success(`Conversation exported as ${format.toUpperCase()}`);
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to export as ${format}`);
      console.error(error);
    } finally {
      setExporting(null);
    }
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Conversation</DialogTitle>
          <DialogDescription>
            Choose a format to export "{conversationTitle || "Conversation"}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("markdown")}
            disabled={exporting !== null}
          >
            <FileText className="w-4 h-4" />
            <div className="text-left">
              <div className="font-medium">Markdown</div>
              <div className="text-xs text-muted-foreground">
                Best for sharing and documentation
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("json")}
            disabled={exporting !== null}
          >
            <FileJson className="w-4 h-4" />
            <div className="text-left">
              <div className="font-medium">JSON</div>
              <div className="text-xs text-muted-foreground">
                Structured data format for integration
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
          >
            <FileCode className="w-4 h-4" />
            <div className="text-left">
              <div className="font-medium">PDF</div>
              <div className="text-xs text-muted-foreground">
                Printable document format
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
