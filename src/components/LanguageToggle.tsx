import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 bg-light-sand border border-warm-gray rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
          language === 'en'
            ? 'bg-soft-olive text-white'
            : 'bg-transparent text-dark-brown hover:text-soft-olive'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pt-BR')}
        className={`px-3 py-1.5 rounded text-sm font-semibold transition-all ${
          language === 'pt-BR'
            ? 'bg-soft-olive text-white'
            : 'bg-transparent text-dark-brown hover:text-soft-olive'
        }`}
      >
        PT-BR
      </button>
    </div>
  );
};
