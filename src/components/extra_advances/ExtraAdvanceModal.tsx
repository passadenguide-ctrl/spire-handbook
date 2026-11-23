import React, { useState, useEffect } from 'react';
import { X, Award, Heart, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { ExtraAdvance, AbilityTier } from '../../types/game';
import { TagBadge } from '../common/TagBadge';

interface ExtraAdvanceModalProps {
  advance: ExtraAdvance;
  onClose: () => void;
}

export const ExtraAdvanceModal: React.FC<ExtraAdvanceModalProps> = ({ advance, onClose }) => {
  const [activeTier, setActiveTier] = useState<AbilityTier | 'all'>('all');

  // Lock background body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard shortcut: close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const abilities = advance.abilities || [];
  const lowCount = abilities.filter(a => a.tier === 'low').length;
  const mediumCount = abilities.filter(a => a.tier === 'medium').length;
  const highCount = abilities.filter(a => a.tier === 'high').length;

  const filteredAbilities = abilities.filter(ab => {
    if (activeTier === 'all') return true;
    return ab.tier === activeTier;
  });

  const tierFilterOptions: Array<{ id: AbilityTier | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'Все продвижения', count: abilities.length },
    ...(lowCount > 0 ? [{ id: 'low' as const, label: 'Малые', count: lowCount }] : []),
    ...(mediumCount > 0 ? [{ id: 'medium' as const, label: 'Средние', count: mediumCount }] : []),
    ...(highCount > 0 ? [{ id: 'high' as const, label: 'Высокого уровня', count: highCount }] : []),
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-black/92 animate-in fade-in duration-150"
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#12141c] border border-[#5e4713] rounded-2xl shadow-2xl overflow-hidden text-[#e2dcd2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#23101b] via-[#1a1420] to-[#12141c] border-b border-[#3d2b0e]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] transition-colors border border-[#3d2b0e]"
            title="Закрыть"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {advance.image && (
              <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#c59b27] shadow-xl flex-shrink-0 bg-black">
                <img
                  src={advance.image}
                  alt={advance.nameRu}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading text-[#c59b27] uppercase tracking-wider bg-[#261f12] px-2 py-0.5 rounded border border-[#54431e]">
                  {advance.source || 'Дополнительное продвижение'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b] mt-1">
                {advance.nameRu}
              </h2>
              {advance.nameEn && (
                <div className="text-xs font-heading tracking-widest text-[#959085] uppercase">
                  {advance.nameEn}
                </div>
              )}
              {advance.quote && (
                <p className="mt-2 text-lg sm:text-xl text-[#f5efe3] font-flavor italic border-l-4 border-[#780016] pl-3.5 leading-relaxed">
                  {advance.quote}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5">
          {/* Requirement Box */}
          <div className="bg-[#1b1924] p-4 rounded-xl border border-[#44385a] flex items-start gap-3">
            <CheckCircle2 className="text-[#a586e8] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-xs font-heading font-bold text-[#a586e8] uppercase tracking-wider">
                Требование для вступления
              </h4>
              <p className="text-sm text-[#e0dacf] mt-1 font-medium leading-relaxed">
                {advance.requirement}
              </p>
            </div>
          </div>

          {/* Refresh Box */}
          {advance.refresh && (
            <div className="bg-[#1e1317] p-4 rounded-xl border border-[#521c27] flex items-start gap-3">
              <Heart className="text-[#e64c65] mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-xs font-heading font-bold text-[#e64c65] uppercase tracking-wider">
                  Отдушина (Refresh)
                </h4>
                <p className="text-sm text-[#e0dacf] mt-1 leading-relaxed">
                  {advance.refresh}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {advance.description && (
            <div className="bg-[#171a24] p-4 rounded-xl border border-[#262b3a] text-sm sm:text-base text-[#e0dacf] leading-relaxed">
              <p>{advance.description}</p>
            </div>
          )}

          {/* Abilities Section with Tier Filters */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#262a3a]">
              <h3 className="text-base font-heading font-bold text-[#e5b83b] flex items-center gap-2">
                <Sparkles size={16} className="text-[#c59b27]" />
                Продвижения и Дары Организации ({abilities.length})
              </h3>

              {/* Tier Filter Pills */}
              <div className="flex flex-wrap gap-1 bg-[#0b0c10] p-1 rounded-xl border border-[#262a3a]">
                {tierFilterOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setActiveTier(opt.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      activeTier === opt.id
                        ? 'bg-[#780016] text-white shadow-md'
                        : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </div>

            {/* List of Abilities */}
            {filteredAbilities.length === 0 ? (
              <p className="text-sm text-[#78736a] text-center py-6">
                В этой категории способностей не найдено.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAbilities.map(ab => (
                  <div
                    key={ab.id}
                    className="p-4 rounded-xl bg-[#161822] border border-[#262c3d] hover:border-[#5e4713] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="font-heading font-semibold text-sm sm:text-base text-[#e5b83b]">
                        {ab.name}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {ab.tag && <TagBadge tagName={ab.tag} />}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono uppercase font-bold tracking-wide border ${
                          ab.tier === 'low'
                            ? 'bg-[#132338] text-[#93c5fd] border-[#23456b]'
                            : ab.tier === 'medium'
                            ? 'bg-[#2b2413] text-[#fcd34d] border-[#6b5523]'
                            : ab.tier === 'high'
                            ? 'bg-[#2d1436] text-[#e879f9] border-[#6b2582]'
                            : 'bg-[#381119] text-[#f87171] border-[#781829]'
                        }`}>
                          {ab.tier === 'low' ? 'Малое продвижение' :
                           ab.tier === 'medium' ? 'Среднее продвижение' :
                           ab.tier === 'high' ? 'Высокого уровня' : 'Ключевое'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#ddd7cb] leading-relaxed">
                      {ab.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0e14] border-t border-[#262a3a] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#252938] hover:bg-[#780016] text-[#e0dacf] text-xs font-heading font-semibold uppercase tracking-wider transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
