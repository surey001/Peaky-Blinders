import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "../lib/language";
import { useTranslation } from "../lib/translations";

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const initializeVoiceRecognition = useCallback(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = getLanguageCode(language);
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          console.log('Voice command:', transcript);
          handleVoiceCommand(transcript);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, [language]);

  const getLanguageCode = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'ta': 'ta-IN',
      'kn': 'kn-IN',
      'hi': 'hi-IN',
      'ml': 'ml-IN'
    };
    return langMap[lang] || 'en-US';
  };

  const handleVoiceCommand = (command: string) => {
    const commands = {
      // English commands
      'open chat': '/chat',
      'go to chat': '/chat',
      'chat': '/chat',
      'open disease': '/disease-detection',
      'disease detection': '/disease-detection',
      'detect disease': '/disease-detection',
      'open plant care': '/plant-care',
      'plant care': '/plant-care',
      'care guide': '/plant-care',
      'go home': '/',
      'home': '/',
      'main page': '/',
      
      // Tamil commands
      'அரட்டை திற': '/chat',
      'அரட்டை': '/chat',
      'நோய் கண்டறிதல் திற': '/disease-detection',
      'நோய் கண்டறிதல்': '/disease-detection',
      'தாவர பராமரிப்பு திற': '/plant-care',
      'தாவர பராமரிப்பு': '/plant-care',
      'முகப்புக்கு செல்': '/',
      'முகப்பு': '/',
      
      // Kannada commands
      'ಚಾಟ್ ತೆರೆಯಿರಿ': '/chat',
      'ಚಾಟ್': '/chat',
      'ರೋಗ ಪತ್ತೆ ತೆರೆಯಿರಿ': '/disease-detection',
      'ರೋಗ ಪತ್ತೆ': '/disease-detection',
      'ಸಸ್ಯ ಆರೈಕೆ ತೆರೆಯಿರಿ': '/plant-care',
      'ಸಸ್ಯ ಆರೈಕೆ': '/plant-care',
      'ಮುಖ್ಯಕ್ಕೆ ಹೋಗಿ': '/',
      'ಮುಖ್ಯ': '/',
      
      // Hindi commands
      'चैट खोलें': '/chat',
      'चैट': '/chat',
      'रोग का पता लगाना खोलें': '/disease-detection',
      'रोग का पता लगाना': '/disease-detection',
      'पौधों की देखभाल खोलें': '/plant-care',
      'पौधों की देखभाल': '/plant-care',
      'मुखपृष्ठ पर जाएं': '/',
      'मुखपृष्ठ': '/',
      
      // Malayalam commands
      'ചാറ്റ് തുറക്കുക': '/chat',
      'ചാറ്റ്': '/chat',
      'രോഗ കണ്ടെത്തൽ തുറക്കുക': '/disease-detection',
      'രോഗ കണ്ടെത്തൽ': '/disease-detection',
      'സസ്യ പരിചരണം തുറക്കുക': '/plant-care',
      'സസ്യ പരിചരണം': '/plant-care',
      'ഹോമിലേക്ക് പോകുക': '/',
      'ഹോം': '/'
    };

    // Find matching command
    const route = commands[command as keyof typeof commands];
    
    if (route) {
      setLocation(route);
      // Provide audio feedback
      speakFeedback(getNavigationFeedback(route));
    } else {
      console.log('Command not recognized:', command);
      speakFeedback(t('voice_command_not_recognized') || 'Command not recognized');
    }
  };

  const getNavigationFeedback = (route: string): string => {
    const feedbackMap: { [key: string]: string } = {
      '/chat': t('chat'),
      '/disease-detection': t('disease_detection'),
      '/plant-care': t('plant_care'),
      '/': t('home')
    };
    
    return `${t('opening')} ${feedbackMap[route]}` || `Opening ${route}`;
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Initialize on mount
  useState(() => {
    initializeVoiceRecognition();
  });

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    initializeVoiceRecognition
  };
}