import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { generateImage } from "../_core/imageGeneration";
import { getDb } from "../db";
import { messages } from "../../drizzle/schema";

export const imagesRouter = router({
  // Generate an image from text prompt
  generateImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        conversationId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { url: imageUrl } = await generateImage({
          prompt: input.prompt,
        });

        // Store the generated image reference in the conversation
        const db = await getDb();
        if (db) {
          await db.insert(messages).values({
            conversationId: input.conversationId,
            role: "system",
            content: JSON.stringify({
              type: "image_generation",
              prompt: input.prompt,
              imageUrl,
              generatedAt: new Date().toISOString(),
            }),
          });
        }

        return {
          imageUrl,
          prompt: input.prompt,
        };
      } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image");
      }
    }),

  // Edit an image based on a prompt
  editImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        originalImageUrl: z.string().url(),
        conversationId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { url: imageUrl } = await generateImage({
          prompt: input.prompt,
          originalImages: [
            {
              url: input.originalImageUrl,
              mimeType: "image/jpeg",
            },
          ],
        });

        // Store the edited image reference in the conversation
        const db = await getDb();
        if (db) {
          await db.insert(messages).values({
            conversationId: input.conversationId,
            role: "system",
            content: JSON.stringify({
              type: "image_edit",
              prompt: input.prompt,
              originalImageUrl: input.originalImageUrl,
              editedImageUrl: imageUrl,
              generatedAt: new Date().toISOString(),
            }),
          });
        }

        return {
          imageUrl,
          prompt: input.prompt,
          originalImageUrl: input.originalImageUrl,
        };
      } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image");
      }
    }),
});
