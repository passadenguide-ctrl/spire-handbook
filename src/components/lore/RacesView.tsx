import React from 'react';
import { LoreArticleLayout } from './LoreArticleLayout';
import racesData from '../../data/lore/races.json';
import { RaceInfo } from '../../types/lore';
import { Scroll } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useTheme } from '../../theme/ThemeContext';

export const RacesView: React.FC = () => {
  const { route } = useRouter();
  const { isGoingDark } = useTheme();
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
        <div
          className={`p-8 sm:p-14 text-center space-y-4 max-w-2xl mx-auto my-8 ${
            isGoingDark
              ? 'spire-card-shell spire-ink-hatch bg-gradient-to-b from-[#0d1730] to-[#050914] border-2 border-black shadow-[6px_6px_0px_#000000]'
              : 'rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] shadow-2xl'
          }`}
        >
          <div
            className={`w-16 h-16 mx-auto flex items-center justify-center ${
              isGoingDark
                ? 'bg-[#03050b] border-2 border-black text-[#38bdf8] shadow-[3px_3px_0px_#000000]'
                : 'rounded-2xl bg-[#1b1710] border border-[#5e4713] text-[#c59b27] shadow-lg'
            }`}
          >
            <Scroll size={32} />
          </div>
          <div>
            <h3
              className={`text-2xl sm:text-3xl font-heading font-bold ${
                isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
              }`}
            >
              {currentRace.nameRu}
            </h3>
            <span
              className={`text-xs tracking-widest uppercase ${
                isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
              }`}
            >
              {currentRace.nameEn}
            </span>
          </div>
          <p
            className={`text-sm sm:text-base leading-relaxed max-w-lg mx-auto ${
              isGoingDark ? 'text-[#cbd5e1]' : 'text-[#b8b0a2]'
            }`}
          >
            Материалы по этому разделу лора находятся в подготовке и будут добавлены из документов кампании.
          </p>
          <div className="pt-2">
            <span
              className={`inline-block px-3.5 py-1.5 text-xs font-medium ${
                isGoingDark
                  ? 'font-mono bg-[#03050b] text-[#7dd3fc] border-2 border-black'
                  : 'rounded-full font-heading bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]'
              }`}
            >
              Ожидает адаптации из Google Docs кампании
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
