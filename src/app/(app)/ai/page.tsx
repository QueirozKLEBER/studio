'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User, Sparkles, Loader2, Dumbbell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mfitAssistant } from '@/ai/flows/mfit-assistant-flow';
import { useUser } from '@/firebase';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiProfessorPage() {
  const { profile } = useUser();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicializa a saudação com o nome do aluno
  useEffect(() => {
    if (profile && messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: `Olá, ${profile.firstName}! Sou o Professor MFIT, seu assistente de elite. Pelo seu perfil de ${profile.weight}kg, podemos ajustar sua estratégia de hoje. No que posso te ajudar a evoluir?` 
      }]);
    }
  }, [profile]);

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
      const result = await mfitAssistant({ 
        message: messageText,
        userProfile: {
          firstName: profile?.firstName,
          height: profile?.height,
          weight: profile?.weight,
          userType: profile?.userType
        }
      });
      
      const aiMessage: Message = { 
        role: 'assistant', 
        content: result.response 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Foco no treino! Tive um problema técnico, mas já estou voltando. Pode repetir?' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] max-w-5xl mx-auto w-full">
      <div className="flex-shrink-0 mb-4 px-1">
        <PageHeader 
          title="IA do Professor" 
          subtitle="Seu personal trainer virtual com conhecimento científico 24/7." 
        />
      </div>

      <Card className="flex-1 flex flex-col rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden mb-4">
        <CardHeader className="border-b bg-primary/5 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary text-white rounded-[1.2rem] shadow-lg shadow-primary/20">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base font-black uppercase tracking-tight">Professor MFIT</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Consultoria Ativa</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <Badge variant="outline" className="rounded-xl border-primary/20 text-primary font-bold">CIÊNCIA</Badge>
              <Badge variant="outline" className="rounded-xl border-primary/20 text-primary font-bold">PERFORMANCE</Badge>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6 bg-slate-50/30">
          <div className="flex flex-col gap-6">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex items-start gap-4 max-w-[90%] md:max-w-[75%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                  m.role === 'assistant' ? "bg-primary text-white" : "bg-white border-2 text-gray-400"
                )}>
                  {m.role === 'assistant' ? <Zap className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className={cn(
                  "p-5 rounded-[1.8rem] text-sm leading-relaxed shadow-sm",
                  m.role === 'assistant' 
                    ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" 
                    : "bg-primary text-white rounded-tr-none font-medium"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center animate-pulse">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-white p-5 rounded-[1.8rem] rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-white">
          <div className="flex gap-3">
            <Input 
              placeholder="Ex: Como melhorar meu agachamento?" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="rounded-2xl border-2 border-slate-100 h-14 bg-slate-50/50 focus-visible:ring-primary focus-visible:border-primary transition-all font-medium px-6"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading}
              className="rounded-2xl h-14 w-14 bg-primary shadow-lg shadow-primary/30 transition-all active:scale-90 hover:scale-105"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            </Button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {[
              { label: 'Analise meu biotipo', icon: Sparkles },
              { label: 'Dica de execução', icon: Dumbbell },
              { label: 'Macros para ganhar peso', icon: Zap }
            ].map((tip) => (
              <Button 
                key={tip.label} 
                variant="outline" 
                size="sm" 
                disabled={isLoading}
                onClick={() => handleSend(tip.label)} 
                className="rounded-full text-[10px] whitespace-nowrap border-slate-200 text-slate-600 font-black uppercase tracking-tighter hover:bg-primary/5 hover:border-primary/20 transition-all h-9"
              >
                <tip.icon className="h-3 w-3 mr-1 text-primary" />
                {tip.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
