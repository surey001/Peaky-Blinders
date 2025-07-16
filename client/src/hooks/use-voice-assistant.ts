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
          // English
          /\b(chat|talk|speak|conversation|assistant|ai|message|communicate)\b/,
          // Tamil
          /\b(அரட்டை|பேச|உரையாடல்|சொல்|பேசு|செய்தி|தொடர்பு)\b/,
          /\b(aradai|pesu|uraiyaadal|sol|peshu|seythi|thodarbu)\b/,
          // Kannada  
          /\b(ಚಾಟ್|ಮಾತು|ಮಾತನಾಡು|ಸಂವಾದ|ಸಹಾಯಕ|ಸಂದೇಶ)\b/,
          /\b(chat|maatu|maatanaadu|samvaada|sahaayaka|sandesha)\b/,
          // Hindi
          /\b(चैट|बात|बातचीत|सहायक|संदेश|बोलना|कहना)\b/,
          /\b(baat|baatcheet|sahaayak|sandesh|bolana|kahana)\b/,
          // Malayalam
          /\b(ചാറ്റ്|സംസാരം|സംഭാഷണം|സഹായി|സന്ദേശം|പറയുക)\b/,
          /\b(samsaaram|sambhaashanam|sahaayaki|sandesham|parayuka)\b/
        ]
      },
      {
        route: '/disease-detection',
        patterns: [
          // English
          /\b(disease|health|sick|problem|detect|analyze|diagnosis|ill|infection|symptom)\b/,
          // Tamil
          /\b(நோய்|உடல்நலம்|பகுப்பாய்வு|நோய்கண்டறிதல்|வியாதி|பிரச்சனை)\b/,
          /\b(noy|udalnalam|pakuppaayvu|noykandaridhaal|viyaadhi|prachanai)\b/,
          // Kannada
          /\b(ರೋಗ|ಆರೋಗ್ಯ|ಪತ್ತೆ|ವಿಶ್ಲೇಷಣೆ|ಕಾಯಿಲೆ|ಸಮಸ್ಯೆ)\b/,
          /\b(roga|aarogya|patte|vishleshanè|kaayile|samasye)\b/,
          // Hindi  
          /\b(रोग|बीमारी|स्वास्थ्य|पता|जांच|विश्लेषण|समस्या)\b/,
          /\b(rog|beemaaree|svaasthya|pataa|jaanch|vishleshana|samasya)\b/,
          // Malayalam
          /\b(രോഗം|ആരോഗ്യം|കണ്ടെത്തൽ|വിശകലനം|അസുഖം|പ്രശ്നം)\b/,
          /\b(rogam|aarogyam|kandethal|vishakalạnam|asukham|prashnam)\b/
        ]
      },
      {
        route: '/plant-care',
        patterns: [
          // English
          /\b(plant|care|grow|garden|cultivation|tips|farming|agriculture|crop)\b/,
          // Tamil
          /\b(தாவரம்|பராமரிப்பு|வளர்ப்பு|தோட்டம்|விவசாயம்|பயிர்)\b/,
          /\b(thaavaram|paraamarippu|valarppu|thottam|vivasaayam|payir)\b/,
          // Kannada
          /\b(ಸಸ್ಯ|ಆರೈಕೆ|ಬೆಳೆ|ತೋಟ|ಕೃಷಿ|ಬೆಳೆಗಾರಿಕೆ)\b/,
          /\b(sasya|aaraike|bele|tota|krishi|belegaarike)\b/,
          // Hindi
          /\b(पौधे|देखभाल|बागवानी|खेती|कृषि|फसल)\b/,
          /\b(paudhe|dekhabhaal|baagavaanee|khetee|krishi|phasal)\b/,
          // Malayalam
          /\b(സസ്യം|പരിചരണം|കൃഷി|തോട്ടം|കൃഷിക്കാര്യം|വിള)\b/,
          /\b(sasyam|paricharanam|krishi|thottam|krishikkaaryam|vila)\b/
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