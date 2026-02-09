import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Configuração central do Genkit para o MFIT Personal.
 * O plugin googleAI utiliza automaticamente a variável de ambiente GOOGLE_GENAI_API_KEY.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-1.5-flash',
});
