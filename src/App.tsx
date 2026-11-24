import React, { Suspense, lazy } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { ClassesList } from './components/classes/ClassesList';
import { Flame, ArrowUp, Loader2, BookOpen, MapPin } from 'lucide-react';
import { RouterProvider, useRouter } from './router/RouterContext';

// Code-split heavy tabs to reduce initial bundle and memory overhead
const ExtraAdvancesList = lazy(() =>
  import('./components/extra_advances/ExtraAdvancesList').then(m => ({ default: m.ExtraAdvancesList }))
);
const DistrictMap = lazy(() =>
  import('./components/districts/DistrictMap').then(m => ({ default: m.DistrictMap }))
);
const LoreCompendium = lazy(() =>
  import('./components/lore/LoreCompendium').then(m => ({ default: m.LoreCompendium }))
);
const EquipmentTable = lazy(() =>
  import('./components/equipment/EquipmentTable').then(m => ({ default: m.EquipmentTable }))
);
const RulesAndTools = lazy(() =>
  import('./components/rules/RulesAndTools').then(m => ({ default: m.RulesAndTools }))
);

const TabLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#c59b27] space-y-3">
    <Loader2 size={32} className="animate-spin text-[#780016]" />
    <span className="text-xs font-heading tracking-widest uppercase text-[#9f9584]">Загрузка данных Шпиля...</span>
  </div>
);

const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMap = (districtId?: string) => {
    navigate({
      tab: 'districts',
      atlasMode: 'map',
      districtId: districtId || undefined,
    });
  };

  const handleNavigateToLore = (districtId?: string) => {
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'domains',
      districtId: districtId || undefined,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMapActive = route.tab === 'districts' && route.atlasMode === 'map';

  return (
    <div className={`min-h-screen flex flex-col bg-transparent text-[#e0dacf] selection:bg-[#780016] selection:text-white relative ${
      isMapActive ? 'h-screen overflow-hidden' : ''
    }`}>
      {/* GPU-Accelerated Fixed Background (Separated to eliminate scroll repaint lag) */}
      <div className="spire-bg-layer" />

      {/* Top Navigation */}
      <Navbar
        currentTab={route.tab as NavTab}
        onTabChange={(tab) => navigate({ tab })}
      />

      {/* Atlas & Lore Sub-Navigation Bar (Shown only when Atlas & Chronicles tab is active) */}
      {route.tab === 'districts' && (
        <div className="w-full bg-[#070a10]/95 border-b border-[#302310] py-2 px-4 shadow-md flex items-center justify-center sticky top-16 z-30 backdrop-blur-md">
          <div className="inline-flex p-1 rounded-xl bg-[#0e121c] border border-[#2e374d]">
            <button
              onClick={() => navigate({ tab: 'districts', atlasMode: 'lore' })}
              className={`flex items-center gap-2 px-4 sm:px-6 py-1.5 rounded-lg text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                route.atlasMode === 'lore'
                  ? 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40 scale-[1.02]'
                  : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#151926]'
              }`}
            >
              <BookOpen size={16} className={route.atlasMode === 'lore' ? 'text-[#f0ca5b]' : 'text-[#6e685c]'} />
              <span>Хроники и Лор Шпиля</span>
            </button>

            <button
              onClick={() => navigate({ tab: 'districts', atlasMode: 'map' })}
              className={`flex items-center gap-2 px-4 sm:px-6 py-1.5 rounded-lg text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                route.atlasMode === 'map'
                  ? 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40 scale-[1.02]'
                  : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#151926]'
              }`}
            >
              <MapPin size={16} className={route.atlasMode === 'map' ? 'text-[#f0ca5b]' : 'text-[#6e685c]'} />
              <span>Интерактивная Карта</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${
        isMapActive 
          ? 'h-[calc(100vh-8rem)] max-w-[1800px] p-2 sm:p-3 overflow-hidden flex flex-col' 
          : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'
      }`}>
        <Suspense fallback={<TabLoadingFallback />}>
          {route.tab === 'classes' && <ClassesList />}
          {route.tab === 'extra' && <ExtraAdvancesList />}
          {route.tab === 'districts' && route.atlasMode === 'lore' && (
            <LoreCompendium
              onNavigateToMap={handleNavigateToMap}
              initialDistrictId={route.districtId}
              initialTab={route.loreTab}
            />
          )}
          {route.tab === 'districts' && route.atlasMode === 'map' && (
            <DistrictMap
              isCompactScreen={true}
              initialDistrictId={route.districtId}
              onNavigateToLore={handleNavigateToLore}
            />
          )}
          {route.tab === 'equipment' && <EquipmentTable />}
          {route.tab === 'rules' && <RulesAndTools />}
        </Suspense>
      </main>

      {/* Atmospheric Footer */}
      {!isMapActive && (
        <footer className="mt-16 bg-[#07080c]/98 border-t border-[#3d2b0e] py-10 text-xs text-[#878072]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-heading font-bold text-sm text-[#c59b27] flex items-center justify-center sm:justify-start gap-2">
                <Flame size={16} className="text-[#780016]" />
                <span>ШПИЛЬ: Город Должен Пасть (Spire: The City Must Fall)</span>
              </div>
              <p className="text-sm sm:text-base font-flavor italic text-[#ccc5b8] leading-relaxed">
                «Мы не выбирали эту войну. Но мы сделаем так, чтобы солнце наконец зашло над башней аэльфиров.»
              </p>
              <p className="text-[11px] text-[#635f57]">
                Русскоязычный справочник игрока и Мастера по материалам официальных книг правил.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141620] hover:bg-[#780016] text-[#e0dacf] transition-colors border border-[#2b3245]"
              >
                <ArrowUp size={14} />
                <span>Наверх</span>
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};

export default App;
