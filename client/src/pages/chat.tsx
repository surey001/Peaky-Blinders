import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chat/chat-interface";
import VoiceAssistant from "@/components/voice/voice-assistant";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-green-600 p-3 rounded-lg">
            <MessageCircle className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("chat_title")}</h1>
        </div>
        <p className="text-gray-600">{t("chat_subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-8">
            <CardHeader>
              <CardTitle className="text-center">{t("voice_assistant")}</CardTitle>
            </CardHeader>
            <CardContent>
              <VoiceAssistant />
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-3 font-medium">Voice Commands:</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>"chat" or "talk to assistant"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>"disease" or "health check"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>"plant care" or "gardening"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    <span>"home" or "go back"</span>
                  </li>
                </ul>
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                  💡 The voice assistant now understands natural speech! Just mention keywords like "disease", "plant", "chat", or "home".
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
