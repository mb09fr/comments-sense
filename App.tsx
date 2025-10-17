import React, { useState } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { CommentLimitSelector } from './components/CommentLimitSelector';
import { AnalysisSummary } from './components/AnalysisSummary';
import { CommentList } from './components/CommentList';
import { LoadingSpinner, ErrorIcon, LogoIcon } from './components/Icons';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTranslation } from './hooks/useTranslation';
import { fetchYouTubeVideoData } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import type { VideoData, AnalysisResult } from './types';

function App() {
  const { t, language } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [commentLimit, setCommentLimit] = useState<number>(50);

  const handleSubmit = async (url: string) => {
    if (!url) {
      setError(t("errorUrl"));
      return;
    }
    setIsLoading(true);
    setError(null);
    setVideoData(null);
    setAnalysisResult(null);

    try {
      // Étape 1: Récupérer les données de la vidéo et les commentaires
      const data = await fetchYouTubeVideoData(url, commentLimit);
      setVideoData(data);

      // Étape 2: Analyser les commentaires avec Gemini
      const analysis = await analyzeComments(data.comments, language);
      setAnalysisResult(analysis);

    } catch (err: any) {
      setError(err.message || t("errorUnexpected"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
    setVideoData(null);
    setError(null);
  };

  const showForm = !isLoading && !analysisResult;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-screen">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
                <LogoIcon />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {t('appName')}
                </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                {t('appDescription')}
            </p>
        </header>

        <main className="w-full max-w-2xl flex flex-col items-center gap-4">
          {showForm && (
            <>
              <UrlInputForm onSubmit={handleSubmit} isLoading={isLoading} />
              <CommentLimitSelector value={commentLimit} onChange={setCommentLimit} disabled={isLoading} />
            </>
          )}

          {isLoading && (
            <div className="text-center p-8 animate-fade-in">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-gray-300">{t('loadingMessage')}</p>
              <p className="text-sm text-gray-500">{videoData ? t('loadingStep2') : t('loadingStep1')}</p>
            </div>
          )}

          {error && (
            <div className="w-full bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          {analysisResult && videoData && (
            <>
              <div className="w-full max-w-4xl mx-auto flex justify-end mb-4">
                <button 
                  onClick={handleReset}
                  className="bg-brand-red text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
                >
                  {t('analyzeAnotherVideo')}
                </button>
              </div>
              <AnalysisSummary analysis={analysisResult} videoData={videoData} />
              <CommentList comments={videoData.comments} />
               <button 
                  onClick={handleReset}
                  className="mt-8 bg-brand-red text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
                >
                  {t('analyzeAnotherVideo')}
                </button>
            </>
          )}
        </main>
        
        <footer className="text-center text-gray-600 mt-12">
            <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('footerText')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
