import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    // Support hash-based or path-based
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    const p = window.location.pathname;
    return p || '/';
  };

  const [path, setPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setPath(window.location.hash.slice(1));
      } else {
        setPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (to === path) return;
    try {
      window.history.pushState({}, '', to);
    } catch {
      // Fallback for sandboxed iframes
      window.location.hash = to;
    }
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to extract params like /crops/:id or /markets/:id
  const params: Record<string, string> = {};
  if (path.startsWith('/crops/')) {
    params.cropId = path.replace('/crops/', '').split('?')[0].split('/')[0];
  } else if (path.startsWith('/markets/')) {
    params.marketId = path.replace('/markets/', '').split('?')[0].split('/')[0];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
