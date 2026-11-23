import React, { useState } from 'react';
import { IntroView } from './IntroView';
import { RacesView } from './RacesView';
import { DomainsDistrictsView } from './DomainsDistrictsView';
import { GodsView } from './GodsView';
import { BookOpen, Users, Compass, Sparkles, MapPin } from 'lucide-react';

export type LoreTab = 'intro' | 'races' | 'domains' | 'gods';

interface LoreCompendiumProps {
  onNavigateToMap: (districtId?: string) => void;
  initialDistrictId?: string;
  initialTab?: LoreTab;
}

export const LoreCompendium: React.FC<LoreCompendiumProps> = ({
  onNavigateToMap,
  initialDistrictId,
  initialTab = 'intro'
}) => {
  const [currentTab, setCurrentTab] = useState<LoreTab>(initialTab);

  const tabs: Array<{ id: LoreTab; label: string; icon: React.ReactNode }> = [
    { id: 'intro', label: 'Введение в Шпиль', icon: <BookOpen size={16} /> },
    { id: 'races', label: 'Народы Шпиля', icon: <Users size={16} /> },
    { id: 'domains', label: 'Районы и Домены', icon: <Compass size={16} /> },
    { id: 'gods', label: 'Религии и Пантеон', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Category Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#090b11]/95 border border-[#3e2d14] backdrop-blur-md shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tabs.map(tab => {
            const isSelected = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#780016] text-white shadow-lg border border-[#c59b27]/40 scale-[1.02]'
                    : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724]'
                }`}
              >
                <span className={isSelected ? 'text-[#f0ca5b]' : 'text-[#6e685c]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick jump to map */}
        <button
          onClick={() => onNavigateToMap()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1c2233] text-[#c59b27] border border-[#2d3852] text-xs font-heading font-medium transition-colors"
        >
          <MapPin size={14} className="text-[#ef4444]" />
          <span>К интерактивной карте</span>
        </button>
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
