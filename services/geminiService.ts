import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Comment } from '../types';
import type { Language } from '../hooks/useTranslation';

// Initialize GoogleGenAI with apiKey from the environment variable.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Un résumé concis des commentaires en 2-3 phrases.",
    },
    sentiment: {
      type: Type.OBJECT,
      description: "Analyse du sentiment général des commentaires.",
      properties: {
        positive: {
          type: Type.NUMBER,
          description: "Pourcentage de commentaires positifs (0-100).",
        },
        negative: {
          type: Type.NUMBER,
          description: "Pourcentage de commentaires négatifs (0-100).",
        },
        neutral: {
          type: Type.NUMBER,
          description: "Pourcentage de commentaires neutres (0-100).",
        },
        sentiment: {
          type: Type.STRING,
          description: "Le sentiment général (par exemple, 'Majoritairement Positif', 'Mitigé', 'Négatif').",
        },
      },
      required: ["positive", "negative", "neutral", "sentiment"],
    },
    keyTopics: {
      type: Type.ARRAY,
      description: "Les 3 à 5 sujets de discussion les plus fréquents dans les commentaires.",
      items: { type: Type.STRING },
    },
  },
  required: ["summary", "sentiment", "keyTopics"],
};

export const analyzeComments = async (comments: Comment[], language: Language): Promise<AnalysisResult> => {
  // if (!process.env.API_KEY) {
  //   throw new Error("La clé API Gemini n'est pas configurée dans les variables d'environnement.");
  // }
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("La clé API Gemini n'est pas configurée.");
    }

  if (!comments || comments.length === 0) {
    // Gère le cas où il n'y a pas de commentaires pour éviter une erreur.
    return {
        summary: "Aucun commentaire n'a été trouvé ou les commentaires sont désactivés pour cette vidéo.",
        sentiment: { positive: 0, negative: 0, neutral: 100, sentiment: 'Aucun' },
        keyTopics: []
    };
  }
  
  const langName = language === 'fr' ? 'français' : 'arabe';
  const commentsText = comments
    .map((c) => `- ${c.author}: "${c.text}"`)
    .join('\n');
  
  const prompt = `
    Analyse la liste de commentaires YouTube suivante et fournis une analyse structurée.
    La langue de l'analyse doit être : ${langName}.

    Commentaires :
    ${commentsText}

    Fournis ton analyse au format JSON en respectant le schéma défini.
    - Fais un résumé général en ${langName}.
    - Calcule le sentiment (pourcentages positif, négatif, neutre).
    - Extrais les 3 à 5 sujets principaux abordés, en ${langName}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text;
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Erreur lors de l'analyse avec l'API Gemini :", error);
    throw new Error("L'analyse des commentaires a échoué. Le service d'IA est peut-être indisponible ou la clé API Gemini est invalide.");
  }
};

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("La clé API Gemini n'est pas configurée.");
    }
    const langName = targetLanguage === 'fr' ? 'français' : 'arabe';
    const prompt = `Traduis le texte suivant en ${langName}. Ne renvoie que le texte traduit, sans préfixe comme "[Traduction]".\n\nTexte original:\n"${text}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Erreur lors de la traduction avec l'API Gemini :", error);
        throw new Error("La traduction a échoué.");
    }
};
