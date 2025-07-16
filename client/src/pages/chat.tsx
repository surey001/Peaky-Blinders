import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatInterface from "@/components/chat/chat-interface";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-farm-green p-3 rounded-lg">
            <MessageCircle className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
        </div>
        <p className="text-gray-600">Get expert farming advice and guidance from our AI assistant</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ChatInterface />
        </CardContent>
      </Card>
    </div>
  );
}
