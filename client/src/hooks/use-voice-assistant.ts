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
        recognition.maxAlternatives = 3;
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          console.log('Voice command detected:', transcript);
          
          // Show what the user said in a more visible way
          if (transcript.length > 0) {
            console.log(`🎤 You said: "${transcript}"`);
            console.log('🔍 Analyzing command for keywords...');
          }
          
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
    // Normalize command for flexible matching
    const normalizedCommand = command.toLowerCase().trim();
    
    // Define route patterns with multiple variations and keywords
    const routePatterns = [
      {
        route: '/chat',
        patterns: [
          /\b(chat|talk|speak|conversation|assistant|ai)\b/,
          /\b(அரட்டை|பேச)\b/,
          /\b(ಚಾಟ್|ಮಾತು)\b/,
          /\b(चैट|बात|सहायक)\b/,
          /\b(ചാറ്റ്|സംസാര)\b/
        ]
      },
      {
        route: '/disease-detection',
        patterns: [
          /\b(disease|health|sick|problem|detect|analyze|diagnosis)\b/,
          /\b(நோய்|உடல்நலம்|பகுப்பாய்வு)\b/,
          /\b(ರೋಗ|ಆರೋಗ್ಯ|ಪತ್ತೆ)\b/,
          /\b(रोग|बीमारी|स्वास्थ्य|पता)\b/,
          /\b(രോഗം|ആരോഗ്യം|കണ്ടെത്തൽ)\b/
        ]
      },
      {
        route: '/plant-care',
        patterns: [
          /\b(plant|care|grow|garden|cultivation|tips)\b/,
          /\b(தாவர|பராமரிப்பு|வளர்ப்பு)\b/,
          /\b(ಸಸ್ಯ|ಆರೈಕೆ|ಬೆಳೆ)\b/,
          /\b(पौधे|देखभाल|बागवानी)\b/,
          /\b(സസ്യം|പരിചരണം|കൃഷി)\b/
        ]
      },
      {
        route: '/',
        patterns: [
          /\b(home|main|start|beginning|back)\b/,
          /\b(முகப்பு|வீடு|தொடക்கம்)\b/,
          /\b(ಮುಖ್ಯ|ಮನೆ|ಪ್ರಾರಂಭ)\b/,
          /\b(मुख्य|घर|शुरू)\b/,
          /\b(ഹോം|വീട്|തുടക്കം)\b/
        ]
      }
    ];

    // Find matching route based on patterns
    let matchedRoute = null;
    for (const { route, patterns } of routePatterns) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedCommand)) {
          matchedRoute = route;
          break;
        }
      }
      if (matchedRoute) break;
    }

    if (matchedRoute) {
      console.log(`✅ Command matched! Navigating to: ${matchedRoute}`);
      setLocation(matchedRoute);
      speakFeedback(getNavigationFeedback(matchedRoute));
    } else {
      console.log('❌ Command not recognized:', command);
      console.log('💡 Available keywords: chat, talk, disease, health, plant, care, garden, home, back');
      
      // Suggest available commands
      const suggestions = [
        'Try saying "chat" or "talk to assistant"',
        'Say "disease" or "health check"', 
        'Say "plant care" or "gardening"',
        'Say "home" or "go back"'
      ];
      const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      speakFeedback(`Command not recognized. ${suggestion}`);
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