import React, { useState } from 'react';
import type { Comment } from '../types';
import { TranslateIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';
import { translateText } from '../services/geminiService';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { t, language } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError(null);
    try {
      const translation = await translateText(comment.text, language);
      setTranslatedText(translation);
    } catch (err) {
      setError(t("translationFailed"));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <li className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
      <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <p className="font-semibold text-white">{comment.author}</p>
        <p className="text-gray-300 whitespace-pre-wrap">{translatedText || comment.text}</p>
        <div className="mt-2">
            {!translatedText && (
                <button
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-red transition-colors disabled:opacity-50"
                >
                    <TranslateIcon />
                    <span>{isTranslating ? t('translating') : t('translate')}</span>
                </button>
            )}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </div>
    </li>
  );
};


interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const { t } = useTranslation();
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-4">{t('extractedCommentsTitle', { count: comments.length })}</h2>
      <ul className="space-y-4">
        {comments.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </ul>
    </div>
  );
};
