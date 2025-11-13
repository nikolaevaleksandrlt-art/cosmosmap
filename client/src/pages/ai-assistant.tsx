import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { mockAIResponses } from "@/lib/mockData";
import type { ChatMessage } from "@shared/schema";

const suggestedQueries = [
  "What is Sagittarius A*?",
  "Explain gravitational waves",
  "Show me nearby stars",
  "What are fast radio bursts?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your cosmic AI assistant. I can help you explore astronomical objects, explain phenomena, and analyze patterns in the data. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response =
        mockAIResponses[input] || mockAIResponses.default;

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            AI Assistant
          </h1>
        </div>
        <p className="text-muted-foreground">
          Ask questions about cosmic objects, events, and phenomena
        </p>
      </div>

      <div className="flex flex-col h-[calc(100%-8rem)]">
        {/* Suggested queries */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3">
              Try asking about:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query) => (
                <Badge
                  key={query}
                  variant="outline"
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleSuggestedQuery(query)}
                  data-testid={`badge-suggested-query-${query}`}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        <Card className="flex-1 p-6 mb-4 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary/20 ml-auto"
                        : "bg-muted/50 mr-auto"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        AI Assistant
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Input area */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about cosmic objects, events, or phenomena..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            data-testid="input-chat"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
