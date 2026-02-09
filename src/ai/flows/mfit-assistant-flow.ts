'use server';

/**
 * @fileOverview Fluxo de IA para o Assistente MFIT Personal.
 * 
 * - mfitAssistant - Função que lida com as interações do chat.
 * - MfitAssistantInput - Esquema de entrada (mensagem do usuário).
 * - MfitAssistantOutput - Esquema de saída (resposta do assistente).
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
 * Função principal para invocar o assistente MFIT.
 */
export async function mfitAssistant(input: MfitAssistantInput): Promise<MfitAssistantOutput> {
  return mfitAssistantFlow(input);
}

/**
 * Definição do fluxo Genkit para o assistente com configurações de segurança relaxadas para desenvolvimento.
 */
const mfitAssistantFlow = ai.defineFlow(
  {
    name: 'mfitAssistantFlow',
    inputSchema: MfitAssistantInputSchema,
    outputSchema: MfitAssistantOutputSchema,
  },
  async (input) => {
    try {
      const { text } = await ai.generate({
        system: `Você é o Assistente MFIT Personal, um personal trainer virtual altamente qualificado, motivador e empático. 
        Sua missão é ajudar alunos a atingirem seus objetivos de fitness (emagrecimento, hipertrofia, saúde).
        Responda de forma profissional, clara e baseada em evidências. 
        Seja técnico quando necessário (explicando cadência, execução e nutrição), mas sempre acessível.
        Responda sempre em Português do Brasil.
        Mantenha as respostas concisas e motivadoras.`,
        prompt: input.message,
        config: {
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          ],
        }
      });

      return {
        response: text || 'Desculpe, não consegui pensar em uma resposta agora. Vamos tentar de outra forma?',
      };
    } catch (error) {
      console.error('Erro na geração da IA:', error);
      return {
        response: 'Desculpe, estou passando por uma manutenção rápida nos meus circuitos de treino. Pode tentar novamente em alguns segundos?',
      };
    }
  }
);
