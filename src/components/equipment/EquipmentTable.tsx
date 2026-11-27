import React, { useState } from 'react';
import { Shield, Crosshair, Search, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Equipment } from '../../types/game';
import { TagBadge } from '../common/TagBadge';
import equipmentData from '../../data/equipment.json';
import tagsData from '../../data/tags.json';
import { useRouter } from '../../router/RouterContext';
import { useTheme } from '../../theme/ThemeContext';

export const EquipmentTable: React.FC = () => {
  const { route, navigate } = useRouter();
  const { isGoingDark } = useTheme();
  const activeTab = (route.equipmentCategory as 'all' | 'weapon' | 'armor') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const handleTabChange = (tab: 'all' | 'weapon' | 'armor') => {
    navigate({
      tab: 'equipment',
      equipmentCategory: tab === 'all' ? undefined : tab,
    }, { replace: true });
  };

  const equipment: Equipment[] = equipmentData as Equipment[];

  const filteredEquipment = equipment.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const allTags = [
    ...tagsData.weapons.map(t => ({ ...t, type: 'Оружие' })),
    ...tagsData.armor.map(t => ({ ...t, type: 'Броня' }))
  ];

  const filteredTags = allTags.filter(t => 
    t.nameRu.toLowerCase().includes(tagSearch.toLowerCase()) ||
    t.nameEn.toLowerCase().includes(tagSearch.toLowerCase()) ||
    t.desc.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div
        className={`spire-banner relative overflow-hidden p-6 sm:p-8 ${
          isGoingDark
            ? 'bg-gradient-to-r from-[#0d1730] via-[#091124] to-[#060b17] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-gradient-to-r from-[#21160e] via-[#161622] to-[#0d0e14] border border-[#523514] rounded-2xl shadow-xl'
        }`}
      >
        {isGoingDark && (
          <div className="spire-ink-hatch absolute inset-y-0 right-0 w-1/3 pointer-events-none opacity-45" />
        )}
        <div className="relative z-10">
          {isGoingDark && (
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="spire-archive-stamp">РЕЕСТР СНАРЯЖЕНИЯ</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7dd3fc]">
                АРСЕНАЛ И КОНТРАБАНДА
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} size={28} />
            <h2
              className={`text-2xl sm:text-3xl font-heading font-bold ${
                isGoingDark ? 'text-[#f0f6ff] tracking-wide' : 'text-[#e5b83b]'
              }`}
            >
              Снаряжение, Оружие и Теги
            </h2>
          </div>
          <p
            className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
            }`}
          >
            В Шпиле всё оружие наносит стресс (1, d3, d6 или d8), а броня дает дополнительные ячейки сопротивления по Крови. Каждое свойство оружия или брони наделяет его механическим преимуществом или опасным ограничением. Нажмите на любой тег в скобках, чтобы увидеть его точное действие.
          </p>

          {/* Filter & Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div
              className={`flex p-1 flex-shrink-0 ${
                isGoingDark
                  ? 'bg-[#03050b] border-2 border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-[#0c0d12] rounded-xl border border-[#2e3346]'
              }`}
            >
              {(['all', 'weapon', 'armor'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isGoingDark
                      ? activeTab === tab
                        ? 'font-mono bg-[#b91c1c] text-white border border-black'
                        : 'font-mono text-[#94a3b8] hover:text-white'
                      : activeTab === tab
                        ? 'rounded-lg font-heading bg-[#780016] text-white shadow'
                        : 'rounded-lg font-heading text-[#959085] hover:text-[#e0dacf]'
                  }`}
                >
                  {tab === 'all' ? 'Всё' : tab === 'weapon' ? 'Оружие' : 'Броня'}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search
                size={16}
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isGoingDark ? 'text-[#7dd3fc]' : 'text-[#878072]'
                }`}
              />
              <input
                type="text"
                placeholder="Поиск по названию предмета или тегу (например: Жестокое, Скрытое)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-sm focus:outline-none transition-colors ${
                  isGoingDark
                    ? 'bg-[#03050b] border-2 border-black text-[#e2e8f0] placeholder-[#64748b] focus:border-[#38bdf8] shadow-[3px_3px_0px_#000000]'
                    : 'bg-[#0c0d12] border border-[#2e3346] rounded-xl text-[#e0dacf] placeholder-[#736e65] focus:border-[#c59b27]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className={`spire-card-shell p-5 transition-colors flex flex-col justify-between space-y-3 ${
              isGoingDark
                ? 'bg-[#0b1326] border-2 border-black hover:border-[#38bdf8] shadow-[4px_4px_0px_#000000]'
                : 'rounded-2xl bg-[#13151c] border border-[#262a3b] hover:border-[#5e4713]'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className={`font-heading font-bold text-base ${
                    isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
                  }`}
                >
                  {item.nameRu}
                </h3>
                {item.category === 'weapon' ? (
                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-bold tabular-nums ${
                      isGoingDark
                        ? 'bg-[#1a0a16] text-[#fda4af] border-2 border-black'
                        : 'rounded bg-[#33141b] text-[#f299a9] border border-[#6b2230]'
                    }`}
                  >
                    {item.damage} стресс
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-bold tabular-nums ${
                      isGoingDark
                        ? 'bg-[#0c2647] text-[#7dd3fc] border-2 border-black'
                        : 'rounded bg-[#14263b] text-[#9fcbf5] border border-[#234870]'
                    }`}
                  >
                    +{item.armorValue} Броня
                  </span>
                )}
              </div>

              {item.range && (
                <div className={`text-xs mb-2 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#878072]'}`}>
                  Дистанция:{' '}
                  <span className={isGoingDark ? 'text-[#e2e8f0]' : 'text-[#ccc5b8]'}>
                    {item.range}
                  </span>
                </div>
              )}

              <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div
                className={`pt-3 border-t flex flex-wrap gap-1.5 items-center ${
                  isGoingDark ? 'border-black' : 'border-[#222634]'
                }`}
              >
                <span className={`text-[11px] mr-1 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#878072]'}`}>
                  Свойства:
                </span>
                {item.tags.map(t => (
                  <TagBadge key={t} tagName={t} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Tags Reference Section */}
      <div
        className={`p-6 sm:p-8 space-y-6 ${
          isGoingDark
            ? 'spire-card-shell bg-[#081022] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-[#12141c] border border-[#3d2b0e] rounded-2xl'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b ${
            isGoingDark ? 'border-black' : 'border-[#262a3b]'
          }`}
        >
          <div>
            <h3
              className={`text-xl font-heading font-bold flex items-center gap-2 ${
                isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
              }`}
            >
              <TagIcon className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} size={22} />
              Полный Справочник Свойств и Тегов
            </h3>
            <p className={`text-xs mt-1 ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
              Актуальные механические свойства оружия и брони согласно официальному глоссарию.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isGoingDark ? 'text-[#7dd3fc]' : 'text-[#878072]'
              }`}
            />
            <input
              type="text"
              placeholder="Фильтр свойств..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs focus:outline-none ${
                isGoingDark
                  ? 'bg-[#03050b] border-2 border-black text-[#e2e8f0] focus:border-[#38bdf8]'
                  : 'bg-[#0b0c10] border border-[#2e3346] rounded-lg text-[#e0dacf] focus:border-[#c59b27]'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map(t => (
            <div
              key={t.id}
              className={`p-4 transition-colors ${
                isGoingDark
                  ? 'bg-[#0b152c] border-2 border-black hover:border-[#38bdf8] shadow-[3px_3px_0px_#000000]'
                  : 'rounded-xl bg-[#161822] border border-[#262c3d] hover:border-[#5e4713]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`font-heading font-bold text-sm ${
                    isGoingDark ? 'text-[#7dd3fc]' : 'text-[#e5b83b]'
                  }`}
                >
                  {t.nameRu}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 ${
                    isGoingDark
                      ? 'bg-[#03050b] border border-black text-[#94a3b8]'
                      : 'rounded bg-[#0d0e14] text-[#878072]'
                  }`}
                >
                  {t.nameEn}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#cbd5e1]' : 'text-[#c5beb3]'}`}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
