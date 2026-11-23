import React from 'react';
import { Compass, MapPin } from 'lucide-react';

interface DomainsDistrictsViewProps {
  onNavigateToMap: (districtId: string) => void;
  initialDistrictId?: string;
}

export const DomainsDistrictsView: React.FC<DomainsDistrictsViewProps> = ({
  onNavigateToMap
}) => {
  return (
    <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] text-center space-y-5 max-w-3xl mx-auto shadow-2xl my-8">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1b1710] border border-[#5e4713] flex items-center justify-center text-[#c59b27] shadow-lg">
        <Compass size={32} />
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b]">
          Районы и 9 Доменов Шпиля
        </h3>
        <p className="text-xs font-heading tracking-widest text-[#959085] uppercase mt-1">
          DISTRICTS & DOMAINS OF SPIRE
        </p>
      </div>
      <p className="text-sm sm:text-base text-[#b8b0a2] leading-relaxed max-w-xl mx-auto">
        Подробные статьи и адаптированный лор по районам и доменам Шпиля будут добавлены из документов кампании.
      </p>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-medium bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]">
          Ожидает адаптации из Google Docs
        </span>
        <button
          onClick={() => onNavigateToMap('derelictus')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1f2638] text-[#e5b83b] border border-[#3b4764] text-xs font-heading font-semibold transition-colors"
        >
          <MapPin size={14} className="text-[#ef4444]" />
          <span>Перейти к интерактивной карте</span>
        </button>
      </div>
    </div>
  );
};
