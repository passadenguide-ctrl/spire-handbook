import React from 'react';
import { Compass, MapPin } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface DomainsDistrictsViewProps {
  onNavigateToMap: (districtId: string) => void;
  initialDistrictId?: string;
}

export const DomainsDistrictsView: React.FC<DomainsDistrictsViewProps> = ({
  onNavigateToMap
}) => {
  const { isGoingDark } = useTheme();

  return (
    <div
      className={`p-8 sm:p-14 text-center space-y-5 max-w-3xl mx-auto my-8 ${
        isGoingDark
          ? 'spire-card-shell spire-ink-hatch bg-gradient-to-b from-[#0d1730] to-[#050914] border-2 border-black shadow-[6px_6px_0px_#000000]'
          : 'rounded-2xl bg-gradient-to-b from-[#10121a] to-[#0a0c10] border border-[#2b2518] shadow-2xl'
      }`}
    >
      <div
        className={`w-16 h-16 mx-auto flex items-center justify-center ${
          isGoingDark
            ? 'bg-[#03050b] border-2 border-black text-[#38bdf8] shadow-[3px_3px_0px_#000000]'
            : 'rounded-2xl bg-[#1b1710] border border-[#5e4713] text-[#c59b27] shadow-lg'
        }`}
      >
        <Compass size={32} />
      </div>
      <div>
        <h3
          className={`text-2xl sm:text-3xl font-heading font-bold ${
            isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e5b83b]'
          }`}
        >
          Районы и 9 Доменов Шпиля
        </h3>
        <p
          className={`text-xs tracking-widest uppercase mt-1 ${
            isGoingDark ? 'font-mono text-[#7dd3fc]' : 'font-heading text-[#959085]'
          }`}
        >
          DISTRICTS & DOMAINS OF SPIRE
        </p>
      </div>
      <p
        className={`text-sm sm:text-base leading-relaxed max-w-xl mx-auto ${
          isGoingDark ? 'text-[#cbd5e1]' : 'text-[#b8b0a2]'
        }`}
      >
        Подробные статьи и адаптированный лор по районам и доменам Шпиля будут добавлены из документов кампании.
      </p>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span
          className={`px-3.5 py-1.5 text-xs font-medium ${
            isGoingDark
              ? 'font-mono bg-[#03050b] text-[#7dd3fc] border-2 border-black'
              : 'rounded-full font-heading bg-[#1c1315] text-[#e0a96d] border border-[#4a2e1d]'
          }`}
        >
          Ожидает адаптации из Google Docs
        </span>
        <button
          onClick={() => onNavigateToMap('derelictus')}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-heading font-semibold transition-colors ${
            isGoingDark
              ? 'bg-[#b91c1c] hover:bg-[#dc2626] text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
              : 'rounded-xl bg-[#121622] hover:bg-[#1f2638] text-[#e5b83b] border border-[#3b4764]'
          }`}
        >
          <MapPin size={14} className={isGoingDark ? 'text-white' : 'text-[#ef4444]'} />
          <span>Перейти к интерактивной карте</span>
        </button>
      </div>
    </div>
  );
};
