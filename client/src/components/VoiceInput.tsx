import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscription, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcribeMutation = trpc.voice.transcribeAudio.useMutation();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleTranscription(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      // Upload blob to S3 first
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      // In production, upload to S3 and get URL
      // For now, we'll use a placeholder
      const audioUrl = URL.createObjectURL(blob);

      const result = await transcribeMutation.mutateAsync({
        audioUrl,
        language: "en",
      });

      if (result.text) {
        onTranscription(result.text);
        toast.success("Audio transcribed successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to transcribe audio");
    } finally {
      setIsTranscribing(false);
    }
  };

  const label = isTranscribing
    ? "Transcribing audio..."
    : isRecording
      ? "Stop recording"
      : "Start voice recording";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isTranscribing}
            aria-label={label}
            className={isRecording ? "animate-pulse" : ""}
          >
            {isTranscribing ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isRecording ? (
              <Square className="size-5" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
