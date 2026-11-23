import React, { useState, useEffect } from 'react';
import { X, Shield, Sparkles, BookOpen, Heart, Award, Users, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { CharacterClass, AbilityTier } from '../../types/game';
import { TagBadge } from '../common/TagBadge';

interface ClassModalProps {
  characterClass: CharacterClass;
  onClose: () => void;
}

export const ClassModal: React.FC<ClassModalProps> = ({ characterClass, onClose }) => {
  const [activeTier, setActiveTier] = useState<AbilityTier | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'abilities'>('overview');
  const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({
    0: 0,
    1: 0
  });

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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/92 animate-in fade-in duration-150"
    >
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#11131a] border border-[#5e4713] rounded-2xl shadow-2xl overflow-hidden text-[#e2dcd2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#290710] via-[#1a121e] to-[#11131a] border-b border-[#3d2b0e]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-[#780016] text-[#e0dacf] transition-colors border border-[#3d2b0e]"
            title="Закрыть"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {characterClass.image && (
              <div className="w-24 h-32 sm:w-32 sm:h-44 rounded-xl overflow-hidden border-2 border-[#c59b27] shadow-2xl flex-shrink-0 bg-black">
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
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl font-heading font-bold text-[#e5b83b]">
                  {characterClass.nameRu}
                </h2>
                <span className="text-sm font-heading tracking-widest text-[#959085] uppercase">
                  {characterClass.nameEn}
                </span>
              </div>

              {/* Exact Starter Quote */}
              {characterClass.quote && (
                <p className="mt-2 text-lg sm:text-xl text-[#f5efe3] font-flavor italic border-l-4 border-[#780016] pl-3.5 leading-relaxed">
                  {characterClass.quote}
                </p>
              )}

              {/* Who Is line */}
              {characterClass.whoIs && (
                <div className="mt-2 text-sm sm:text-base font-heading font-semibold text-[#c59b27] flex items-center gap-2">
                  <Sparkles size={15} className="text-[#e5b83b] flex-shrink-0" />
                  <span>{characterClass.whoIs}</span>
                </div>
              )}

              {/* Resistance and Domain Pills */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {characterClass.resistances?.map((res, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#2d1217] text-[#f2aab8] border border-[#780016] font-medium flex items-center gap-1">
                    <Shield size={12} /> {res}
                  </span>
                ))}
                {characterClass.skills?.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#192233] text-[#9fc2f5] border border-[#2b3c5c] font-medium">
                    Навык: {sk}
                  </span>
                ))}
                {characterClass.domains?.map((dom, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#261f12] text-[#f0cb78] border border-[#54431e] font-medium">
                    Сфера: {dom}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Bar inside modal */}
          <div className="mt-6 pt-4 border-t border-[#312517] flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#c59b27] text-black shadow'
                  : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1f2230]'
              }`}
            >
              1. Обзор и Лор класса
            </button>
            <button
              onClick={() => setActiveTab('traits')}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                activeTab === 'traits'
                  ? 'bg-[#c59b27] text-black shadow'
                  : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1f2230]'
              }`}
            >
              2. Черты, Связи и Снаряжение
            </button>
            <button
              onClick={() => setActiveTab('abilities')}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                activeTab === 'abilities'
                  ? 'bg-[#780016] text-white shadow border border-[#c59b27]'
                  : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1f2230]'
              }`}
            >
              3. Древо Способностей ({abilities.length})
            </button>
          </div>
        </div>

        {/* Modal Body with Hardware-Accelerated Smooth Scroll */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW & LORE (EXACT PDF BREAKDOWN) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* In a nutshell */}
              {characterClass.inANutshell && (
                <div className="bg-[#171a26] p-5 rounded-2xl border border-[#2b3347] space-y-2">
                  <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={15} /> В двух словах
                  </h4>
                  <p className="text-sm sm:text-base text-[#e5e0d3] leading-relaxed">
                    {characterClass.inANutshell}
                  </p>
                </div>
              )}

              {/* Core Mechanics Breakdown from PDF */}
              {characterClass.keyMechanics && characterClass.keyMechanics.length > 0 && (
                <div className="bg-[#151722] p-5 rounded-2xl border border-[#262c3e] space-y-3">
                  <h4 className="text-xs font-heading font-bold text-[#e5b83b] uppercase tracking-wider flex items-center gap-2">
                    <Zap size={15} className="text-[#c59b27]" /> Ключевая механика класса
                  </h4>
                  <ul className="space-y-2.5">
                    {characterClass.keyMechanics.map((km, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#ccc5b8] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] mt-1.5 flex-shrink-0" />
                        <span>{km}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What will you do */}
              {characterClass.whatWillYouDo && characterClass.whatWillYouDo.length > 0 && (
                <div className="bg-[#151722] p-5 rounded-2xl border border-[#262c3e] space-y-3">
                  <h4 className="text-xs font-heading font-bold text-[#e5b83b] uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#86efac]" /> Что вы будете делать в игре?
                  </h4>
                  <ul className="space-y-2">
                    {characterClass.whatWillYouDo.map((wd, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#ccc5b8] leading-relaxed">
                        <ChevronRight size={14} className="text-[#86efac] mt-0.5 flex-shrink-0" />
                        <span>{wd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary / Conclusion */}
              {characterClass.summary && (
                <div className="bg-[#1c1218] p-5 rounded-2xl border border-[#521c27] space-y-2">
                  <h4 className="text-xs font-heading font-bold text-[#f2aab8] uppercase tracking-wider flex items-center gap-2">
                    <Award size={15} /> Итог: Кому подходит этот класс
                  </h4>
                  <p className="text-xs sm:text-sm text-[#e0dacf] leading-relaxed">
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
                <div className="bg-[#1e1317] p-5 rounded-2xl border border-[#521c27] flex items-start gap-3">
                  <Heart className="text-[#e64c65] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-heading font-bold text-[#e64c65] uppercase tracking-wider">
                      Отдушина (Refresh)
                    </h4>
                    <p className="text-sm text-[#e0dacf] mt-1 font-medium leading-relaxed">
                      {characterClass.refresh}
                    </p>
                  </div>
                </div>
              )}

              {/* Bonds (Связи) */}
              {characterClass.bonds && characterClass.bonds.length > 0 && (
                <div className="bg-[#151722] p-5 rounded-2xl border border-[#282e42] space-y-3">
                  <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Связи персонажа (Bonds)
                  </h4>
                  <p className="text-xs text-[#878072]">
                    При создании персонажа ответьте на эти сюжетные вопросы, чтобы вплести героя в мир Шпиля и команду:
                  </p>
                  <ul className="space-y-2.5">
                    {characterClass.bonds.map((bond, i) => (
                      <li key={i} className="p-3.5 rounded-xl bg-[#0e1017] border border-[#222738] text-xs sm:text-sm text-[#ddd7cb] leading-relaxed">
                        {bond}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Starting Equipment */}
              {characterClass.equipment ? (
                <div className="bg-[#151722] p-5 rounded-2xl border border-[#282e42] space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#232738]">
                    <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={16} /> Стартовая Экипировка (Equipment)
                    </h4>
                    <span className="text-[11px] text-[#959085]">
                      Выберите подходящий стартовый комплект
                    </span>
                  </div>

                  {/* Guaranteed Base Items */}
                  {characterClass.equipment.fixed && characterClass.equipment.fixed.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#86efac] uppercase tracking-wider">
                        <CheckCircle2 size={14} />
                        <span>Гарантированная базовая экипировка</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {characterClass.equipment.fixed.map((item, i) => (
                          <li key={i} className="p-3 rounded-xl bg-[#0e1017] border border-[#1e2f24] text-xs sm:text-sm text-[#e0dacf] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] flex-shrink-0" />
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
                          <span className="w-2 h-2 rounded-full bg-[#e5b83b]" />
                          <h5 className="text-xs font-heading font-bold text-[#e5b83b] uppercase tracking-wider">
                            {group.name}
                          </h5>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#3b1c12] text-[#f2a878] border border-[#6b331f] text-[10px] font-heading font-semibold uppercase tracking-wider">
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
                              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                                isSelected
                                  ? 'bg-[#221a14] border-[#c59b27] shadow-lg shadow-[#c59b27]/15 ring-1 ring-[#c59b27]'
                                  : 'bg-[#0e1017] border-[#252a3b] hover:border-[#5e4713] opacity-80 hover:opacity-100'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`font-heading font-bold text-xs ${isSelected ? 'text-[#f0cb78]' : 'text-[#c5beb3]'}`}>
                                    {opt.label}
                                  </span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    isSelected ? 'border-[#c59b27] bg-[#c59b27] text-black' : 'border-[#4a526b]'
                                  }`}>
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                                  </div>
                                </div>

                                <ul className="space-y-1.5">
                                  {opt.items.map((it, itemIdx) => (
                                    <li key={itemIdx} className="text-xs sm:text-sm text-[#ddd7cb] leading-relaxed flex items-start gap-1.5">
                                      <span className="text-[#c59b27] mt-0.5">›</span>
                                      <span>{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {opt.note && (
                                <p className="text-[11px] text-[#959085] italic pt-2 border-t border-[#29221b] leading-tight">
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
                  <div className="bg-[#151722] p-5 rounded-2xl border border-[#282e42] space-y-3">
                    <h4 className="text-xs font-heading font-bold text-[#c59b27] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={16} /> Стартовая Экипировка (Equipment)
                    </h4>
                    <ul className="space-y-2">
                      {characterClass.startingEquipment.map((eq, i) => (
                        <li key={i} className="p-3.5 rounded-xl bg-[#0e1017] border border-[#222738] text-xs sm:text-sm text-[#ddd7cb] leading-relaxed">
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
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#262a3a]">
                {/* Tier Filter Tabs */}
                <div className="flex flex-wrap gap-1 bg-[#0b0c10] p-1 rounded-xl border border-[#262a3a]">
                  {(['all', 'core', 'low', 'medium', 'high'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setActiveTier(tier)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-medium ${
                        activeTier === tier
                          ? 'bg-[#780016] text-white shadow'
                          : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                      }`}
                    >
                      {tierLabels[tier]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of abilities */}
              {filteredAbilities.length === 0 ? (
                <p className="text-sm text-[#78736a] text-center py-8">
                  В этой категории способностей не найдено.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAbilities.map(ab => (
                    <div
                      key={ab.id}
                      className="p-5 rounded-2xl bg-[#161824] border border-[#262c3e] hover:border-[#5e4713] transition-all flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-heading font-bold text-sm sm:text-base text-[#e5b83b]">
                            {ab.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {ab.tag && <TagBadge tagName={ab.tag} />}
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold border ${
                              ab.tier === 'core' ? 'bg-[#3b121e] text-[#f08ea4] border-[#781829]' :
                              ab.tier === 'low' ? 'bg-[#1b2738] text-[#9fc2f5] border-[#23456b]' :
                              ab.tier === 'medium' ? 'bg-[#2b2413] text-[#f0cb78] border-[#6b5523]' :
                              'bg-[#30163b] text-[#d69ff5] border-[#6b2582]'
                            }`}>
                              {ab.tier === 'core' ? 'Ключевое' :
                               ab.tier === 'low' ? 'Малое' :
                               ab.tier === 'medium' ? 'Среднее' :
                               'Высокого уровня'}
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

        {/* Footer */}
        <div className="p-4 bg-[#0d0e14] border-t border-[#262a3a] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#252938] hover:bg-[#780016] text-[#e0dacf] text-xs font-heading font-semibold tracking-wider uppercase transition-colors"
          >
            Закрыть справочник класса
          </button>
        </div>
      </div>
    </div>
  );
};
