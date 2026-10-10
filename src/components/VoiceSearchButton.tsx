import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceSearchButtonProps {
  onSearchResult: (transcript: string) => void;
  className?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({ 
  onSearchResult,
  className = ''
}) => {
  const { t, language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVoiceSearch = () => {
    // Check speech recognition support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Voice search is not supported in this browser. Please type to search.');
      setTimeout(() => setErrorMessage(''), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Map app language to recognition locale
      const localeMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        ml: 'ml-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        or: 'or-IN',
        as: 'as-IN',
      };

      recognition.lang = localeMap[language] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onSearchResult(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setErrorMessage('Could not understand. Please try again or type.');
          setTimeout(() => setErrorMessage(''), 3000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage('Voice search unavailable.');
      setTimeout(() => setErrorMessage(''), 2500);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleVoiceSearch}
        title={isListening ? t('voiceListening', 'Listening...') : t('voiceSearch', 'Voice Search')}
        className={`p-2 rounded-lg transition-all focus:outline-hidden ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300' 
            : 'text-stone-500 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
        } ${className}`}
        aria-label="Search by voice"
      >
        {isListening ? (
          <Mic className="w-4 h-4 animate-bounce" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {errorMessage && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg whitespace-nowrap">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
