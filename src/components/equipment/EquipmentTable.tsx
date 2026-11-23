import React, { useState } from 'react';
import { Shield, Crosshair, Search, Tag as TagIcon, Sparkles } from 'lucide-react';
import { Equipment } from '../../types/game';
import { TagBadge } from '../common/TagBadge';
import equipmentData from '../../data/equipment.json';
import tagsData from '../../data/tags.json';

export const EquipmentTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'weapon' | 'armor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearch, setTagSearch] = useState('');

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
      <div className="bg-gradient-to-r from-[#21160e] via-[#161622] to-[#0d0e14] border border-[#523514] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Crosshair className="text-[#c59b27]" size={28} />
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
            Снаряжение, Оружие и Теги
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#ccc5b8] max-w-3xl leading-relaxed">
          В Шпиле всё оружие наносит стресс (1, d3, d6 или d8), а броня дает дополнительные ячейки сопротивления по Крови. Каждое свойство оружия или брони наделяет его механическим преимуществом или опасным ограничением. Нажмите на любой тег в скобках, чтобы увидеть его точное действие.
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex bg-[#0c0d12] p-1 rounded-xl border border-[#2e3346] flex-shrink-0">
            {(['all', 'weapon', 'armor'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-heading font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#780016] text-white shadow'
                    : 'text-[#959085] hover:text-[#e0dacf]'
                }`}
              >
                {tab === 'all' ? 'Всё' : tab === 'weapon' ? 'Оружие' : 'Броня'}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#878072]" />
            <input
              type="text"
              placeholder="Поиск по названию предмета или тегу (например: Жестокое, Скрытое)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0c0d12] border border-[#2e3346] rounded-xl text-sm text-[#e0dacf] placeholder-[#736e65] focus:outline-none focus:border-[#c59b27] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#13151c] border border-[#262a3b] hover:border-[#5e4713] transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-heading font-bold text-base text-[#e5b83b]">
                  {item.nameRu}
                </h3>
                {item.category === 'weapon' ? (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#33141b] text-[#f299a9] border border-[#6b2230]">
                    {item.damage} стресс
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#14263b] text-[#9fcbf5] border border-[#234870]">
                    +{item.armorValue} Броня
                  </span>
                )}
              </div>

              {item.range && (
                <div className="text-xs text-[#878072] mb-2">
                  Дистанция: <span className="text-[#ccc5b8]">{item.range}</span>
                </div>
              )}

              <p className="text-xs text-[#c5beb3] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="pt-3 border-t border-[#222634] flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-[#878072] mr-1">Свойства:</span>
                {item.tags.map(t => (
                  <TagBadge key={t} tagName={t} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Tags Reference Section */}
      <div className="bg-[#12141c] border border-[#3d2b0e] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#262a3b]">
          <div>
            <h3 className="text-xl font-heading font-bold text-[#e5b83b] flex items-center gap-2">
              <TagIcon className="text-[#c59b27]" size={22} />
              Полный Справочник Свойств и Тегов
            </h3>
            <p className="text-xs text-[#959085] mt-1">
              Актуальные механические свойства оружия и брони согласно официальному глоссарию.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878072]" />
            <input
              type="text"
              placeholder="Фильтр свойств..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b0c10] border border-[#2e3346] rounded-lg text-xs text-[#e0dacf] focus:outline-none focus:border-[#c59b27]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-[#161822] border border-[#262c3d] hover:border-[#5e4713] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-heading font-bold text-sm text-[#e5b83b]">
                  {t.nameRu}
                </span>
                <span className="text-[10px] text-[#878072] font-mono uppercase bg-[#0d0e14] px-1.5 py-0.5 rounded">
                  {t.nameEn}
                </span>
              </div>
              <p className="text-xs text-[#c5beb3] leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
