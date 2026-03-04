'use server';

/**
 * @fileOverview Fluxo de IA aprimorado para o Assistente MFIT Personal.
 * Agora utiliza o contexto biômetro do usuário para respostas personalizadas.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MfitAssistantInputSchema = z.object({
  message: z.string().describe('A pergunta ou mensagem enviada pelo usuário.'),
  userProfile: z.object({
    firstName: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    userType: z.string().optional(),
  }).optional().describe('Dados biométricos do usuário para contexto.'),
});

export type MfitAssistantInput = z.infer<typeof MfitAssistantInputSchema>;

const MfitAssistantOutputSchema = z.object({
  response: z.string().describe('A resposta gerada pelo assistente fitness.'),
});

export type MfitAssistantOutput = z.infer<typeof MfitAssistantOutputSchema>;

/**
 * Respostas simuladas inteligentes para o modo DEMO.
 */
const MOCK_RESPONSES = (name?: string) => ({
  'default': `Olá ${name || 'atleta'}! Como seu Professor MFIT, recomendo focar na cadência do movimento hoje. Qual sua dúvida técnica?`,
  'dieta': `Para seu perfil, manter a ingestão de proteínas alta é crucial. Lembre-se de beber 35ml de água por kg de peso corporal.`,
  'supino': `No supino, foque na adução das escápulas. Isso protege seus ombros e isola melhor o peitoral.`,
});

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
    const hasApiKey = !!process.env.GOOGLE_GENAI_API_KEY;
    const name = input.userProfile?.firstName;

    if (!hasApiKey) {
      const msg = input.message.toLowerCase();
      let response = MOCK_RESPONSES(name).default;
      
      if (msg.includes('diet') || msg.includes('comê') || msg.includes('nutri')) response = MOCK_RESPONSES(name).dieta;
      if (msg.includes('supino')) response = MOCK_RESPONSES(name).supino;

      return {
        response: `[MODO DEMO] ${response}\n\n(Dica: Adicione sua API KEY para desbloquear o Professor em sua potência máxima!)`,
      };
    }

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      system: `Você é o Professor MFIT, um Personal Trainer de elite com especialização em Biomecânica e Fisiologia.
      
      CONTEXTO DO ALUNO:
      - Nome: ${name || 'Desconhecido'}
      - Altura: ${input.userProfile?.height || 'Não informada'} cm
      - Peso: ${input.userProfile?.weight || 'Não informado'} kg
      - Perfil: ${input.userProfile?.userType || 'Aluno'}
      
      DIRETRIZES DE RESPOSTA:
      1. Use o nome do aluno para criar conexão.
      2. Seja técnico: Explique a biomecânica (ex: falar de torque, plano de movimento, recrutamento de fibras).
      3. Seja motivador: Use frases de impacto de "elite".
      4. Foco em segurança: Sempre mencione a postura correta.
      5. Nutrição: Dê sugestões baseadas no peso do aluno (se informado).
      6. Idioma: Português do Brasil.`,
      prompt: input.message,
    });

    return {
      response: output?.text || 'Tive uma falha na conexão, mas não desista! Pode repetir?',
    };
  }
);
