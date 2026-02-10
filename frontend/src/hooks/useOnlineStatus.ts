import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si l'utilisateur est en ligne ou hors ligne
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Connexion rétablie');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📡 Hors ligne');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
