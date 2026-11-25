import React from 'react';
import { LoreArticleLayout } from './LoreArticleLayout';
import racesData from '../../data/lore/races.json';
import { RaceInfo } from '../../types/lore';
import { Scroll } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';

export const RacesView: React.FC = () => {
  const { route } = useRouter();
  const races: RaceInfo[] = racesData as RaceInfo[];
  const selectedRaceId = route.raceId || 'drow';

  const currentRace = races.find(r => r.id === selectedRaceId) || races[0];
  const hasContent = currentRace.sections && currentRace.sections.length > 0;

  return (
    <div className="space-y-6">
      {/* Render Current Race Article or Placeholder */}
      {hasContent ? (
        <LoreArticleLayout
          id={`race-${currentRace.id}`}
          title={currentRace.nameRu}
          subtitle={`${currentRace.nameEn} • ${currentRace.status}`}
          quote={currentRace.quote}
          image={currentRace.image ? {
            url: currentRace.image,
            caption: `Иллюстрация: ${currentRace.nameRu}`,
            alt: currentRace.nameRu
          } : undefined}
          lead={currentRace.overview}
          sections={currentRace.sections}
        />
      ) : (
        <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] text-center space-y-4 max-w-2xl mx-auto shadow-2xl my-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1b1710] border border-[#5e4713] flex items-center justify-center text-[#c59b27] shadow-lg">
            <Scroll size={32} />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
              {currentRace.nameRu}
            </h3>
            <span className="text-xs font-heading tracking-widest text-[#959085] uppercase">
              {currentRace.nameEn}
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#b8b0a2] leading-relaxed max-w-lg mx-auto">
            Материалы по этому разделу лора находятся в подготовке и будут добавлены из документов кампании.
          </p>
          <div className="pt-2">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-heading font-medium bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]">
              Ожидает адаптации из Google Docs кампании
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
