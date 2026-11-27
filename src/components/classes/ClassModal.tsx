import React, { useState, useEffect } from 'react';
import { X, Shield, Sparkles, BookOpen, Heart, Award, Users, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { CharacterClass, AbilityTier } from '../../types/game';
import { TagBadge } from '../common/TagBadge';
import { useTheme } from '../../theme/ThemeContext';

interface ClassModalProps {
  characterClass: CharacterClass;
  onClose: () => void;
}

export const ClassModal: React.FC<ClassModalProps> = ({ characterClass, onClose }) => {
  const { isGoingDark } = useTheme();
  const [activeTier, setActiveTier] = useState<AbilityTier | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'abilities'>('overview');
  const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({
    0: 0,
    1: 0
  });
  const bodyScrollRef = React.useRef<HTMLDivElement>(null);

  // Lock background body scroll while modal is open to eliminate background repaint lag
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

  const handleTabSelect = (tab: 'overview' | 'traits' | 'abilities') => {
    setActiveTab(tab);
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTop = 0;
    }
  };

  const abilities = characterClass.abilities || [];
  const filteredAbilities = abilities.filter(ab => {
    return activeTier === 'all' || ab.tier === activeTier;
  });

  const tierLabels: Record<AbilityTier | 'all', string> = {
    all: 'Все способности',
    core: 'Ключевые',
    low: 'Малые',
    medium: 'Средние',
    high: 'Высокого уровня'
  };

  const tabItems: Array<{ id: 'overview' | 'traits' | 'abilities'; mobileLabel: string; desktopLabel: string }> = [
    { id: 'overview', mobileLabel: '1. Обзор', desktopLabel: '1. Обзор и Лор класса' },
    { id: 'traits', mobileLabel: '2. Черты и лут', desktopLabel: '2. Черты, Связи и Снаряжение' },
    { id: 'abilities', mobileLabel: `3. Способности (${abilities.length})`, desktopLabel: `3. Древо Способностей (${abilities.length})` },
  ];

  const renderStatPills = (compact = false) => (
    <div className={`flex flex-wrap gap-1.5 sm:gap-2 text-xs ${compact ? 'mt-3' : 'mt-4'}`}>
      {characterClass.resistances?.map((res, i) => (
        <span
          key={i}
          className={`px-2.5 py-1 font-medium flex items-center gap-1 ${
            isGoingDark
              ? 'bg-[#1a0a16] text-[#fda4af] border-2 border-black shadow-[2px_2px_0px_#000000] font-mono text-[11px]'
              : 'rounded-md bg-[#2d1217] text-[#f2aab8] border border-[#780016]'
          }`}
        >
          <Shield size={12} /> {res}
        </span>
      ))}
      {characterClass.skills?.map((sk, i) => (
        <span
          key={i}
          className={`px-2.5 py-1 font-medium ${
            isGoingDark
              ? 'bg-[#0b1733] text-[#7dd3fc] border-2 border-black shadow-[2px_2px_0px_#000000] font-mono text-[11px]'
              : 'rounded-md bg-[#192233] text-[#9fc2f5] border border-[#2b3c5c]'
          }`}
        >
          Навык: {sk}
        </span>
      ))}
      {characterClass.domains?.map((dom, i) => (
        <span
          key={i}
          className={`px-2.5 py-1 font-medium ${
            isGoingDark
              ? 'bg-[#0f223d] text-[#e0f2fe] border-2 border-black shadow-[2px_2px_0px_#000000] font-mono text-[11px]'
              : 'rounded-md bg-[#261f12] text-[#f0cb78] border border-[#54431e]'
          }`}
        >
          Сфера: {dom}
        </span>
      ))}
    </div>
  );

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
        {/* Mobile Sticky Compact Header (keeps <105px height so ~80% of 6.7" screen scrolls cleanly) */}
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
                {characterClass.nameRu}
              </h2>
              <span
                className={`text-[10px] tracking-widest uppercase block truncate ${
                  isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                }`}
              >
                {characterClass.nameEn}
              </span>
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
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-semibold transition-colors ${
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
            {characterClass.image && (
              <div
                className={`w-24 h-32 sm:w-32 sm:h-44 overflow-hidden flex-shrink-0 ${
                  isGoingDark
                    ? 'border-2 border-black shadow-[5px_5px_0px_#000000] bg-[#03050b]'
                    : 'rounded-xl border-2 border-[#c59b27] shadow-2xl bg-black'
                }`}
              >
                <img
                  src={characterClass.image}
                  alt={characterClass.nameRu}
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
                  <span className="spire-archive-stamp">ДОСЬЕ КЛАССА</span>
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
                  {characterClass.nameRu}
                </h2>
                <span
                  className={`text-sm tracking-widest uppercase ${
                    isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
                  }`}
                >
                  {characterClass.nameEn}
                </span>
              </div>

              {/* Exact Starter Quote */}
              {characterClass.quote && (
                <p
                  className={`mt-2 text-lg sm:text-xl font-flavor italic border-l-4 pl-3.5 leading-relaxed ${
                    isGoingDark ? 'text-[#e2e8f0] border-[#38bdf8]' : 'text-[#f5efe3] border-[#780016]'
                  }`}
                >
                  {characterClass.quote}
                </p>
              )}

              {/* Who Is line */}
              {characterClass.whoIs && (
                <div
                  className={`mt-2 text-sm sm:text-base font-heading font-semibold flex items-center gap-2 ${
                    isGoingDark ? 'text-[#7dd3fc]' : 'text-[#c59b27]'
                  }`}
                >
                  <Sparkles
                    size={15}
                    className={`flex-shrink-0 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#e5b83b]'}`}
                  />
                  <span>{characterClass.whoIs}</span>
                </div>
              )}

              {/* Resistance and Domain Pills */}
              {renderStatPills()}
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

        {/* Modal Body with Hardware-Accelerated Smooth Scroll */}
        <div ref={bodyScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-5 sm:space-y-6">
          {/* TAB 1: OVERVIEW & LORE (EXACT PDF BREAKDOWN) */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Mobile-only Scrollable Class Dossier Header */}
              <div
                className={`sm:hidden pb-5 border-b space-y-3 ${
                  isGoingDark ? 'border-black' : 'border-[#252838]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {characterClass.image && (
                    <div
                      className={`w-20 h-28 overflow-hidden flex-shrink-0 ${
                        isGoingDark
                          ? 'border-2 border-black shadow-[3px_3px_0px_#000000] bg-[#03050b]'
                          : 'rounded-xl border-2 border-[#c59b27] shadow-xl bg-black'
                      }`}
                    >
                      <img
                        src={characterClass.image}
                        alt={characterClass.nameRu}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    {characterClass.quote && (
                      <p
                        className={`text-sm font-flavor italic border-l-2 pl-2.5 leading-snug ${
                          isGoingDark ? 'text-[#e2e8f0] border-[#38bdf8]' : 'text-[#f5efe3] border-[#780016]'
                        }`}
                      >
                        {characterClass.quote}
                      </p>
                    )}
                    {characterClass.whoIs && (
                      <div
                        className={`text-xs font-heading font-semibold flex items-start gap-1.5 leading-snug ${
                          isGoingDark ? 'text-[#7dd3fc]' : 'text-[#c59b27]'
                        }`}
                      >
                        <Sparkles
                          size={13}
                          className={`flex-shrink-0 mt-0.5 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#e5b83b]'}`}
                        />
                        <span>{characterClass.whoIs}</span>
                      </div>
                    )}
                  </div>
                </div>
                {renderStatPills(true)}
              </div>
              {/* In a nutshell */}
              {characterClass.inANutshell && (
                <div
                  className={`p-5 space-y-2 ${
                    isGoingDark
                      ? 'bg-[#0b152c] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#171a26] rounded-2xl border border-[#2b3347]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                    }`}
                  >
                    <BookOpen size={15} /> В двух словах
                  </h4>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e5e0d3]'
                    }`}
                  >
                    {characterClass.inANutshell}
                  </p>
                </div>
              )}

              {/* Core Mechanics Breakdown from PDF */}
              {characterClass.keyMechanics && characterClass.keyMechanics.length > 0 && (
                <div
                  className={`p-5 space-y-3 ${
                    isGoingDark
                      ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#151722] rounded-2xl border border-[#262c3e]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#e5b83b]'
                    }`}
                  >
                    <Zap size={15} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} /> Ключевая механика класса
                  </h4>
                  <ul className="space-y-2.5">
                    {characterClass.keyMechanics.map((km, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2.5 text-xs leading-relaxed ${
                          isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${
                            isGoingDark ? 'bg-[#38bdf8]' : 'rounded-full bg-[#c59b27]'
                          }`}
                        />
                        <span>{km}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What will you do */}
              {characterClass.whatWillYouDo && characterClass.whatWillYouDo.length > 0 && (
                <div
                  className={`p-5 space-y-3 ${
                    isGoingDark
                      ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#151722] rounded-2xl border border-[#262c3e]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#e5b83b]'
                    }`}
                  >
                    <CheckCircle2 size={15} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#86efac]'} /> Что вы будете делать в игре?
                  </h4>
                  <ul className="space-y-2">
                    {characterClass.whatWillYouDo.map((wd, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2 text-xs leading-relaxed ${
                          isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
                        }`}
                      >
                        <ChevronRight
                          size={14}
                          className={`mt-0.5 flex-shrink-0 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#86efac]'}`}
                        />
                        <span>{wd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary / Conclusion */}
              {characterClass.summary && (
                <div
                  className={`p-5 space-y-2 ${
                    isGoingDark
                      ? 'bg-[#1a0a16] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#1c1218] rounded-2xl border border-[#521c27]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#fda4af]' : 'font-heading text-[#f2aab8]'
                    }`}
                  >
                    <Award size={15} /> Итог: Кому подходит этот класс
                  </h4>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e0dacf]'
                    }`}
                  >
                    {characterClass.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRAITS, BONDS & EQUIPMENT */}
          {activeTab === 'traits' && (
            <div className="space-y-6">
              {/* Refresh Box */}
              {characterClass.refresh && (
                <div
                  className={`p-5 flex items-start gap-3 ${
                    isGoingDark
                      ? 'bg-[#1a0a16] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#1e1317] rounded-2xl border border-[#521c27]'
                  }`}
                >
                  <Heart
                    className={`mt-1 flex-shrink-0 ${isGoingDark ? 'text-[#f43f5e]' : 'text-[#e64c65]'}`}
                    size={20}
                  />
                  <div>
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isGoingDark ? 'font-mono text-[#fda4af]' : 'font-heading text-[#e64c65]'
                      }`}
                    >
                      Отдушина (Refresh)
                    </h4>
                    <p
                      className={`text-sm mt-1 font-medium leading-relaxed ${
                        isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e0dacf]'
                      }`}
                    >
                      {characterClass.refresh}
                    </p>
                  </div>
                </div>
              )}

              {/* Bonds (Связи) */}
              {characterClass.bonds && characterClass.bonds.length > 0 && (
                <div
                  className={`p-5 space-y-3 ${
                    isGoingDark
                      ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#151722] rounded-2xl border border-[#282e42]'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                    }`}
                  >
                    <Users size={16} /> Связи персонажа (Bonds)
                  </h4>
                  <p className={`text-xs ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#878072]'}`}>
                    При создании персонажа ответьте на эти сюжетные вопросы, чтобы вплести героя в мир Шпиля и команду:
                  </p>
                  <ul className="space-y-2.5">
                    {characterClass.bonds.map((bond, i) => (
                      <li
                        key={i}
                        className={`p-3.5 text-xs sm:text-sm leading-relaxed ${
                          isGoingDark
                            ? 'bg-[#040812] border-2 border-black text-[#dbeafe]'
                            : 'rounded-xl bg-[#0e1017] border border-[#222738] text-[#ddd7cb]'
                        }`}
                      >
                        {bond}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Starting Equipment */}
              {characterClass.equipment ? (
                <div
                  className={`p-5 space-y-5 ${
                    isGoingDark
                      ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                      : 'bg-[#151722] rounded-2xl border border-[#282e42]'
                  }`}
                >
                  <div
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b ${
                      isGoingDark ? 'border-black' : 'border-[#232738]'
                    }`}
                  >
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                        isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                      }`}
                    >
                      <BookOpen size={16} /> Стартовая Экипировка (Equipment)
                    </h4>
                    <span className={`text-[11px] ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
                      Выберите подходящий стартовый комплект
                    </span>
                  </div>

                  {/* Guaranteed Base Items */}
                  {characterClass.equipment.fixed && characterClass.equipment.fixed.length > 0 && (
                    <div className="space-y-2">
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                          isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#86efac]'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>Гарантированная базовая экипировка</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {characterClass.equipment.fixed.map((item, i) => (
                          <li
                            key={i}
                            className={`p-3 text-xs sm:text-sm flex items-center gap-2 ${
                              isGoingDark
                                ? 'bg-[#040812] border-2 border-black text-[#e2e8f0]'
                                : 'rounded-xl bg-[#0e1017] border border-[#1e2f24] text-[#e0dacf]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 flex-shrink-0 ${
                                isGoingDark ? 'bg-[#38bdf8]' : 'rounded-full bg-[#86efac]'
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mutually Exclusive Choice Groups */}
                  {characterClass.equipment.choiceGroups && characterClass.equipment.choiceGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-3 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 ${
                              isGoingDark ? 'bg-[#38bdf8]' : 'rounded-full bg-[#e5b83b]'
                            }`}
                          />
                          <h5
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isGoingDark ? 'font-mono text-[#e0f2fe]' : 'font-heading text-[#e5b83b]'
                            }`}
                          >
                            {group.name}
                          </h5>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isGoingDark
                              ? 'font-mono bg-[#b91c1c] text-white border-2 border-black'
                              : 'rounded font-heading bg-[#3b1c12] text-[#f2a878] border border-[#6b331f]'
                          }`}
                        >
                          Взаимоисключающий выбор (1 из {group.options.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {group.options.map((opt, optIdx) => {
                          const isSelected = (selectedEquipmentChoices[groupIdx] ?? 0) === optIdx;
                          return (
                            <div
                              key={optIdx}
                              onClick={() => setSelectedEquipmentChoices(prev => ({ ...prev, [groupIdx]: optIdx }))}
                              className={`p-4 border transition-colors cursor-pointer flex flex-col justify-between space-y-3 ${
                                isGoingDark
                                  ? isSelected
                                    ? 'bg-[#0d1c3d] border-2 border-[#38bdf8] shadow-[4px_4px_0px_#000000]'
                                    : 'bg-[#040812] border-2 border-black hover:border-[#38bdf8]/70 opacity-85 hover:opacity-100'
                                  : isSelected
                                    ? 'rounded-xl bg-[#221a14] border-[#c59b27] shadow-lg shadow-[#c59b27]/15 ring-1 ring-[#c59b27]'
                                    : 'rounded-xl bg-[#0e1017] border-[#252a3b] hover:border-[#5e4713] opacity-80 hover:opacity-100'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`font-bold text-xs ${
                                      isGoingDark
                                        ? isSelected
                                          ? 'font-mono text-[#7dd3fc]'
                                          : 'font-mono text-[#cbd5e1]'
                                        : isSelected
                                          ? 'font-heading text-[#f0cb78]'
                                          : 'font-heading text-[#c5beb3]'
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                      isGoingDark
                                        ? isSelected
                                          ? 'border-black bg-[#38bdf8] text-black'
                                          : 'border-[#334155]'
                                        : isSelected
                                          ? 'border-[#c59b27] bg-[#c59b27] text-black'
                                          : 'border-[#4a526b]'
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                                  </div>
                                </div>

                                <ul className="space-y-1.5">
                                  {opt.items.map((it, itemIdx) => (
                                    <li
                                      key={itemIdx}
                                      className={`text-xs sm:text-sm leading-relaxed flex items-start gap-1.5 ${
                                        isGoingDark ? 'text-[#e2e8f0]' : 'text-[#ddd7cb]'
                                      }`}
                                    >
                                      <span className={isGoingDark ? 'text-[#38bdf8] mt-0.5' : 'text-[#c59b27] mt-0.5'}>
                                        ›
                                      </span>
                                      <span>{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {opt.note && (
                                <p
                                  className={`text-[11px] italic pt-2 border-t leading-tight ${
                                    isGoingDark
                                      ? 'text-[#94a3b8] border-black/80'
                                      : 'text-[#959085] border-[#29221b]'
                                  }`}
                                >
                                  {opt.note}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                characterClass.startingEquipment && characterClass.startingEquipment.length > 0 && (
                  <div
                    className={`p-5 space-y-3 ${
                      isGoingDark
                        ? 'bg-[#0a1224] border-2 border-black shadow-[4px_4px_0px_#000000]'
                        : 'bg-[#151722] rounded-2xl border border-[#282e42]'
                    }`}
                  >
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                        isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#c59b27]'
                      }`}
                    >
                      <BookOpen size={16} /> Стартовая Экипировка (Equipment)
                    </h4>
                    <ul className="space-y-2">
                      {characterClass.startingEquipment.map((eq, i) => (
                        <li
                          key={i}
                          className={`p-3.5 text-xs sm:text-sm leading-relaxed ${
                            isGoingDark
                              ? 'bg-[#040812] border-2 border-black text-[#e2e8f0]'
                              : 'rounded-xl bg-[#0e1017] border border-[#222738] text-[#ddd7cb]'
                          }`}
                        >
                          {eq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 3: ABILITIES (TIER-BASED ADVANCES) */}
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
                  {(['all', 'core', 'low', 'medium', 'high'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setActiveTier(tier)}
                      className={`px-3 py-1.5 text-xs transition-colors font-medium ${
                        isGoingDark
                          ? activeTier === tier
                            ? 'font-mono font-bold bg-[#b91c1c] text-white border border-black'
                            : 'font-mono text-[#94a3b8] hover:text-white hover:bg-[#0d1730]'
                          : activeTier === tier
                            ? 'rounded-lg bg-[#780016] text-white shadow'
                            : 'rounded-lg text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                      }`}
                    >
                      {tierLabels[tier]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of abilities */}
              {filteredAbilities.length === 0 ? (
                <p className={`text-sm text-center py-8 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#78736a]'}`}>
                  В этой категории способностей не найдено.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAbilities.map(ab => (
                    <div
                      key={ab.id}
                      className={`p-5 transition-colors flex flex-col justify-between space-y-2 ${
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
                                  ? ab.tier === 'core'
                                    ? 'bg-[#b91c1c] text-white border-2 border-black'
                                    : ab.tier === 'low'
                                    ? 'bg-[#0c4a6e] text-[#e0f2fe] border-2 border-black'
                                    : ab.tier === 'medium'
                                    ? 'bg-[#1e315c] text-[#7dd3fc] border-2 border-black'
                                    : 'bg-[#4c1d95] text-[#ede9fe] border-2 border-black'
                                  : ab.tier === 'core'
                                    ? 'rounded bg-[#3b121e] text-[#f08ea4] border border-[#781829]'
                                    : ab.tier === 'low'
                                    ? 'rounded bg-[#1b2738] text-[#9fc2f5] border border-[#23456b]'
                                    : ab.tier === 'medium'
                                    ? 'rounded bg-[#2b2413] text-[#f0cb78] border border-[#6b5523]'
                                    : 'rounded bg-[#30163b] text-[#d69ff5] border border-[#6b2582]'
                              }`}
                            >
                              {ab.tier === 'core' ? 'Ключевое' :
                               ab.tier === 'low' ? 'Малое' :
                               ab.tier === 'medium' ? 'Среднее' :
                               'Высокого уровня'}
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

        {/* Footer */}
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
            Закрыть справочник класса
          </button>
        </div>
      </div>
    </div>
  );
};
