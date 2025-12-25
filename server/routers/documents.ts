import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { documents, documentChunks } from "../../drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { storagePut, storageGet } from "../storage";
import { getUserDocuments } from "../db";

// Simple text chunking function (in production, use more sophisticated chunking)
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.substring(i, end));
    i += chunkSize - overlap;
  }

  return chunks;
}

// Simple similarity scoring (in production, use vector embeddings)
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word of queryWords) {
    if (textWords.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  }
  
  return matches / Math.max(queryWords.length, 1);
}

export const documentsRouter = router({
  // Upload a document
  uploadDocument: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Upload file to S3
        const s3Key = `documents/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url: s3Url } = await storagePut(s3Key, input.content, input.fileType);

        // Create document record
        const result = await db.insert(documents).values({
          userId: ctx.user.id,
          title: input.title,
          fileName: input.fileName,
          fileType: input.fileType,
          fileSize: input.content.length,
          s3Key,
          s3Url,
          content: input.content,
          isProcessed: false,
        });

        // Get the inserted document ID
        const docId = (result as any).insertId;

        // Chunk the document
        const chunks = chunkText(input.content);

        // Store chunks in database
        for (let i = 0; i < chunks.length; i++) {
          await db.insert(documentChunks).values({
            documentId: docId,
            chunkIndex: i,
            chunkText: chunks[i],
            embedding: null, // In production, generate embeddings here
          });
        }

        // Mark document as processed
        await db
          .update(documents)
          .set({ isProcessed: true })
          .where(eq(documents.id, docId));

        return {
          id: docId,
          title: input.title,
          fileName: input.fileName,
          s3Url,
          chunkCount: chunks.length,
        };
      } catch (error) {
        console.error("Error uploading document:", error);
        throw new Error("Failed to upload document");
      }
    }),

  // List user's documents
  listDocuments: protectedProcedure.query(async ({ ctx }) => {
    return getUserDocuments(ctx.user.id);
  }),

  // Delete a document
  deleteDocument: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const doc = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.documentId))
        .limit(1);

      if (doc.length === 0 || (doc[0] as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Delete chunks
      await db
        .delete(documentChunks)
        .where(eq(documentChunks.documentId, input.documentId));

      // Delete document
      await db
        .delete(documents)
        .where(eq(documents.id, input.documentId));

      return { success: true };
    }),

  // Retrieve relevant document chunks for RAG
  retrieveRelevantChunks: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().default(5),
        documentIds: z.array(z.number()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get user's documents
      const userDocs = await getUserDocuments(ctx.user.id);
      const docIds = input.documentIds || userDocs.map((d: any) => d.id);

      if (docIds.length === 0) {
        return [];
      }

      // Get all chunks from user's documents
      const allChunks = await db
        .select()
        .from(documentChunks)
        .where(inArray(documentChunks.documentId, docIds));

      // Score and sort chunks by relevance
      const scoredChunks = allChunks.map((chunk) => ({
        ...chunk,
        score: calculateSimilarity(input.query, chunk.chunkText),
      }));

      // Return top chunks
      return scoredChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, input.limit)
        .map((chunk) => ({
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.chunkText,
          score: chunk.score,
        }));
    }),

  // Get document content
  getDocument: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const doc = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.documentId))
        .limit(1);

      if (doc.length === 0 || (doc[0] as any).userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return doc[0];
    }),
});
