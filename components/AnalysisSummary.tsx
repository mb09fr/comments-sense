import React from 'react';
import type { AnalysisResult, VideoData } from '../types';
import { ThumbsDownIcon, ThumbsUpIcon, CommentIcon, ViewIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

interface AnalysisSummaryProps {
  analysis: AnalysisResult;
  videoData: VideoData;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-lg">
    <div className="text-brand-red">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ analysis, videoData }) => {
  const { t } = useTranslation();
  const { summary, sentiment, keyTopics } = analysis;
  const locale = t('locale');

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('analysisTitle')}</h2>
      <p className="text-gray-400 mb-6 text-lg">{videoData.title}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<ViewIcon />} label={t('views')} value={videoData.viewCount.toLocaleString(locale)} />
        <StatCard icon={<CommentIcon />} label={t('comments')} value={videoData.commentCount.toLocaleString(locale)} />
        <StatCard icon={<ThumbsUpIcon />} label={t('positive')} value={`${sentiment.positive}%`} />
        <StatCard icon={<ThumbsDownIcon />} label={t('negative')} value={`${sentiment.negative}%`} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-brand-red mb-3">{t('summaryTitle')}</h3>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-brand-red mb-4">{t('sentimentAnalysisTitle')} <span className="text-white">{sentiment.sentiment}</span></h3>
          <div className="w-full bg-gray-700 rounded-full h-4 flex overflow-hidden">
            <div
              className="bg-green-500 h-4"
              style={{ width: `${sentiment.positive}%` }}
              title={`${t('positive')}: ${sentiment.positive}%`}
            ></div>
            <div
              className="bg-red-500 h-4"
              style={{ width: `${sentiment.negative}%` }}
              title={`${t('negative')}: ${sentiment.negative}%`}
            ></div>
            <div
              className="bg-gray-500 h-4"
              style={{ width: `${sentiment.neutral}%` }}
              title={`Neutre: ${sentiment.neutral}%`}
            ></div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-brand-red mb-3">{t('keyTopicsTitle')}</h3>
          <div className="flex flex-wrap gap-2">
            {keyTopics.map((topic, index) => (
              <span key={index} className="bg-gray-700 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
