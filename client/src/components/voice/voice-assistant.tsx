import { Mic, MicOff } from "lucide-react";
import { Button } from "../ui/button";
import { useVoiceAssistant } from "../../hooks/use-voice-assistant";
import { useLanguage } from "../../lib/language";
import { useTranslation } from "../../lib/translations";
import { useEffect } from "react";

export default function VoiceAssistant() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { isListening, isSupported, startListening, stopListening, initializeVoiceRecognition } = useVoiceAssistant();

  useEffect(() => {
    initializeVoiceRecognition();
  }, [initializeVoiceRecognition]);

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        {t('voice_not_supported') || 'Voice recognition not supported in this browser'}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={isListening ? stopListening : startListening}
        variant={isListening ? "destructive" : "default"}
        size="lg"
        className="rounded-full p-4"
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      
      <div className="text-sm text-center">
        {isListening ? (
          <span className="text-red-600 dark:text-red-400 animate-pulse">
            {t('listening')}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {t('voice_assistant')}
          </span>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground text-center max-w-xs">
        <p className="mb-2">Try saying:</p>
        <div className="space-y-1">
          <div>"chat" or "talk to assistant"</div>
          <div>"disease" or "health check"</div>
          <div>"plant care" or "gardening"</div>
          <div>"home" or "go back"</div>
        </div>
      </div>
    </div>
  );
}