import React from 'react';
import { Award, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ExtraAdvance } from '../../types/game';

interface ExtraAdvanceCardProps {
  advance: ExtraAdvance;
  onSelect: (advance: ExtraAdvance) => void;
}

export const ExtraAdvanceCard: React.FC<ExtraAdvanceCardProps> = ({ advance, onSelect }) => {
  const abilities = advance.abilities || [];
  const lowCount = abilities.filter(a => a.tier === 'low').length;
  const mediumCount = abilities.filter(a => a.tier === 'medium').length;
  const highCount = abilities.filter(a => a.tier === 'high').length;

  const displayName = advance.previewName || advance.nameRu;

  return (
    <div
      onClick={() => onSelect(advance)}
      className="group relative flex flex-col bg-[#13151c] rounded-2xl overflow-hidden border border-[#2b2f40] hover:border-[#a586e8] shadow-lg hover:shadow-2xl hover:shadow-[#44385a]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Cover / Header */}
      <div className="relative h-48 w-full bg-[#0b0c10] overflow-hidden">
        {advance.image ? (
          <img
            src={advance.image}
            alt={advance.nameRu}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 will-change-transform"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#25132b] via-[#1a1024] to-[#10121a] p-4 text-center">
            <Award className="text-[#a586e8] mb-2" size={36} />
            <span className="text-xs font-heading text-[#c59b27] uppercase tracking-wider">
              {advance.source || 'Дополнительное продвижение'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-[#13151c]/50 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#a586e8] border border-[#52416b]">
            {advance.source || 'Фракция / Культ'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b1e42] text-[#e8b5f5] font-medium border border-[#633370]">
            {abilities.length} способностей
          </span>
        </div>

        <div className="absolute bottom-2 left-4 right-4">
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#e5b83b] drop-shadow-md group-hover:text-white transition-colors">
            {displayName}
          </h3>
          {advance.previewName && advance.previewName !== advance.nameRu && (
            <div className="text-xs text-[#ddd7cb] font-serif italic drop-shadow-md line-clamp-1">
              {advance.nameRu}
            </div>
          )}
          {advance.nameEn && (
            <div className="text-[10px] text-[#959085] uppercase tracking-wider font-heading mt-0.5">
              {advance.nameEn}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Tier breakdown pills */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-heading uppercase tracking-wider text-[#8b8478] flex items-center gap-1">
            <Sparkles size={11} className="text-[#c59b27]" /> Уровни продвижений:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lowCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-[#132338] text-[#93c5fd] border border-[#23456b]">
                Малые: {lowCount}
              </span>
            )}
            {mediumCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-[#2b2413] text-[#fcd34d] border border-[#6b5523]">
                Средние: {mediumCount}
              </span>
            )}
            {highCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-[#2d1436] text-[#e879f9] border border-[#6b2582]">
                Высокие: {highCount}
              </span>
            )}
          </div>
        </div>

        {/* Requirement */}
        <div className="bg-[#181622] p-2.5 rounded-xl border border-[#302a42] text-xs">
          <div className="text-[10px] font-heading font-bold text-[#a586e8] uppercase mb-0.5 flex items-center gap-1">
            <CheckCircle2 size={11} /> Требование для вступления:
          </div>
          <p className="text-[#c5beb3] line-clamp-2 leading-relaxed">
            {advance.requirement}
          </p>
        </div>

        {/* Footer Link */}
        <div className="pt-2 border-t border-[#222634] flex items-center justify-between text-xs font-heading font-semibold text-[#a586e8] group-hover:text-[#c5b0f5]">
          <span>Изучить продвижения</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
