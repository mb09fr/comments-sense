// --- ATTENTION ---
// Pour que l'application fonctionne, vous devez coller votre clé API ci-dessous.
// N'exposez JAMAIS ces clés publiquement ou ne les validez pas dans un contrôle de version (git).
// Idéalement, utilisez des variables d'environnement et un processus de build pour plus de sécurité.

// 1. Clé API pour YouTube Data API v3
//    Vous pouvez l'obtenir sur la Google Cloud Console: https://console.cloud.google.com/apis/credentials
// FIX: Explicitly typed YOUTUBE_API_KEY as a string to prevent a TypeScript error
// in `services/youtubeService.ts` when comparing the key's literal type with a placeholder string.
export const YOUTUBE_API_KEY: string = "AIzaSyCQoKj0MFnmVXsyNImiRXamL9rUm4HSMEA";
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";


// 2. Clé API pour Google Gemini
//    La clé API Gemini est maintenant gérée via les variables d'environnement (process.env.API_KEY)
//    et n'a plus besoin d'être définie ici pour des raisons de sécurité.
//    Vous pouvez obtenir votre clé sur Google AI Studio: https://aistudio.google.com/app/apikey
