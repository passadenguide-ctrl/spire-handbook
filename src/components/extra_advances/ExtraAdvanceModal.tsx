import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, CheckCircle2, BookOpen, ChevronRight } from 'lucide-react';
import { ExtraAdvance, AbilityTier } from '../../types/game';
import { TagBadge } from '../common/TagBadge';
import { useTheme } from '../../theme/ThemeContext';

interface ExtraAdvanceModalProps {
  advance: ExtraAdvance;
  onClose: () => void;
}

export const ExtraAdvanceModal: React.FC<ExtraAdvanceModalProps> = ({ advance, onClose }) => {
  const { isGoingDark } = useTheme();
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
        className={`relative w-full h-[100dvh] sm:h-auto sm:max-w-5xl sm:max-h-[92dvh] flex flex-col rounded-none overflow-hidden ${
          isGoingDark
            ? 'spire-modal-shell bg-[#081022] sm:border-2 border-black shadow-[8px_8px_0px_#000000] text-[#e2e8f0]'
            : 'bg-[#11131a] sm:border border-[#5e4713] sm:rounded-2xl shadow-2xl text-[#e2dcd2]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate Spire Corner Accents (desktop/tablet Classic only) */}
        {!isGoingDark && (
          <>
            <div className="hidden sm:block absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#5e4713] pointer-events-none z-20" />
            <div className="hidden sm:block absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#5e4713] pointer-events-none z-20" />
            <div className="hidden sm:block absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#5e4713] pointer-events-none z-20" />
            <div className="hidden sm:block absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#5e4713] pointer-events-none z-20" />
          </>
        )}

        {/* Mobile Sticky Compact Header */}
        <div
          className={`sm:hidden flex-shrink-0 px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 border-b ${
            isGoingDark
              ? 'spire-modal-header bg-gradient-to-r from-[#0d1730] via-[#091124] to-[#060b17] border-b-2 border-black'
              : 'bg-gradient-to-r from-[#290710] via-[#1a121e] to-[#11131a] border-[#3d2b0e]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="min-w-0">
              <h2
                className={`text-lg font-heading font-bold truncate leading-tight ${
                  isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
                }`}
              >
                {advance.nameRu}
              </h2>
              {advance.nameEn && (
                <span
                  className={`text-[10px] tracking-widest uppercase block truncate ${
                    isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                  }`}
                >
                  {advance.nameEn}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2 min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors flex-shrink-0 ${
                isGoingDark
                  ? 'bg-[#03050b] hover:bg-[#b91c1c] text-[#e2e8f0] border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] border border-[#3d2b0e]'
              }`}
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
                  className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    isGoingDark
                      ? isSelected
                        ? tab.id === 'abilities'
                          ? 'font-mono bg-[#b91c1c] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                          : 'font-mono bg-[#38bdf8] text-[#03050b] border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'font-mono text-[#94a3b8] bg-[#040812] border border-[#1e315c] hover:text-white'
                      : isSelected
                        ? tab.id === 'abilities'
                          ? 'rounded-lg font-heading bg-[#780016] text-white shadow border border-[#c59b27]'
                          : 'rounded-lg font-heading bg-[#c59b27] text-black shadow'
                        : 'rounded-lg font-heading text-[#959085] bg-[#161822] hover:text-[#e0dacf]'
                  }`}
                >
                  {tab.mobileLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Top Header Banner (hidden on mobile < sm) */}
        <div
          className={`hidden sm:block relative overflow-hidden flex-shrink-0 p-6 sm:p-8 border-b ${
            isGoingDark
              ? 'spire-modal-header bg-gradient-to-r from-[#0d1730] via-[#091124] to-[#060b17] border-b-2 border-black'
              : 'bg-gradient-to-r from-[#290710] via-[#1a121e] to-[#11131a] border-[#3d2b0e]'
          }`}
        >
          {isGoingDark && (
            <div className="spire-ink-hatch absolute inset-y-0 right-0 w-1/3 pointer-events-none opacity-45" />
          )}
          <button
            onClick={onClose}
            className={`relative z-20 sm:absolute top-4 right-4 p-2 transition-colors ${
              isGoingDark
                ? 'bg-[#03050b] hover:bg-[#b91c1c] text-[#e2e8f0] border-2 border-black shadow-[3px_3px_0px_#000000]'
                : 'rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] border border-[#3d2b0e]'
            }`}
            title="Закрыть"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {advance.image && (
              <div
                className={`w-24 h-32 sm:w-32 sm:h-44 overflow-hidden flex-shrink-0 ${
                  isGoingDark
                    ? 'border-2 border-black shadow-[5px_5px_0px_#000000] bg-[#03050b]'
                    : 'rounded-xl border-2 border-[#c59b27] shadow-2xl bg-black'
                }`}
              >
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
              {isGoingDark && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="spire-archive-stamp">ПРОТОКОЛ ПРОДВИЖЕНИЯ</span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7dd3fc]">
                    АРХИВ МИНИСТЕРСТВА
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className={`text-2xl sm:text-4xl font-heading font-bold ${
                    isGoingDark ? 'text-[#f0f6ff] tracking-wide' : 'text-[#e5b83b]'
                  }`}
                >
                  {advance.nameRu}
                </h2>
                {advance.nameEn && (
                  <span
                    className={`text-sm tracking-widest uppercase ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                    }`}
                  >
                    {advance.nameEn}
                  </span>
                )}
              </div>

              {advance.quote && (
                <p
                  className={`mt-2 text-lg sm:text-xl font-flavor italic border-l-4 pl-3.5 leading-relaxed ${
                    isGoingDark ? 'text-[#e2e8f0] border-[#38bdf8]' : 'text-[#f5efe3] border-[#780016]'
                  }`}
                >
                  {advance.quote}
                </p>
              )}

              {/* Requirement & Refresh Quick Badges in Header */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span
                  className={`px-2.5 py-1 font-medium flex items-center gap-1.5 ${
                    isGoingDark
                      ? 'bg-[#0b1733] text-[#7dd3fc] border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'rounded-md bg-[#261f12] text-[#f0cb78] border border-[#54431e]'
                  }`}
                >
                  <CheckCircle2
                    size={13}
                    className={`shrink-0 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'}`}
                  />
                  <span
                    className={`uppercase tracking-wider text-[11px] ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#e5b83b]'
                    }`}
                  >
                    Требование:
                  </span>
                  <span className={isGoingDark ? 'text-[#e2e8f0]' : 'text-[#ddd7cb]'}>
                    {advance.requirement}
                  </span>
                </span>
                {advance.refresh && (
                  <span
                    className={`px-2.5 py-1 font-medium flex items-center gap-1.5 ${
                      isGoingDark
                        ? 'bg-[#1a0a16] text-[#fda4af] border-2 border-black shadow-[2px_2px_0px_#000000]'
                        : 'rounded-md bg-[#2d1217] text-[#f2aab8] border border-[#780016]'
                    }`}
                  >
                    <Heart
                      size={13}
                      className={`shrink-0 ${isGoingDark ? 'text-[#f43f5e]' : 'text-[#e64c65]'}`}
                    />
                    <span
                      className={`uppercase tracking-wider text-[11px] ${
                        isGoingDark ? 'font-mono text-[#fda4af]' : 'font-heading text-[#f2aab8]'
                      }`}
                    >
                      Отдушина:
                    </span>
                    <span className={isGoingDark ? 'text-[#e2e8f0]' : 'text-[#ddd7cb]'}>
                      {advance.refresh}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Bar inside desktop modal */}
          <div
            className={`mt-6 pt-4 border-t flex gap-2 ${
              isGoingDark ? 'border-black/80' : 'border-[#312517]'
            }`}
          >
            {tabItems.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isGoingDark
                      ? isSelected
                        ? tab.id === 'abilities'
                          ? 'font-mono bg-[#b91c1c] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
                          : 'font-mono bg-[#38bdf8] text-[#03050b] border-2 border-black shadow-[3px_3px_0px_#000000]'
                        : 'font-mono text-[#94a3b8] bg-[#040812] border border-[#1e315c] hover:text-white hover:border-[#38bdf8]'
                      : isSelected
                        ? tab.id === 'abilities'
                          ? 'rounded-lg font-heading bg-[#780016] text-white shadow border border-[#c59b27]'
                          : 'rounded-lg font-heading bg-[#c59b27] text-black shadow'
                        : 'rounded-lg font-heading text-[#959085] hover:text-[#e0dacf] hover:bg-[#1f2230]'
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
                <div
                  className={`sm:hidden pb-4 border-b flex items-start gap-3.5 ${
                    isGoingDark ? 'border-black' : 'border-[#252838]'
                  }`}
                >
                  {advance.image && (
                    <div
                      className={`w-20 h-28 overflow-hidden flex-shrink-0 ${
                        isGoingDark
                          ? 'border-2 border-black shadow-[3px_3px_0px_#000000] bg-[#03050b]'
                          : 'rounded-xl border-2 border-[#c59b27] shadow-xl bg-black'
                      }`}
                    >
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
                    <p
                      className={`flex-1 text-sm font-flavor italic border-l-2 pl-2.5 leading-snug ${
                        isGoingDark ? 'text-[#e2e8f0] border-[#38bdf8]' : 'text-[#f5efe3] border-[#780016]'
                      }`}
                    >
                      {advance.quote}
                    </p>
                  )}
                </div>
              )}

              {/* Mandatory Requirement Box */}
              <div
                className={`p-4 sm:p-5 space-y-2 ${
                  isGoingDark
                    ? 'bg-[#0b152c] border-2 border-black shadow-[4px_4px_0px_#000000]'
                    : 'bg-[#151722] rounded-2xl border border-[#2b3347]'
                }`}
              >
                <h4
                  className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#e5b83b]'
                  }`}
                >
                  <CheckCircle2 size={16} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
                  Требование для вступления
                </h4>
                <p
                  className={`text-sm sm:text-base font-medium leading-relaxed ${
                    isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e5e0d3]'
                  }`}
                >
                  {advance.requirement}
                </p>
              </div>

              {/* Mandatory Refresh Box */}
              {advance.refresh && (
                <div
                  className={`p-4 sm:p-5 flex items-start gap-3.5 ${
                    isGoingDark
                      ? 'bg-[#1a0a16] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#1e1317] rounded-2xl border border-[#521c27]'
                  }`}
                >
                  <Heart
                    className={`mt-1 flex-shrink-0 ${isGoingDark ? 'text-[#f43f5e]' : 'text-[#e64c65]'}`}
                    size={20}
                  />
                  <div className="space-y-1">
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isGoingDark ? 'font-mono text-[#fda4af]' : 'font-heading text-[#e64c65]'
                      }`}
                    >
                      Отдушина (Refresh)
                    </h4>
                    <p
                      className={`text-sm sm:text-base font-medium leading-relaxed ${
                        isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e0dacf]'
                      }`}
                    >
                      {advance.refresh}
                    </p>
                  </div>
                </div>
              )}

              {/* Organization & Lore Description */}
              {advance.description && (
                <div
                  className={`p-4 sm:p-5 space-y-3 ${
                    isGoingDark
                      ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#151722] rounded-2xl border border-[#262c3e]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                    }`}
                  >
                    <BookOpen size={16} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
                    О фракции и продвижении
                  </h4>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
                    }`}
                  >
                    {advance.description}
                  </p>
                </div>
              )}

              {/* Quick Action to Abilities Tree */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => handleTabSelect('abilities')}
                  className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                    isGoingDark
                      ? 'font-mono bg-[#0b152c] hover:bg-[#b91c1c] text-[#7dd3fc] hover:text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
                      : 'rounded-xl font-heading bg-[#251017] hover:bg-[#780016] text-[#f0cb78] hover:text-white border border-[#780016] shadow-md'
                  }`}
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
              <div
                className={`flex flex-wrap items-center gap-2 pb-3 border-b ${
                  isGoingDark ? 'border-black' : 'border-[#262a3a]'
                }`}
              >
                {/* Tier Filter Tabs */}
                <div
                  className={`flex flex-wrap gap-1 p-1 border ${
                    isGoingDark
                      ? 'bg-[#03050b] border-2 border-black shadow-[3px_3px_0px_#000000]'
                      : 'bg-[#0b0c10] rounded-xl border-[#262a3a]'
                  }`}
                >
                  {tierFilterOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveTier(opt.id)}
                      className={`px-3 py-1.5 text-xs transition-colors font-medium ${
                        isGoingDark
                          ? activeTier === opt.id
                            ? 'font-mono font-bold bg-[#b91c1c] text-white border border-black'
                            : 'font-mono text-[#94a3b8] hover:text-white hover:bg-[#0d1730]'
                          : activeTier === opt.id
                            ? 'rounded-lg bg-[#780016] text-white shadow border border-[#c59b27]'
                            : 'rounded-lg text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of abilities matching ClassModal */}
              {filteredAbilities.length === 0 ? (
                <p className={`text-sm text-center py-8 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#78736a]'}`}>
                  В этой категории способностей не найдено.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAbilities.map(ab => (
                    <div
                      key={ab.id}
                      className={`p-4 sm:p-5 transition-colors flex flex-col justify-between space-y-3 ${
                        isGoingDark
                          ? 'bg-[#0b1326] border-2 border-black hover:border-[#38bdf8] shadow-[4px_4px_0px_#000000]'
                          : 'rounded-2xl bg-[#161824] border border-[#262c3e] hover:border-[#5e4713]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4
                            className={`font-heading font-bold text-sm sm:text-base ${
                              isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
                            }`}
                          >
                            {ab.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {ab.tag && <TagBadge tagName={ab.tag} />}
                            <span
                              className={`text-[10px] px-2 py-0.5 font-mono uppercase font-bold ${
                                isGoingDark
                                  ? ab.tier === 'low'
                                    ? 'bg-[#0c4a6e] text-[#e0f2fe] border-2 border-black'
                                    : ab.tier === 'medium'
                                    ? 'bg-[#1e315c] text-[#7dd3fc] border-2 border-black'
                                    : ab.tier === 'high'
                                    ? 'bg-[#4c1d95] text-[#ede9fe] border-2 border-black'
                                    : 'bg-[#b91c1c] text-white border-2 border-black'
                                  : ab.tier === 'low'
                                    ? 'rounded bg-[#1b2738] text-[#9fc2f5] border border-[#23456b]'
                                    : ab.tier === 'medium'
                                    ? 'rounded bg-[#2b2413] text-[#f0cb78] border border-[#6b5523]'
                                    : ab.tier === 'high'
                                    ? 'rounded bg-[#30163b] text-[#d69ff5] border border-[#6b2582]'
                                    : 'rounded bg-[#3b121e] text-[#f08ea4] border border-[#781829]'
                              }`}
                            >
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
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ddd7cb]'
                          }`}
                        >
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
        <div
          className={`flex-shrink-0 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex justify-end border-t ${
            isGoingDark ? 'bg-[#050914] border-t-2 border-black' : 'bg-[#0d0e14] border-[#262a3a]'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-5 sm:px-6 py-2 text-xs font-semibold tracking-wider uppercase transition-colors ${
              isGoingDark
                ? 'font-mono bg-[#0b152c] hover:bg-[#b91c1c] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
                : 'rounded-xl font-heading bg-[#252938] hover:bg-[#780016] text-[#e0dacf]'
            }`}
          >
            Закрыть продвижение
          </button>
        </div>
      </div>
    </div>
  );
};
