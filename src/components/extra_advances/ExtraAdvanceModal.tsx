import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { ExtraAdvance, AbilityTier } from '../../types/game';
import { TagBadge } from '../common/TagBadge';

interface ExtraAdvanceModalProps {
  advance: ExtraAdvance;
  onClose: () => void;
}

export const ExtraAdvanceModal: React.FC<ExtraAdvanceModalProps> = ({ advance, onClose }) => {
  const [activeTier, setActiveTier] = useState<AbilityTier | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'abilities'>('overview');
  const bodyScrollRef = useRef<HTMLDivElement>(null);

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

  const handleTabSelect = (tab: 'overview' | 'abilities') => {
    setActiveTab(tab);
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTop = 0;
    }
  };

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

  const tabItems: Array<{ id: 'overview' | 'abilities'; mobileLabel: string; desktopLabel: string }> = [
    { id: 'overview', mobileLabel: '1. Обзор', desktopLabel: '1. Обзор и Требования' },
    { id: 'abilities', mobileLabel: `2. Способности (${abilities.length})`, desktopLabel: `2. Древо Способностей (${abilities.length})` },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden bg-black/92 animate-in fade-in duration-150"
    >
      <div
        className="relative w-full h-[100dvh] sm:h-auto sm:max-w-5xl sm:max-h-[92dvh] flex flex-col bg-[#11131a] sm:border border-[#5e4713] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden text-[#e2dcd2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate Spire Corner Accents (desktop/tablet) */}
        <div className="hidden sm:block absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#5e4713] pointer-events-none z-20" />
        <div className="hidden sm:block absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#5e4713] pointer-events-none z-20" />
        <div className="hidden sm:block absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#5e4713] pointer-events-none z-20" />
        <div className="hidden sm:block absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#5e4713] pointer-events-none z-20" />

        {/* Mobile Sticky Compact Header */}
        <div className="sm:hidden flex-shrink-0 bg-gradient-to-r from-[#290710] via-[#1a121e] to-[#11131a] border-b border-[#3d2b0e] px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="min-w-0">
              <h2 className="text-lg font-heading font-bold text-[#e5b83b] truncate leading-tight">
                {advance.nameRu}
              </h2>
              {advance.nameEn && (
                <span className="text-[10px] font-heading tracking-widest text-[#959085] uppercase block truncate">
                  {advance.nameEn}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] transition-colors border border-[#3d2b0e] flex-shrink-0"
              title="Закрыть"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {tabItems.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                    isSelected
                      ? tab.id === 'abilities'
                        ? 'bg-[#780016] text-white shadow border border-[#c59b27]'
                        : 'bg-[#c59b27] text-black shadow'
                      : 'text-[#959085] bg-[#161822] hover:text-[#e0dacf]'
                  }`}
                >
                  {tab.mobileLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Top Header Banner (hidden on mobile < sm) */}
        <div className="hidden sm:block relative flex-shrink-0 p-6 sm:p-8 bg-gradient-to-r from-[#290710] via-[#1a121e] to-[#11131a] border-b border-[#3d2b0e]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] transition-colors border border-[#3d2b0e]"
            title="Закрыть"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {advance.image && (
              <div className="w-24 h-32 sm:w-32 sm:h-44 rounded-xl overflow-hidden border-2 border-[#c59b27] shadow-2xl flex-shrink-0 bg-black">
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

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#e5b83b]">
                  {advance.nameRu}
                </h2>
                {advance.nameEn && (
                  <span className="text-sm font-heading tracking-widest text-[#959085] uppercase">
                    {advance.nameEn}
                  </span>
                )}
              </div>

              {advance.quote && (
                <p className="mt-2 text-lg sm:text-xl text-[#f5efe3] font-flavor italic border-l-4 border-[#780016] pl-3.5 leading-relaxed">
                  {advance.quote}
                </p>
              )}

              {/* Requirement & Refresh Quick Badges in Header */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#261f12] text-[#f0cb78] border border-[#54431e] font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#c59b27] shrink-0" />
                  <span className="font-heading uppercase tracking-wider text-[11px] text-[#e5b83b]">Требование:</span>
                  <span className="text-[#ddd7cb]">{advance.requirement}</span>
                </span>
                {advance.refresh && (
                  <span className="px-2.5 py-1 rounded-md bg-[#2d1217] text-[#f2aab8] border border-[#780016] font-medium flex items-center gap-1.5">
                    <Heart size={13} className="text-[#e64c65] shrink-0" />
                    <span className="font-heading uppercase tracking-wider text-[11px] text-[#f2aab8]">Отдушина:</span>
                    <span className="text-[#ddd7cb]">{advance.refresh}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Bar inside desktop modal */}
          <div className="mt-6 pt-4 border-t border-[#312517] flex gap-2">
            {tabItems.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                    isSelected
                      ? tab.id === 'abilities'
                        ? 'bg-[#780016] text-white shadow border border-[#c59b27]'
                        : 'bg-[#c59b27] text-black shadow'
                      : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1f2230]'
                  }`}
                >
                  {tab.desktopLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div ref={bodyScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-5 sm:space-y-6">
          {/* TAB 1: OVERVIEW & REQUIREMENTS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Mobile-only Scrollable Profile Banner (portrait + quote) */}
              {(advance.image || advance.quote) && (
                <div className="sm:hidden pb-4 border-b border-[#252838] flex items-start gap-3.5">
                  {advance.image && (
                    <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-[#c59b27] shadow-xl flex-shrink-0 bg-black">
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
                  {advance.quote && (
                    <p className="flex-1 text-sm text-[#f5efe3] font-flavor italic border-l-2 border-[#780016] pl-2.5 leading-snug">
                      {advance.quote}
                    </p>
                  )}
                </div>
              )}

              {/* Mandatory Requirement Box */}
              <div className="bg-[#151722] p-4 sm:p-5 rounded-2xl border border-[#2b3347] space-y-2">
                <h4 className="text-xs font-heading font-bold text-[#e5b83b] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#c59b27]" />
                  Требование для вступления
                </h4>
                <p className="text-sm sm:text-base text-[#e5e0d3] font-medium leading-relaxed">
                  {advance.requirement}
                </p>
              </div>

              {/* Mandatory Refresh Box */}
              {advance.refresh && (
                <div className="bg-[#1e1317] p-4 sm:p-5 rounded-2xl border border-[#521c27] flex items-start gap-3.5">
                  <Heart className="text-[#e64c65] mt-1 flex-shrink-0" size={20} />
                  <div className="space-y-1">
                    <h4 className="text-xs font-heading font-bold text-[#e64c65] uppercase tracking-wider">
                      Отдушина (Refresh)
                    </h4>
                    <p className="text-sm sm:text-base text-[#e0dacf] font-medium leading-relaxed">
                      {advance.refresh}
                    </p>
                  </div>
                </div>
              )}

              {/* Organization & Lore Description */}
              {advance.description && (
                <div className="bg-[#151722] p-4 sm:p-5 rounded-2xl border border-[#262c3e] space-y-3">
                  <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-[#c59b27]" />
                    О фракции и продвижении
                  </h4>
                  <p className="text-sm sm:text-base text-[#ccc5b8] leading-relaxed">
                    {advance.description}
                  </p>
                </div>
              )}

              {/* Quick Action to Abilities Tree */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => handleTabSelect('abilities')}
                  className="px-5 py-2.5 rounded-xl bg-[#251017] hover:bg-[#780016] text-[#f0cb78] hover:text-white border border-[#780016] text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
                >
                  <span>Изучить все {abilities.length} способностей</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ABILITIES (TIER-BASED ADVANCES) */}
          {activeTab === 'abilities' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#262a3a]">
                {/* Tier Filter Tabs */}
                <div className="flex flex-wrap gap-1 bg-[#0b0c10] p-1 rounded-xl border border-[#262a3a]">
                  {tierFilterOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveTier(opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-medium ${
                        activeTier === opt.id
                          ? 'bg-[#780016] text-white shadow border border-[#c59b27]'
                          : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of abilities matching ClassModal */}
              {filteredAbilities.length === 0 ? (
                <p className="text-sm text-[#78736a] text-center py-8">
                  В этой категории способностей не найдено.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAbilities.map(ab => (
                    <div
                      key={ab.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#161824] border border-[#262c3e] hover:border-[#5e4713] transition-colors flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-heading font-bold text-sm sm:text-base text-[#e5b83b]">
                            {ab.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {ab.tag && <TagBadge tagName={ab.tag} />}
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold border ${
                              ab.tier === 'low'
                                ? 'bg-[#1b2738] text-[#9fc2f5] border-[#23456b]'
                                : ab.tier === 'medium'
                                ? 'bg-[#2b2413] text-[#f0cb78] border-[#6b5523]'
                                : ab.tier === 'high'
                                ? 'bg-[#30163b] text-[#d69ff5] border-[#6b2582]'
                                : 'bg-[#3b121e] text-[#f08ea4] border-[#781829]'
                            }`}>
                              {ab.tier === 'low'
                                ? 'Малое'
                                : ab.tier === 'medium'
                                ? 'Среднее'
                                : ab.tier === 'high'
                                ? 'Высокого уровня'
                                : 'Ключевое'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-[#ddd7cb] leading-relaxed">
                          {ab.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer matching ClassModal */}
        <div className="flex-shrink-0 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0d0e14] border-t border-[#262a3a] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 sm:px-6 py-2 rounded-xl bg-[#252938] hover:bg-[#780016] text-[#e0dacf] text-xs font-heading font-semibold tracking-wider uppercase transition-colors"
          >
            Закрыть продвижение
          </button>
        </div>
      </div>
    </div>
  );
};
