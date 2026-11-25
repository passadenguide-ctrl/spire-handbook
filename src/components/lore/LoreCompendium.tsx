import React, { useEffect, useRef, useState } from 'react';
import { IntroView } from './IntroView';
import { RacesView } from './RacesView';
import { DomainsDistrictsView } from './DomainsDistrictsView';
import { GodsView } from './GodsView';
import { BookOpen, Users, Compass, Sparkles, Moon, Sun, Eye } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { LoreCategory } from '../../router/router';
import racesData from '../../data/lore/races.json';
import godsDataRaw from '../../data/lore/gods.json';
import { RaceInfo, ReligionsData } from '../../types/lore';

export type LoreTab = LoreCategory;

interface LoreCompendiumProps {
  onNavigateToMap: (districtId?: string) => void;
  initialDistrictId?: string;
  initialTab?: LoreTab;
}

// Top fixed stack height: Navbar (64px) + Atlas mode sub-bar (56px) = 120px
const UPPER_CHROME_HEIGHT = 120;

export const LoreCompendium: React.FC<LoreCompendiumProps> = ({
  onNavigateToMap,
  initialDistrictId,
}) => {
  const { route, navigate } = useRouter();
  const currentTab: LoreTab = route.loreTab || 'intro';

  const stickyNavRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickyNavHeight, setStickyNavHeight] = useState<number>(68);

  const races = racesData as RaceInfo[];
  const selectedRaceId = route.raceId || 'drow';

  const godsData = godsDataRaw as ReligionsData;
  const godSubsections = godsData.subsections;
  const selectedGodSubId = route.godSubsectionId || 'damnu';
  const currentGodSub = godSubsections.find(s => s.id === selectedGodSubId) || godSubsections[0];
  const godFaces = currentGodSub.faces || [];
  const selectedGodFaceId = route.godFaceId || 'limye';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = stickyNavRef.current;
    if (!el) return;

    const updateHeight = () => {
      setStickyNavHeight(el.offsetHeight);
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [currentTab, selectedGodSubId]);

  const scrollToTopIfNeeded = () => {
    if (window.scrollY > 40) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tabs: Array<{ id: LoreTab; label: string; icon: React.ReactNode }> = [
    { id: 'intro', label: 'Введение в Шпиль', icon: <BookOpen size={16} /> },
    { id: 'races', label: 'Народы Шпиля', icon: <Users size={16} /> },
    { id: 'domains', label: 'Районы и Домены', icon: <Compass size={16} /> },
    { id: 'gods', label: 'Религии и Пантеон', icon: <Sparkles size={16} /> },
  ];

  const handleTabChange = (tabId: LoreTab) => {
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: tabId,
    });
    scrollToTopIfNeeded();
  };

  const handleSelectRace = (raceId: string) => {
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'races',
      raceId,
    });
    scrollToTopIfNeeded();
  };

  const handleSelectGodSub = (subId: string) => {
    const targetSub = godSubsections.find(s => s.id === subId);
    const firstFaceId = targetSub?.faces && targetSub.faces.length > 0 ? targetSub.faces[0].id : undefined;
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'gods',
      godSubsectionId: subId,
      godFaceId: subId === 'damnu' ? (firstFaceId || 'limye') : undefined,
    });
    scrollToTopIfNeeded();
  };

  const handleSelectGodFace = (faceId: string) => {
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'gods',
      godSubsectionId: 'damnu',
      godFaceId: faceId,
    });
    scrollToTopIfNeeded();
  };

  const getGodSubIcon = (id: string, isSelected: boolean) => {
    const color = isSelected ? 'text-[#e5b83b]' : 'text-[#6e685c]';
    switch (id) {
      case 'damnu':
        return <Moon size={16} className={color} />;
      case 'solar-pantheon':
        return <Sun size={16} className={color} />;
      case 'forbidden-cults':
        return <Eye size={16} className={color} />;
      default:
        return <Sparkles size={16} className={color} />;
    }
  };

  const stickyBottomPx = UPPER_CHROME_HEIGHT + stickyNavHeight;

  return (
    <div
      className="space-y-4 w-full max-w-7xl mx-auto"
      style={{ '--lore-sticky-bottom': `${stickyBottomPx}px` } as React.CSSProperties}
    >
      {/* Unified Sticky Top Navigation Stack for Lore & Sub-Categories */}
      <div
        ref={stickyNavRef}
        className={`sticky top-[120px] z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-2.5 pb-3 space-y-2.5 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#06080d]/95 backdrop-blur-md border-b border-[#302310]/90 shadow-[0_12px_32px_rgba(0,0,0,0.9)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Row 1: Category Tabs Bar */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#090b11]/95 border border-[#3e2d14] backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto md:flex-wrap no-scrollbar w-full">
            {tabs.map(tab => {
              const isSelected = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40'
                      : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724] border border-transparent'
                  }`}
                >
                  <span className={isSelected ? 'text-[#f0ca5b]' : 'text-[#6e685c]'}>
                    {tab.icon}
                  </span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2 (Races): Race Selector Pill Tabs */}
        {currentTab === 'races' && (
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#090b11]/95 border border-[#3e2d14] backdrop-blur-md shadow-md overflow-x-auto md:flex-wrap no-scrollbar">
            {races.map(race => {
              const isSelected = race.id === selectedRaceId;
              return (
                <button
                  key={race.id}
                  onClick={() => handleSelectRace(race.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#780016] text-[#ffffff] shadow-md border border-[#c59b27]/40'
                      : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724] border border-transparent'
                  }`}
                >
                  <Users size={15} className={isSelected ? 'text-[#e5b83b]' : 'text-[#6e685c]'} />
                  <span className="whitespace-nowrap">{race.nameRu}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Row 2 & 3 (Gods): Religion Subsection & Three Faces Navigation */}
        {currentTab === 'gods' && (
          <>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#090b11]/95 border border-[#3e2d14] backdrop-blur-md shadow-md overflow-x-auto md:flex-wrap no-scrollbar">
              {godSubsections.map(sub => {
                const isSelected = sub.id === selectedGodSubId;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectGodSub(sub.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#780016] text-[#ffffff] shadow-md border border-[#c59b27]/40'
                        : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724] border border-transparent'
                    }`}
                  >
                    {getGodSubIcon(sub.id, isSelected)}
                    <span className="whitespace-nowrap">{sub.title}</span>
                  </button>
                );
              })}
            </div>

            {currentGodSub.id === 'damnu' && godFaces.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-[#0d0f17]/95 border border-[#2b2518] backdrop-blur-md shadow-sm overflow-x-auto md:flex-wrap no-scrollbar">
                {godFaces.map(face => {
                  const isSelected = face.id === selectedGodFaceId;
                  const isPlaceholder = face.isPlaceholder;

                  return (
                    <button
                      key={face.id}
                      onClick={() => handleSelectGodFace(face.id)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-all ${
                        isSelected
                          ? 'bg-[#231418] text-[#f5d061] border border-[#780016] shadow-sm font-semibold'
                          : 'text-[#8c8577] hover:text-[#d4cebf] hover:bg-[#141724] border border-transparent'
                      }`}
                    >
                      <Moon size={13} className={isSelected ? 'text-[#f5d061]' : 'text-[#5e584c]'} />
                      <span className="whitespace-nowrap">{face.nameRu}</span>
                      {isPlaceholder && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1f1b14] text-[#a89260] border border-[#3d321c]">
                          Скоро
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Tab Content */}
      <main className="min-h-[60vh]">
        {currentTab === 'intro' && (
          <IntroView
            onNavigateToMap={() => onNavigateToMap()}
          />
        )}
        {currentTab === 'races' && <RacesView />}
        {currentTab === 'domains' && (
          <DomainsDistrictsView
            onNavigateToMap={(distId) => onNavigateToMap(distId)}
            initialDistrictId={initialDistrictId}
          />
        )}
        {currentTab === 'gods' && <GodsView />}
      </main>
    </div>
  );
};
