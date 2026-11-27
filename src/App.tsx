import React, { Suspense, lazy } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { ClassesList } from './components/classes/ClassesList';
import { Flame, ArrowUp, Loader2, BookOpen, MapPin } from 'lucide-react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

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

const TabLoadingFallback: React.FC = () => {
  const { isGoingDark } = useTheme();
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] space-y-3 ${
        isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'
      }`}
    >
      <Loader2 size={32} className={`animate-spin ${isGoingDark ? 'text-[#b91c1c]' : 'text-[#780016]'}`} />
      <span
        className={`text-xs font-heading tracking-widest uppercase ${
          isGoingDark ? 'text-[#94a3b8]' : 'text-[#9f9584]'
        }`}
      >
        {isGoingDark ? 'Расшифровка архива Министерства...' : 'Загрузка данных Шпиля...'}
      </span>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();
  const { isGoingDark } = useTheme();

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
    <div
      className={`min-h-screen flex flex-col bg-transparent text-[var(--spire-text)] transition-colors duration-200 relative ${
        isGoingDark ? 'selection:bg-[#b91c1c] selection:text-white' : 'selection:bg-[#780016] selection:text-white'
      } ${isMapActive ? 'xl:h-[100dvh] xl:overflow-hidden' : ''}`}
    >
      {/* GPU-Accelerated Fixed Background & Corebook Vertical Lumen Beam */}
      <div className="spire-bg-layer" />
      <div className="spire-corebook-lumen" aria-hidden="true" />

      {/* Top Navigation */}
      <Navbar
        currentTab={route.tab as NavTab}
        onTabChange={(tab) => navigate({ tab })}
      />

      {/* Atlas & Lore Sub-Navigation Bar (Shown only when Atlas & Chronicles tab is active) */}
      {route.tab === 'districts' && (
        <div
          className={`w-full h-14 box-border sticky top-16 z-30 backdrop-blur-md transition-colors ${
            isGoingDark
              ? 'bg-[#050914]/97 border-b-2 border-black shadow-[0_4px_0_#000000]'
              : 'bg-[#070a10]/95 border-b border-[#302310] shadow-md'
          }`}
        >
          <div className="max-w-7xl mx-auto h-full px-2 sm:px-6 lg:px-8 flex items-center justify-center">
            <div
              className={`inline-flex max-w-full items-center gap-1 p-1 ${
                isGoingDark
                  ? 'bg-[#03060e] border-2 border-black rounded-xs shadow-[3px_3px_0_#000000]'
                  : 'bg-[#0e121c] border border-[#2e374d] rounded-xl'
              }`}
            >
              <button
                onClick={() => navigate({ tab: 'districts', atlasMode: 'lore' })}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-1.5 text-[10px] sm:text-sm font-heading font-bold uppercase tracking-normal sm:tracking-wider whitespace-nowrap transition-colors ${
                  isGoingDark ? 'rounded-xs' : 'rounded-lg'
                } ${
                  route.atlasMode === 'lore'
                    ? isGoingDark
                      ? 'bg-[#b91c1c] text-white border border-black shadow-[2px_2px_0_#000000]'
                      : 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40'
                    : isGoingDark
                    ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111d38] border border-transparent'
                    : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#151926] border border-transparent'
                }`}
              >
                <BookOpen
                  size={14}
                  className={`shrink-0 ${
                    route.atlasMode === 'lore'
                      ? isGoingDark
                        ? 'text-[#7dd3fc]'
                        : 'text-[#f0ca5b]'
                      : isGoingDark
                      ? 'text-[#64748b]'
                      : 'text-[#6e685c]'
                  }`}
                />
                <span>Хроники и Лор Шпиля</span>
              </button>

              <button
                onClick={() => navigate({ tab: 'districts', atlasMode: 'map' })}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-1.5 text-[10px] sm:text-sm font-heading font-bold uppercase tracking-normal sm:tracking-wider whitespace-nowrap transition-colors ${
                  isGoingDark ? 'rounded-xs' : 'rounded-lg'
                } ${
                  route.atlasMode === 'map'
                    ? isGoingDark
                      ? 'bg-[#b91c1c] text-white border border-black shadow-[2px_2px_0_#000000]'
                      : 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40'
                    : isGoingDark
                    ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111d38] border border-transparent'
                    : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#151926] border border-transparent'
                }`}
              >
                <MapPin
                  size={14}
                  className={`shrink-0 ${
                    route.atlasMode === 'map'
                      ? isGoingDark
                        ? 'text-[#7dd3fc]'
                        : 'text-[#f0ca5b]'
                      : isGoingDark
                      ? 'text-[#64748b]'
                      : 'text-[#6e685c]'
                  }`}
                />
                <span>Интерактивная Карта</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto ${
          isMapActive
            ? 'max-w-[1800px] p-2 sm:p-3 flex flex-col xl:h-[calc(100dvh-7.5rem)] xl:overflow-hidden'
            : route.tab === 'districts'
            ? 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-8'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'
        }`}
      >
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
        <footer
          className={`mt-16 py-10 text-xs transition-colors ${
            isGoingDark
              ? 'bg-[#04070f] border-t-2 border-black text-[#94a3b8]'
              : 'bg-[#07080c]/98 border-t border-[#3d2b0e] text-[#878072]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <div
                className={`font-heading font-bold text-sm flex items-center justify-center sm:justify-start gap-2 ${
                  isGoingDark ? 'text-[#7dd3fc]' : 'text-[#c59b27]'
                }`}
              >
                <Flame size={16} className={isGoingDark ? 'text-[#b91c1c]' : 'text-[#780016]'} />
                <span>ШПИЛЬ: Город Должен Пасть (Spire: The City Must Fall)</span>
                {isGoingDark && <span className="spire-archive-stamp">СЕКРЕТНО</span>}
              </div>
              <p
                className={`text-sm sm:text-base font-flavor italic leading-relaxed ${
                  isGoingDark ? 'text-[#e2e8f0]' : 'text-[#ccc5b8]'
                }`}
              >
                «Мы не выбирали эту войну. Но мы сделаем так, чтобы солнце наконец зашло над башней аэльфиров.»
              </p>
              <p className={`text-[11px] ${isGoingDark ? 'text-[#64748b]' : 'text-[#635f57]'}`}>
                {isGoingDark
                  ? 'Засекреченный архив Министерства Нашей Сокрытой Госпожи.'
                  : 'Русскоязычный справочник игрока и Мастера по материалам официальных книг правил.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                  isGoingDark
                    ? 'rounded-xs bg-[#0a1224] hover:bg-[#b91c1c] text-[#e2e8f0] border-2 border-black shadow-[3px_3px_0_#000000]'
                    : 'rounded-lg bg-[#141620] hover:bg-[#780016] text-[#e0dacf] border border-[#2b3245]'
                }`}
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
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
};

export default App;
