import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { transcribeAudio } from "../_core/voiceTranscription";

export const voiceRouter = router({
  // Transcribe audio to text using Whisper API
  transcribeAudio: protectedProcedure
    .input(
      z.object({
        audioUrl: z.string().url(),
        language: z.string().optional(),
        prompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
          prompt: input.prompt,
        });

        const response = result as any;
        return {
          text: response.text || '',
          language: response.language || 'en',
          duration: response.duration,
          segments: response.segments || [],
        };
      } catch (error) {
        console.error("Error transcribing audio:", error);
        throw new Error("Failed to transcribe audio");
      }
    }),
});
