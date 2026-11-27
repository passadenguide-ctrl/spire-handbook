import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppRoute, parseRoute, buildRoutePath, DEFAULT_ROUTE } from './router';

interface RouterContextType {
  route: AppRoute;
  navigate: (newRoute: Partial<AppRoute>, options?: { replace?: boolean }) => void;
  openClassModal: (classId: string) => void;
  closeClassModal: () => void;
  openAdvanceModal: (advanceId: string) => void;
  closeAdvanceModal: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_ROUTE };
    return parseRoute(window.location.hash);
  });

  // Listen for browser navigation (Back / Forward buttons, manual URL changes)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseRoute(window.location.hash);
      setRoute(parsed);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Initial normalization: if page opened without hash, populate hash so address bar reflects route
    if (!window.location.hash) {
      const initialPath = buildRoutePath(route);
      window.history.replaceState(null, '', initialPath);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigate = useCallback((newRoute: Partial<AppRoute>, options?: { replace?: boolean }) => {
    setRoute(prev => {
      const merged: AppRoute = {
        ...prev,
        ...newRoute,
      };

      // When switching main tabs, clear sub-route params unless explicitly provided
      if (newRoute.tab && newRoute.tab !== prev.tab) {
        if (!newRoute.classId) delete merged.classId;
        if (!newRoute.advanceId) delete merged.advanceId;
        if (!newRoute.districtId) delete merged.districtId;
        if (!newRoute.rulesResistance) delete merged.rulesResistance;
      }

      const targetPath = buildRoutePath(merged);

      if (options?.replace) {
        window.history.replaceState(null, '', targetPath);
      } else {
        const cleanHash = targetPath.startsWith('#') ? targetPath.slice(1) : targetPath;
        if (window.location.hash.slice(1) !== cleanHash) {
          window.location.hash = cleanHash;
        }
      }

      return merged;
    });
  }, []);

  const openClassModal = useCallback((classId: string) => {
    navigate({ tab: 'classes', classId });
  }, [navigate]);

  const closeClassModal = useCallback(() => {
    navigate({ tab: 'classes', classId: undefined });
  }, [navigate]);

  const openAdvanceModal = useCallback((advanceId: string) => {
    navigate({ tab: 'extra', advanceId });
  }, [navigate]);

  const closeAdvanceModal = useCallback(() => {
    navigate({ tab: 'extra', advanceId: undefined });
  }, [navigate]);

  return (
    <RouterContext.Provider
      value={{
        route,
        navigate,
        openClassModal,
        closeClassModal,
        openAdvanceModal,
        closeAdvanceModal,
      }}
    >
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
