'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string, section?: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Language>('en');

    // Initialize from localStorage if available
    useEffect(() => {
        const savedLang = localStorage.getItem('kalsa-lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
            setLang(savedLang);
        }
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('kalsa-lang', newLang);
    };

    // This is a simple translation helper
    // In a real app, you'd use a more robust i18n library
    const t = (key: string, section?: string) => {
        // We will define translations in a separate file or within components
        // For now, let's just return a placeholder or handle it in components directly
        return key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
