import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ai-farmtool-language') || "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-farmtool-language', language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}