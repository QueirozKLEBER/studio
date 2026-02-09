'use server';

/**
 * @fileOverview Fluxo de IA para o Assistente MFIT Personal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/google-genai';

const MfitAssistantInputSchema = z.object({
  message: z.string().describe('A pergunta ou mensagem enviada pelo usuário.'),
});

export type MfitAssistantInput = z.infer<typeof MfitAssistantInputSchema>;

const MfitAssistantOutputSchema = z.object({
  response: z.string().describe('A resposta gerada pelo assistente fitness.'),
});

export type MfitAssistantOutput = z.infer<typeof MfitAssistantOutputSchema>;

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
    try {
      const response = await ai.generate({
        model: gemini15Flash,
        system: `Você é o Professor MFIT, o personal trainer virtual oficial do app MFIT Personal. 
        Sua missão é ser o melhor parceiro de treino do usuário.
        
        Diretrizes:
        1. Responda de forma motivadora, técnica e profissional.
        2. Foco em: Execução de exercícios, nutrição esportiva e disciplina.
        3. Idioma: Português do Brasil.
        4. Seja conciso mas completo.
        
        Se o usuário perguntar algo fora do escopo fitness, tente trazer o assunto de volta para saúde ou recomende um especialista.`,
        prompt: input.message,
      });

      if (!response.text) {
        throw new Error('Nenhuma resposta gerada.');
      }

      return {
        response: response.text,
      };
    } catch (error: any) {
      console.error('Erro no Assistente:', error);
      
      if (error.message?.includes('API_KEY') || error.message?.includes('403')) {
        return {
          response: '⚠️ Erro de Configuração: A chave GOOGLE_GENAI_API_KEY não foi encontrada ou é inválida no arquivo .env. Por favor, adicione uma chave válida do Google AI Studio.',
        };
      }

      return {
        response: 'Desculpe, tive um pequeno problema técnico. Pode tentar perguntar novamente?',
      };
    }
  }
);
