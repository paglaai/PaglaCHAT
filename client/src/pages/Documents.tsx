import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: number;
  userId: number;
  title: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  s3Key: string;
  s3Url: string;
  content?: string | null;
  isProcessed: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: documentsList, refetch } =
    trpc.documents.listDocuments.useQuery();

  // Mutations
  const uploadMutation = trpc.documents.uploadDocument.useMutation();
  const deleteMutation = trpc.documents.deleteDocument.useMutation();

  // Update documents list when data changes
  if (documentsList && documents.length === 0) {
    setDocuments(documentsList);
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const content = await selectedFile.text();

      const result = await uploadMutation.mutateAsync({
        title: selectedFile.name.replace(/\.[^/.]+$/, ""),
        fileName: selectedFile.name,
        fileType: selectedFile.type || "text/plain",
        content,
      });

      toast.success(`Document uploaded: ${result.chunkCount} chunks created`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh documents list
      const updated = await refetch();
      if (updated.data) {
        setDocuments(updated.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      await deleteMutation.mutateAsync({ documentId: docId });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      toast.success("Document deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete document");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Documents</h1>
          <p className="text-lg text-muted-foreground">
            Upload and manage documents for retrieval-augmented generation
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Upload Section */}
        <div className="mb-12 border border-border bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Upload Document
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".txt,.md,.pdf,.doc,.docx"
                disabled={isUploading}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-accent text-accent-foreground hover:opacity-90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>

            {selectedFile && (
              <div className="p-4 bg-muted border border-border">
                <p className="text-sm font-semibold text-foreground">
                  Selected: {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Your Documents
          </h2>

          {documents.length === 0 ? (
            <div className="border border-border bg-card p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                No documents yet
              </p>
              <p className="text-muted-foreground">
                Upload your first document to get started with RAG
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="border border-border bg-card p-6 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {doc.title}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>File: {doc.fileName}</p>
                        <p>
                          Size:{" "}
                          {doc.fileSize
                            ? (doc.fileSize / 1024).toFixed(2)
                            : "0"}{" "}
                          KB
                        </p>
                        <p>
                          Uploaded:{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          Status:{" "}
                          {doc.isProcessed ? (
                            <span className="text-green-600">✓ Processed</span>
                          ) : (
                            <span className="text-yellow-600">
                              ⏳ Processing
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <a
                        href={doc.s3Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border hover:bg-muted transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-foreground" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
