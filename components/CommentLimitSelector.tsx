import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface CommentLimitSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

const options = [50, 100, 200];

export const CommentLimitSelector: React.FC<CommentLimitSelectorProps> = ({ value, onChange, disabled }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center gap-2 my-4 animate-fade-in">
      <span className="text-gray-400 text-sm">{t('commentLimitLabel')}</span>
      <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              value === option
                ? 'bg-brand-red text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            } disabled:text-gray-500 disabled:bg-transparent disabled:cursor-not-allowed`}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
