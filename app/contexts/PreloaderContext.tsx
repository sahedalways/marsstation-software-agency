'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PreloaderContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function PreloaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PreloaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </PreloaderContext.Provider>
    );
}

export function usePreloader() {
    const context = useContext(PreloaderContext);
    if (!context) {
        throw new Error('usePreloader must be used within PreloaderProvider');
    }
    return context;
}
