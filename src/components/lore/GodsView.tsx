import React from 'react';
import { LoreArticleLayout } from './LoreArticleLayout';
import godsDataRaw from '../../data/lore/gods.json';
import { ReligionsData } from '../../types/lore';
import { Moon, Sun, Sparkles, Eye, Skull } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useTheme } from '../../theme/ThemeContext';

export const GodsView: React.FC = () => {
  const { route } = useRouter();
  const { isGoingDark } = useTheme();
  const data = godsDataRaw as ReligionsData;
  const subsections = data.subsections;

  // Selected top-level religion subsection from route, fallback to 'damnu'
  const selectedSubId = route.godSubsectionId || 'damnu';
  const currentSubsection = subsections.find(s => s.id === selectedSubId) || subsections[0];

  // Selected face within Damnu (default to Limye if not in route)
  const faces = currentSubsection.faces || [];
  const selectedFaceId = route.godFaceId || 'limye';
  const currentFace = faces.find(f => f.id === selectedFaceId) || faces[0];

  const getSubIcon = (id: string, isSelected: boolean) => {
    const color = isSelected
      ? isGoingDark
        ? 'text-[#38bdf8]'
        : 'text-[#e5b83b]'
      : isGoingDark
        ? 'text-[#64748b]'
        : 'text-[#6e685c]';
    switch (id) {
      case 'damnu':
        return <Moon size={16} className={color} />;
      case 'charnel':
        return <Skull size={16} className={color} />;
      case 'solar-pantheon':
        return <Sun size={16} className={color} />;
      case 'forbidden-cults':
        return <Eye size={16} className={color} />;
      default:
        return <Sparkles size={16} className={color} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* When Damnu is selected: Description banner & active Face Article */}
      {currentSubsection.id === 'damnu' && faces.length > 0 && (
        <div className="space-y-4">
          <div
            className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              isGoingDark
                ? 'spire-banner spire-ink-hatch bg-gradient-to-r from-[#0d1730] to-[#060b17] border-2 border-black shadow-[4px_4px_0px_#000000]'
                : 'rounded-xl bg-gradient-to-r from-[#121622]/90 to-[#0e111a]/90 border border-[#2e2617]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                    isGoingDark
                      ? 'font-mono bg-[#b91c1c] text-white border border-black'
                      : 'rounded font-heading bg-[#281a0b] text-[#e5b83b] border border-[#5c411b]'
                  }`}
                >
                  {currentSubsection.badge}
                </span>
                <span
                  className={`text-xs tracking-wider ${
                    isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                  }`}
                >
                  {currentSubsection.titleEn}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed ${
                  isGoingDark ? 'text-[#cbd5e1]' : 'text-[#b8b0a2]'
                }`}
              >
                {currentSubsection.description}
              </p>
            </div>
          </div>

          {/* Render Active Face Article or Placeholder */}
          {currentFace && currentFace.sections && currentFace.sections.length > 0 ? (
            <LoreArticleLayout
              id={`face-${currentFace.id}`}
              title={currentFace.nameRu}
              subtitle={[currentFace.nameEn, currentFace.aspect, currentFace.status].filter(Boolean).join(' • ')}
              quote={currentFace.quote}
              image={currentFace.image ? {
                url: currentFace.image,
                caption: `Иллюстрация: ${currentFace.nameRu}`,
                alt: currentFace.nameRu
              } : undefined}
              lead={currentFace.overview}
              sections={currentFace.sections}
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
                <Moon size={32} />
              </div>
              <div>
                <h3
                  className={`text-2xl sm:text-3xl font-heading font-bold ${
                    isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
                  }`}
                >
                  {currentFace.nameRu}
                </h3>
                <p
                  className={`text-xs tracking-widest uppercase mt-1 ${
                    isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                  }`}
                >
                  {currentFace.nameEn} • {currentFace.aspect}
                </p>
              </div>

              {currentFace.quote && (
                <div
                  className={`p-4 border-l-2 italic text-xs sm:text-sm max-w-lg mx-auto text-left ${
                    isGoingDark
                      ? 'bg-[#040812] border-[#38bdf8] text-[#e2e8f0]'
                      : 'rounded-xl bg-[#090b10] border-[#c59b27] text-[#d4cebf]'
                  }`}
                >
                  {currentFace.quote}
                </div>
              )}

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-md mx-auto pt-2 ${
                  isGoingDark ? 'text-[#cbd5e1]' : 'text-[#b8b0a2]'
                }`}
              >
                {currentFace.overview}
              </p>

              <div className="pt-4">
                <span
                  className={`px-3.5 py-1.5 text-xs font-medium ${
                    isGoingDark
                      ? 'font-mono bg-[#03050b] text-[#7dd3fc] border-2 border-black'
                      : 'rounded-full font-heading bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]'
                  }`}
                >
                  Глава находится в процессе перевода и адаптации
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* When other subsections are selected */}
      {currentSubsection.id !== 'damnu' && (
        !currentSubsection.isPlaceholder && currentSubsection.sections && currentSubsection.sections.length > 0 ? (
          <LoreArticleLayout
            id={`god-${currentSubsection.id}`}
            title={currentSubsection.title}
            subtitle={[currentSubsection.titleEn, currentSubsection.badge].filter(Boolean).join(' • ')}
            quote={currentSubsection.quote}
            image={currentSubsection.image ? {
              url: currentSubsection.image,
              caption: `Иллюстрация: ${currentSubsection.title}`,
              alt: currentSubsection.title
            } : undefined}
            lead={currentSubsection.overview}
            sections={currentSubsection.sections}
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
              {getSubIcon(currentSubsection.id, true)}
            </div>
            <div>
              <h3
                className={`text-2xl sm:text-3xl font-heading font-bold ${
                  isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
                }`}
              >
                {currentSubsection.title}
              </h3>
              <p
                className={`text-xs tracking-widest uppercase mt-1 ${
                  isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                }`}
              >
                {currentSubsection.titleEn}
              </p>
            </div>
            <p
              className={`text-sm sm:text-base leading-relaxed max-w-md mx-auto ${
                isGoingDark ? 'text-[#cbd5e1]' : 'text-[#b8b0a2]'
              }`}
            >
              {currentSubsection.description}
            </p>
            <div className="pt-4">
              <span
                className={`px-3.5 py-1.5 text-xs font-medium ${
                  isGoingDark
                    ? 'font-mono bg-[#03050b] text-[#7dd3fc] border-2 border-black'
                    : 'rounded-full font-heading bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]'
                }`}
              >
                Ожидает адаптации из Google Docs кампании
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
