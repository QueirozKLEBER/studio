'use server';

/**
 * @fileOverview Fluxo de IA para o Assistente MFIT Personal.
 * Implementa um modo de simulação (Mock) caso a chave de API não esteja presente.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MfitAssistantInputSchema = z.object({
  message: z.string().describe('A pergunta ou mensagem enviada pelo usuário.'),
});

export type MfitAssistantInput = z.infer<typeof MfitAssistantInputSchema>;

const MfitAssistantOutputSchema = z.object({
  response: z.string().describe('A resposta gerada pelo assistente fitness.'),
});

export type MfitAssistantOutput = z.infer<typeof MfitAssistantOutputSchema>;

/**
 * Respostas simuladas para quando a chave de API não está configurada.
 */
const MOCK_RESPONSES: Record<string, string> = {
  'default': 'Como seu Professor MFIT, recomendo focar na técnica hoje! Qual sua dúvida específica sobre o treino?',
  'dieta': 'Para melhores resultados, mantenha uma ingestão constante de proteínas e hidrate-se bem. Quer uma sugestão de pré-treino?',
  'supino': 'No supino, mantenha as escápulas aduzidas e os pés firmes no chão para maior estabilidade e ativação do peitoral.',
  'braço': 'Para braços maiores, não negligencie o tríceps! Ele compõe 2/3 do volume do braço. Vamos focar em extensões hoje?',
};

export async function mfitAssistant(input: MfitAssistantInput): Promise<MfitAssistantOutput> {
  return mfitAssistantFlow(input);
}

const mfitAssistantFlow = ai.defineFlow(
  {
    name: 'mfitAssistantFlow',
    inputSchema: MfitAssistantInputSchema,
    outputSchema: MfitAssistantOutputSchema,
  },
  async (input) => {
    // Verifica se a chave de API existe
    const hasApiKey = !!process.env.GOOGLE_GENAI_API_KEY;

    if (!hasApiKey) {
      // Retorna uma resposta simulada para não travar a experiência do usuário
      const msg = input.message.toLowerCase();
      let response = MOCK_RESPONSES.default;
      
      if (msg.includes('diet') || msg.includes('comê') || msg.includes('nutri')) response = MOCK_RESPONSES.dieta;
      if (msg.includes('supino')) response = MOCK_RESPONSES.supino;
      if (msg.includes('braço') || msg.includes('bíceps')) response = MOCK_RESPONSES.braço;

      return {
        response: `[MODO DEMO] ${response}\n\n(Nota: Para respostas reais da IA, adicione sua GOOGLE_GENAI_API_KEY no arquivo .env)`,
      };
    }

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: `Você é o Professor MFIT, o personal trainer virtual oficial do app MFIT Personal. 
        Sua missão é ser o melhor parceiro de treino do usuário.
        
        Diretrizes:
        1. Responda de forma motivadora, técnica e profissional.
        2. Foco em: Execução de exercícios, nutrição esportiva e disciplina.
        3. Idioma: Português do Brasil.
        4. Seja conciso mas completo.`,
        prompt: input.message,
      });

      return {
        response: response.text || 'Desculpe, não consegui processar sua dúvida agora.',
      };
    } catch (error: any) {
      console.error('Erro na geração da IA:', error);
      return {
        response: 'Estou com uma instabilidade técnica momentânea. Pode tentar novamente em alguns instantes?',
      };
    }
  }
);
