import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export function useChat() {
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  const { data: chatHistory = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/history'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; language: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", data);
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const sendMessage = useCallback((message: string, language: string = "en") => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ message: message.trim(), language });
  }, [sendMessageMutation]);

  return {
    chatHistory,
    isLoading,
    isTyping,
    sendMessage,
    isPending: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}
