import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CharacterClass } from '../../types/game';
import { useTheme } from '../../theme/ThemeContext';

interface ClassCardProps {
  characterClass: CharacterClass;
  onSelect: (characterClass: CharacterClass) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ characterClass, onSelect }) => {
  const { isGoingDark } = useTheme();

  return (
    <div
      onClick={() => onSelect(characterClass)}
      className={`spire-card-shell group relative flex flex-col overflow-hidden cursor-pointer transform ${
        isGoingDark
          ? 'bg-gradient-to-b from-[#0d1730] via-[#081022] to-[#040812] border-2 border-black hover:border-[#38bdf8] shadow-[5px_5px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1.5'
          : 'bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#08090d] rounded-2xl border border-[#2b2f40] hover:border-[#c59b27] shadow-xl hover:shadow-[0_0_35px_rgba(120,0,22,0.45)] transition-all duration-500 hover:-translate-y-2'
      }`}
    >
      {/* Ornate Spire Corner Accents (Classic only) */}
      {!isGoingDark && (
        <>
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
        </>
      )}

      {/* Hero Cover Image Banner */}
      <div
        className={`relative h-80 sm:h-96 w-full overflow-hidden ${
          isGoingDark ? 'bg-[#040812] border-b-2 border-black' : 'bg-[#08090d]'
        }`}
      >
        {characterClass.image ? (
          <img
            src={characterClass.image}
            alt={characterClass.nameRu}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#2a0812] to-[#0a0c12]">
            <Sparkles className="text-[#c59b27]" size={48} />
          </div>
        )}

        {/* Cinematic Vignette Overlays */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isGoingDark
              ? 'from-[#040812] via-[#070f22]/55 to-transparent'
              : 'from-[#08090d] via-[#08090d]/40 to-transparent'
          }`}
        />
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t transition-opacity duration-500 pointer-events-none ${
            isGoingDark
              ? 'from-[#0f294a]/75 via-transparent to-transparent'
              : 'from-[#3d030d]/60 via-transparent to-transparent'
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10 gap-2">
          <span
            className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-3 py-1 transition-colors ${
              isGoingDark
                ? 'font-mono bg-[#03050b] text-[#7dd3fc] border-2 border-black shadow-[2px_2px_0px_#000000] group-hover:border-[#38bdf8]'
                : 'font-heading rounded-md bg-black/80 backdrop-blur-md text-[#e5b83b] border border-[#5e4713] shadow-md group-hover:border-[#c59b27]'
            }`}
          >
            {isGoingDark ? `ДЕЛО • ${characterClass.nameEn}` : characterClass.nameEn}
          </span>
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 tabular-nums ${
              isGoingDark
                ? 'font-mono font-bold uppercase bg-[#b91c1c] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                : 'font-heading rounded-md bg-[#780016]/90 text-[#f7e6e9] border border-[#a8112b] shadow-md'
            }`}
          >
            {characterClass.abilities?.length || 0} способностей
          </span>
        </div>

        {/* Title over gradient */}
        <div className="absolute bottom-3 left-5 right-5 z-10">
          <h3
            className={`text-2xl sm:text-[27px] font-heading font-black transition-colors ${
              isGoingDark
                ? 'text-[#f0f6ff] drop-shadow-[2px_2px_0px_#000000] group-hover:text-[#7dd3fc] tracking-wide'
                : 'text-[#f0cb78] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-white'
            }`}
          >
            {characterClass.nameRu}
          </h3>
        </div>
      </div>

      {/* Card Body: Atmospheric Fluff Quote & Action */}
      <div
        className={`p-5 flex-1 flex flex-col justify-between space-y-4 ${
          isGoingDark
            ? 'spire-ink-hatch bg-gradient-to-b from-[#050a18] to-[#0a1328]'
            : 'bg-gradient-to-b from-[#08090d] to-[#0e1017]'
        }`}
      >
        {/* Fluff Quote */}
        {characterClass.quote ? (
          <div
            className={`relative pl-4 border-l-2 transition-colors py-1 ${
              isGoingDark
                ? 'border-[#38bdf8] group-hover:border-[#e11d48]'
                : 'border-[#780016] group-hover:border-[#c59b27]'
            }`}
          >
            <span
              className={`absolute -top-3 -left-1 text-2xl font-serif select-none transition-colors opacity-75 ${
                isGoingDark
                  ? 'text-[#38bdf8] group-hover:text-[#e11d48]'
                  : 'text-[#780016] group-hover:text-[#c59b27]'
              }`}
            >
              “
            </span>
            <p
              className={`text-sm sm:text-[15px] font-flavor italic leading-relaxed line-clamp-4 ${
                isGoingDark ? 'text-[#dbeafe]' : 'text-[#ebe4d5]'
              }`}
            >
              {characterClass.quote}
            </p>
          </div>
        ) : (
          <p className={`text-xs italic ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
            {characterClass.inANutshell || characterClass.whoIs || characterClass.description}
          </p>
        )}

        {/* Bottom CTA Button */}
        <div
          className={`pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${
            isGoingDark
              ? 'border-black font-mono text-[#7dd3fc] group-hover:text-white'
              : 'border-[#1f2330] group-hover:border-[#3d2b0e] font-heading text-[#c59b27] group-hover:text-[#f0cb78]'
          }`}
        >
          <span className="tracking-wider uppercase">Изучить досье класса</span>
          <div
            className={`w-7 h-7 flex items-center justify-center transition-all ${
              isGoingDark
                ? 'bg-[#0b152c] group-hover:bg-[#b91c1c] border-2 border-black shadow-[2px_2px_0px_#000000]'
                : 'rounded-full bg-[#161824] group-hover:bg-[#780016] border border-[#31374a] group-hover:border-[#c59b27]'
            }`}
          >
            <ChevronRight
              size={15}
              className={`group-hover:translate-x-0.5 transition-transform ${
                isGoingDark
                  ? 'text-[#38bdf8] group-hover:text-white'
                  : 'text-[#e5b83b] group-hover:text-white'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
