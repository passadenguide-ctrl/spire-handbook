import React, { useState } from 'react';
import { Search, Award, Sparkles } from 'lucide-react';
import { ExtraAdvance } from '../../types/game';
import { ExtraAdvanceCard } from './ExtraAdvanceCard';
import { ExtraAdvanceModal } from './ExtraAdvanceModal';
import extraData from '../../data/extra_advances.json';
import { useRouter } from '../../router/RouterContext';

export const ExtraAdvancesList: React.FC = () => {
  const { route, openAdvanceModal, closeAdvanceModal } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const advances: ExtraAdvance[] = extraData as ExtraAdvance[];

  const selectedAdvance = route.advanceId ? advances.find(a => a.id === route.advanceId) || null : null;

  const filteredAdvances = advances.filter(a => {
    const query = searchQuery.toLowerCase();
    return a.nameRu.toLowerCase().includes(query) ||
           (a.nameEn && a.nameEn.toLowerCase().includes(query)) ||
           a.requirement.toLowerCase().includes(query) ||
           (a.description && a.description.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#210911] via-[#141620] to-[#0d0e14] border border-[#4a2e12] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-[#c59b27]" size={28} />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
              Дополнительные Продвижения (Extra Advances)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#ccc5b8] max-w-3xl leading-relaxed">
            В отличие от базовых классов, дополнительные продвижения представляют собой тайные культы, городские службы, пакты и военные формирования Шпиля (*Городская Стража, Министры, Призывники*). К ним может примкнуть <strong className="text-[#f0cb78]">персонаж любого класса</strong>, выполнив сюжетное требование для вступления.
          </p>

          {/* Search */}
          <div className="mt-5 max-w-md relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#878072]" />
            <input
              type="text"
              placeholder="Поиск по названию, культу или требованию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0c0d12] border border-[#2e3346] focus:border-[#c59b27] rounded-xl text-sm text-[#e0dacf] placeholder-[#736e65] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-shrink-0 self-start sm:self-center px-4 py-2 rounded-xl bg-black/60 border border-[#3d2b0e] text-xs font-mono text-[#c59b27]">
          Всего продвижений: <strong className="text-white text-sm">{advances.length}</strong>
        </div>
      </div>

      {/* Grid matching ClassesList */}
      {filteredAdvances.length === 0 ? (
        <div className="text-center py-12 bg-[#12141c] rounded-2xl border border-[#262a3b] text-[#878072]">
          По вашему запросу продвижений не найдено.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdvances.map(advance => (
            <ExtraAdvanceCard
              key={advance.id}
              advance={advance}
              onSelect={(adv) => openAdvanceModal(adv.id)}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedAdvance && (
        <ExtraAdvanceModal
          advance={selectedAdvance}
          onClose={closeAdvanceModal}
        />
      )}
    </div>
  );
};
