'use server';

/**
 * @fileOverview Fluxo de IA para o Assistente MFIT Personal.
 * 
 * Este arquivo define o comportamento do personal trainer virtual,
 * utilizando o Genkit para processar as mensagens dos alunos.
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
 * Função exportada para ser chamada pelo frontend (Server Action).
 */
export async function mfitAssistant(input: MfitAssistantInput): Promise<MfitAssistantOutput> {
  return mfitAssistantFlow(input);
}

/**
 * Definição do fluxo Genkit para o assistente.
 */
const mfitAssistantFlow = ai.defineFlow(
  {
    name: 'mfitAssistantFlow',
    inputSchema: MfitAssistantInputSchema,
    outputSchema: MfitAssistantOutputSchema,
  },
  async (input) => {
    try {
      const response = await ai.generate({
        system: `Você é o Assistente MFIT Personal, um personal trainer virtual altamente qualificado, motivador e empático. 
        Sua missão é ajudar alunos a atingirem seus objetivos de fitness (emagrecimento, hipertrofia, saúde).
        Responda de forma profissional, clara e baseada em evidências em Português do Brasil.
        Mantenha as respostas concisas, motivadoras e focadas em resultados.`,
        prompt: input.message,
        config: {
          temperature: 0.7,
        }
      });

      const text = response.text;

      if (!text) {
        throw new Error('O modelo não retornou nenhum texto.');
      }

      return {
        response: text,
      };
    } catch (error: any) {
      // Log detalhado para depuração no ambiente do Firebase Studio
      console.error('Erro na IA do Professor:', error);
      
      let errorMsg = 'Desculpe, tive um problema técnico ao processar sua pergunta. Pode tentar novamente em alguns instantes?';
      
      // Identifica erros comuns de configuração de API para orientar o usuário
      if (error.message?.includes('API_KEY') || error.message?.includes('403') || error.message?.includes('key')) {
        errorMsg = 'Assistente em manutenção: A chave de API do Google AI não foi configurada corretamente. Por favor, adicione GOOGLE_GENAI_API_KEY ao seu arquivo .env.';
      }

      return {
        response: errorMsg,
      };
    }
  }
);
