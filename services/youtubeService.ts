import type { Comment, VideoData } from '../types';
import { YOUTUBE_API_KEY } from '../config';

/**
 * Extrait l'ID de la vidéo à partir de différentes URL YouTube.
 * @param url L'URL de la vidéo YouTube.
 * @returns L'ID de la vidéo ou null s'il n'est pas trouvé.
 */
function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = YOUTUBE_API_KEY;

/**
 * Gère les erreurs de l'API YouTube et les transforme en messages clairs.
 * @param errorData L'objet d'erreur retourné par l'API Google.
 * @returns Un objet Error avec un message formaté.
 */
function handleYouTubeApiError(errorData: any): Error {
    const message = errorData?.error?.message || 'Une erreur inconnue est survenue avec l\'API YouTube.';
    const reason = errorData?.error?.errors?.[0]?.reason;

    if (reason === 'commentsDisabled') {
        return new Error("Les commentaires sont désactivés pour cette vidéo.");
    }
    if (reason === 'videoNotFound') {
        return new Error("Vidéo introuvable. Elle est peut-être privée, supprimée ou l'URL est incorrecte.");
    }
     if (message.includes('API key') || message.includes('API_KEY')) {
        return new Error("La clé API YouTube est invalide ou manquante. Veuillez la vérifier dans le fichier `config.ts`.");
    }

    console.error('Erreur API YouTube:', errorData);
    return new Error(`Erreur de l'API YouTube : ${message}`);
}


/**
 * Récupère les détails d'une vidéo YouTube et ses commentaires via l'API YouTube Data v3 officielle.
 * @param url L'URL de la vidéo YouTube.
 * @param limit Le nombre maximum de commentaires à récupérer (max 100 pour l'API).
 * @returns Une promesse qui se résout en un objet contenant les données de la vidéo.
 */
export const fetchYouTubeVideoData = async (url: string, limit: number = 50): Promise<VideoData> => {
  if (!API_KEY || API_KEY === "COPIEZ_VOTRE_CLÉ_API_YOUTUBE_ICI") {
      throw new Error("La clé API YouTube n'est pas configurée. Veuillez l'ajouter dans le fichier `config.ts`.");
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("URL YouTube invalide ou ID de vidéo introuvable.");
  }

  try {
    // Étape 1: Récupérer les détails de la vidéo (titre, statistiques)
    const videoDetailsUrl = `${API_BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
    const videoResponse = await fetch(videoDetailsUrl);
    const videoData = await videoResponse.json();

    if (!videoResponse.ok) {
        throw handleYouTubeApiError(videoData);
    }

    if (!videoData.items || videoData.items.length === 0) {
      throw new Error("Vidéo introuvable. Elle est peut-être privée ou l'URL est incorrecte.");
    }

    const videoItem = videoData.items[0];
    const { title } = videoItem.snippet;
    const { viewCount, commentCount } = videoItem.statistics;

     if (parseInt(commentCount, 10) === 0) {
        return {
            title,
            viewCount: parseInt(viewCount, 10) || 0,
            commentCount: 0,
            comments: [],
        };
    }


    // Étape 2: Récupérer les threads de commentaires
    // L'API est limitée à 100 résultats par page
    const maxResults = Math.min(limit, 100);
    const commentThreadsUrl = `${API_BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${API_KEY}`;
    
    const commentsResponse = await fetch(commentThreadsUrl);
    const commentsData = await commentsResponse.json();

    if (!commentsResponse.ok) {
       throw handleYouTubeApiError(commentsData);
    }
    
    const comments: Comment[] = (commentsData.items || []).map((item: any) => {
      const topLevelComment = item.snippet.topLevelComment.snippet;
      return {
        author: topLevelComment.authorDisplayName || 'Anonyme',
        text: topLevelComment.textDisplay || '',
        avatar: topLevelComment.authorProfileImageUrl || 'https://i.pravatar.cc/48',
      };
    });

    return {
      title,
      viewCount: parseInt(viewCount, 10) || 0,
      commentCount: parseInt(commentCount, 10) || 0,
      comments: comments,
    };

  } catch (error) {
     if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error("Impossible de joindre les services YouTube. Veuillez vérifier votre connexion réseau.");
     }
     // Propage l'erreur déjà formatée ou une nouvelle erreur
     throw error instanceof Error ? error : new Error("Une erreur inattendue est survenue.");
  }
};