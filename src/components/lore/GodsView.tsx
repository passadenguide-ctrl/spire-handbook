import React from 'react';
import { LoreArticleLayout } from './LoreArticleLayout';
import godsDataRaw from '../../data/lore/gods.json';
import { ReligionsData } from '../../types/lore';
import { Moon, Sun, Sparkles, Eye } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';

export const GodsView: React.FC = () => {
  const { route, navigate } = useRouter();
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

  const handleSelectSubsection = (subId: string) => {
    const targetSub = subsections.find(s => s.id === subId);
    const firstFaceId = targetSub?.faces && targetSub.faces.length > 0 ? targetSub.faces[0].id : undefined;
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'gods',
      godSubsectionId: subId,
      godFaceId: subId === 'damnu' ? (firstFaceId || 'limye') : undefined,
    });
  };

  const handleSelectFace = (faceId: string) => {
    navigate({
      tab: 'districts',
      atlasMode: 'lore',
      loreTab: 'gods',
      godSubsectionId: 'damnu',
      godFaceId: faceId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top-Level Religion Subsection Selector */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#090b11]/90 border border-[#3e2d14] backdrop-blur-md shadow-md">
        {subsections.map(sub => {
          const isSelected = sub.id === selectedSubId;
          return (
            <button
              key={sub.id}
              onClick={() => handleSelectSubsection(sub.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                isSelected
                  ? 'bg-[#780016] text-[#ffffff] shadow-lg border border-[#c59b27]/40 scale-[1.02]'
                  : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724]'
              }`}
            >
              {getSubIcon(sub.id, isSelected)}
              <span>{sub.title}</span>
            </button>
          );
        })}
      </div>

      {/* When Damnu is selected: Sub-tab selector for the Three Faces of the Moon */}
      {currentSubsection.id === 'damnu' && faces.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#121622]/90 to-[#0e111a]/90 border border-[#2e2617] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#281a0b] text-[#e5b83b] border border-[#5c411b]">
                  {currentSubsection.badge}
                </span>
                <span className="text-xs text-[#959085] font-heading tracking-wider">
                  {currentSubsection.titleEn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#b8b0a2] mt-1.5 max-w-3xl leading-relaxed">
                {currentSubsection.description}
              </p>
            </div>
          </div>

          {/* Three Faces Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0d0f17] border border-[#2b2518]">
            {faces.map(face => {
              const isSelected = face.id === selectedFaceId;
              const isPlaceholder = face.isPlaceholder;

              return (
                <button
                  key={face.id}
                  onClick={() => handleSelectFace(face.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-medium transition-all ${
                    isSelected
                      ? 'bg-[#231418] text-[#f5d061] border border-[#780016] shadow-sm font-semibold'
                      : 'text-[#8c8577] hover:text-[#d4cebf] hover:bg-[#141724]'
                  }`}
                >
                  <Moon size={14} className={isSelected ? 'text-[#f5d061]' : 'text-[#5e584c]'} />
                  <span>{face.nameRu}</span>
                  {isPlaceholder && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1f1b14] text-[#a89260] border border-[#3d321c]">
                      Скоро
                    </span>
                  )}
                </button>
              );
            })}
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
            <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] text-center space-y-4 max-w-2xl mx-auto shadow-2xl my-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1b1710] border border-[#5e4713] flex items-center justify-center text-[#c59b27] shadow-lg">
                <Moon size={32} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
                  {currentFace.nameRu}
                </h3>
                <p className="text-xs font-heading tracking-widest text-[#959085] uppercase mt-1">
                  {currentFace.nameEn} • {currentFace.aspect}
                </p>
              </div>

              {currentFace.quote && (
                <div className="p-4 rounded-xl bg-[#090b10] border-l-2 border-[#c59b27] italic text-xs sm:text-sm text-[#d4cebf] max-w-lg mx-auto text-left">
                  {currentFace.quote}
                </div>
              )}

              <p className="text-sm sm:text-base text-[#b8b0a2] leading-relaxed max-w-md mx-auto pt-2">
                {currentFace.overview}
              </p>

              <div className="pt-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-medium bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]">
                  Глава находится в процессе перевода и адаптации
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* When other subsections are selected */}
      {currentSubsection.id !== 'damnu' && (
        <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] text-center space-y-4 max-w-2xl mx-auto shadow-2xl my-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1b1710] border border-[#5e4713] flex items-center justify-center text-[#c59b27] shadow-lg">
            {getSubIcon(currentSubsection.id, true)}
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
              {currentSubsection.title}
            </h3>
            <p className="text-xs font-heading tracking-widest text-[#959085] uppercase mt-1">
              {currentSubsection.titleEn}
            </p>
          </div>
          <p className="text-sm sm:text-base text-[#b8b0a2] leading-relaxed max-w-md mx-auto">
            {currentSubsection.description}
          </p>
          <div className="pt-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-medium bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]">
              Ожидает адаптации из Google Docs кампании
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
