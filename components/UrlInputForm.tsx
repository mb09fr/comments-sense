import React, { useState } from 'react';
import { LinkIcon, ArrowRightIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <LinkIcon />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('urlInputPlaceholder')}
          disabled={isLoading}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-full py-4 pl-12 pr-32 text-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 m-1.5 px-6 bg-brand-red text-white font-bold rounded-full flex items-center gap-2 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? t('analyzingButton') : t('analyzeButton')}
          {!isLoading && <ArrowRightIcon />}
        </button>
      </div>
    </form>
  );
};
