'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mfitAssistant } from '@/ai/flows/mfit-assistant-flow';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiProfessorPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente inteligente do MFIT Personal. Como posso ajudar no seu treino hoje?' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await mfitAssistant({ message: messageText });
      const aiMessage: Message = { 
        role: 'assistant', 
        content: result.response 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Ops! Tive um problema técnico. Pode repetir a pergunta?' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      <div className="flex-shrink-0 mb-4">
        <PageHeader 
          title="IA do Professor" 
          subtitle="Seu personal trainer virtual disponível 24/7." 
        />
      </div>

      <Card className="flex-1 flex flex-col rounded-3xl border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="border-b bg-blue-50/50 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Assistente MFIT</CardTitle>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Online agora</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex items-start gap-3 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                  m.role === 'assistant' ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === 'assistant' ? "bg-blue-50 text-blue-900 rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl rounded-tl-none">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex gap-2">
            <Input 
              placeholder="Pergunte algo sobre seu treino..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="rounded-2xl border-none shadow-sm focus-visible:ring-primary"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading}
              className="rounded-2xl p-3 aspect-square bg-primary shadow-lg transition-transform active:scale-90"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            {['Dieta pré-treino', 'Como fazer supino?', 'Dicas de braço'].map((tip) => (
              <Button 
                key={tip} 
                variant="outline" 
                size="sm" 
                disabled={isLoading}
                onClick={() => handleSend(tip)} 
                className="rounded-full text-[10px] whitespace-nowrap border-primary/20 text-primary font-bold hover:bg-primary/5"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {tip}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
