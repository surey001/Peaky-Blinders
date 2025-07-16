import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";
import { MessageCircle, User, Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const queryClient = useQueryClient();

  const { data: chatHistory = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/history'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; language: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setMessage("");
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      message: message.trim(),
      language
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory, sendMessageMutation.isPending]);

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-farm-green to-leaf-green p-4 text-white">
        <div className="flex items-center space-x-3">
          <MessageCircle className="text-2xl" />
          <div>
            <h3 className="text-lg font-semibold">{t("chat_feature_title")}</h3>
            <p className="text-green-100 text-sm">{t("chat_subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-farm-green" />
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="space-y-4">
                {/* User Message */}
                <div className="flex space-x-3 justify-end">
                  <div className="bg-farm-green rounded-lg p-3 max-w-xs lg:max-w-md">
                    <p className="text-sm text-white">{chat.message}</p>
                  </div>
                  <div className="bg-gray-300 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <User className="text-gray-600 w-4 h-4" />
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex space-x-3">
                  <div className="bg-farm-green p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <MessageCircle className="text-white w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap prose prose-sm max-w-none">
                      {chat.response.split('\n').map((line, index) => {
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <div key={index} className="flex items-start gap-2 my-1">
                              <span className="text-farm-green">•</span>
                              <span>{line.replace(/^[•-]\s*/, '')}</span>
                            </div>
                          );
                        } else if (line.trim().length > 0) {
                          return (
                            <p key={index} className="my-2 leading-relaxed">
                              {line}
                            </p>
                          );
                        } else {
                          return <br key={index} />;
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator for new message */}
          {sendMessageMutation.isPending && (
            <div className="flex space-x-3">
              <div className="bg-farm-green p-2 rounded-full w-8 h-8 flex items-center justify-center">
                <MessageCircle className="text-white w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin text-farm-green" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about farming, crops, soil, weather..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-farm-green hover:bg-green-600"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
