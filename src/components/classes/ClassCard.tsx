import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { CharacterClass } from '../../types/game';

interface ClassCardProps {
  characterClass: CharacterClass;
  onSelect: (characterClass: CharacterClass) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ characterClass, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(characterClass)}
      className="group relative flex flex-col bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#08090d] rounded-2xl overflow-hidden border border-[#2b2f40] hover:border-[#c59b27] shadow-xl hover:shadow-[0_0_35px_rgba(120,0,22,0.45)] transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
    >
      {/* Ornate Spire Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#5e4713] group-hover:border-[#e5b83b] transition-colors z-20 pointer-events-none" />

      {/* Hero Cover Image Banner */}
      <div className="relative h-80 sm:h-96 w-full bg-[#08090d] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[#3d030d]/60 via-transparent to-transparent transition-opacity duration-500 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
          <span className="text-[11px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#e5b83b] border border-[#5e4713] shadow-md group-hover:border-[#c59b27] transition-colors">
            {characterClass.nameEn}
          </span>
          <span className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-md bg-[#780016]/90 text-[#f7e6e9] border border-[#a8112b] shadow-md">
            {characterClass.abilities?.length || 0} способностей
          </span>
        </div>

        {/* Title over gradient */}
        <div className="absolute bottom-3 left-5 right-5 z-10">
          <h3 className="text-2xl sm:text-[27px] font-heading font-black text-[#f0cb78] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-white transition-colors">
            {characterClass.nameRu}
          </h3>
        </div>
      </div>

      {/* Card Body: Atmospheric Fluff Quote & Action */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#08090d] to-[#0e1017]">
        {/* Fluff Quote */}
        {characterClass.quote ? (
          <div className="relative pl-4 border-l-2 border-[#780016] group-hover:border-[#c59b27] transition-colors py-1">
            <span className="absolute -top-3 -left-1 text-2xl font-serif text-[#780016] group-hover:text-[#c59b27] select-none transition-colors opacity-70">
              “
            </span>
            <p className="text-sm sm:text-[15px] text-[#ebe4d5] font-flavor italic leading-relaxed line-clamp-4">
              {characterClass.quote}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#959085] italic">
            {characterClass.inANutshell || characterClass.whoIs || characterClass.description}
          </p>
        )}

        {/* Bottom CTA Button */}
        <div className="pt-3 border-t border-[#1f2330] group-hover:border-[#3d2b0e] flex items-center justify-between text-xs font-heading font-bold text-[#c59b27] group-hover:text-[#f0cb78] transition-colors">
          <span className="tracking-wider uppercase">Изучить досье класса</span>
          <div className="w-7 h-7 rounded-full bg-[#161824] group-hover:bg-[#780016] border border-[#31374a] group-hover:border-[#c59b27] flex items-center justify-center transition-all">
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform text-[#e5b83b] group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
