import React from 'react';
import { FolderSync, FileText, Sparkles, MapPin, ArrowLeft, Shield, Clock } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface DomainLocationsViewProps {
  onBackToMap?: () => void;
  selectedLandmarkContext?: string | null;
}

export const DomainLocationsView: React.FC<DomainLocationsViewProps> = ({ 
  onBackToMap,
  selectedLandmarkContext 
}) => {
  const { isGoingDark } = useTheme();

  return (
    <div className={`space-y-6 ${isGoingDark ? 'text-[#e2e8f0]' : 'text-[#e0dacf]'}`}>
      {/* Return Button */}
      {onBackToMap && (
        <button
          onClick={onBackToMap}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-heading font-semibold transition-all ${
            isGoingDark
              ? 'bg-[#0b152c] hover:bg-[#b91c1c] text-[#7dd3fc] hover:text-white border-2 border-black shadow-[3px_3px_0px_#000000]'
              : 'rounded-xl bg-[#141724] hover:bg-[#780016] text-[#c59b27] hover:text-white border border-[#3d311c]'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Вернуться к Интерактивной Карте</span>
        </button>
      )}

      {/* Main Atmospheric Placeholder Banner */}
      <div
        className={`p-8 sm:p-12 relative overflow-hidden ${
          isGoingDark
            ? 'spire-card-shell spire-ink-hatch bg-gradient-to-br from-[#0d1730] via-[#081022] to-[#040812] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-gradient-to-br from-[#1c1209] via-[#10131d] to-[#07090f] border-2 border-[#543f16] rounded-3xl shadow-2xl'
        }`}
      >
        {/* Background glow decoration (Classic only) */}
        {!isGoingDark && (
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#780016]/15 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="max-w-3xl space-y-6 relative z-10">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold ${
              isGoingDark
                ? 'font-mono bg-[#03050b] border-2 border-black text-[#7dd3fc] shadow-[2px_2px_0px_#000000]'
                : 'rounded-full font-heading bg-[#2a1c0d] border border-[#c59b27]/60 text-[#f0cb78]'
            }`}
          >
            <Clock size={14} className="animate-spin" />
            <span>Раздел в подготовке • Интеграция с Google Drive</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl font-heading font-black leading-tight ${
              isGoingDark ? 'text-[#f0f6ff]' : 'text-[#f0cb78]'
            }`}
          >
            Локации и Тайные Убежища Сфер
          </h2>

          {selectedLandmarkContext && (
            <div
              className={`p-4 flex items-center gap-3 ${
                isGoingDark
                  ? 'bg-[#03050b] border-2 border-[#38bdf8] shadow-[3px_3px_0px_#000000]'
                  : 'rounded-xl bg-[#090b10] border border-[#c59b27]'
              }`}
            >
              <MapPin
                size={20}
                className={`flex-shrink-0 ${isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'}`}
              />
              <div>
                <span
                  className={`text-xs block font-heading ${
                    isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'
                  }`}
                >
                  Вы выбрали объект на карте:
                </span>
                <span
                  className={`text-base font-heading font-bold ${
                    isGoingDark ? 'text-[#7dd3fc]' : 'text-[#f0cb78]'
                  }`}
                >
                  {selectedLandmarkContext}
                </span>
              </div>
            </div>
          )}

          <p
            className={`text-sm sm:text-base font-serif leading-relaxed ${
              isGoingDark ? 'text-[#cbd5e1]' : 'text-[#d1c9bd]'
            }`}
          >
            Этот раздел предназначен для авторских досье ключевых локаций Шпиля. Все материалы будут автоматически синхронизироваться из выделенной папки вашего <strong>Google Диска</strong> (файлы <code>.docx</code> и <code>.md</code>) и раскладываться по 9 официальным Сферам города.
          </p>

          {/* Planned Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div
              className={`p-4 space-y-2 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[4px_4px_0px_#000000]'
                  : 'rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042]'
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center ${
                  isGoingDark
                    ? 'bg-[#0b152c] border border-black text-[#38bdf8]'
                    : 'rounded-lg bg-[#1a1d29] border border-[#3e455c] text-[#9fcbf5]'
                }`}
              >
                <FolderSync size={18} />
              </div>
              <h4 className={`font-heading font-bold text-sm ${isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e0dacf]'}`}>
                Прямая синхронизация
              </h4>
              <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
                Достаточно положить новый документ в облако и запустить выгрузку.
              </p>
            </div>

            <div
              className={`p-4 space-y-2 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[4px_4px_0px_#000000]'
                  : 'rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042]'
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center ${
                  isGoingDark
                    ? 'bg-[#0b152c] border border-black text-[#7dd3fc]'
                    : 'rounded-lg bg-[#1a1d29] border border-[#3e455c] text-[#f0cb78]'
                }`}
              >
                <FileText size={18} />
              </div>
              <h4 className={`font-heading font-bold text-sm ${isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e0dacf]'}`}>
                Поддержка Word и MD
              </h4>
              <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
                Автоматическое чтение форматирования, таблиц, цитат и заметок для Ведущего.
              </p>
            </div>

            <div
              className={`p-4 space-y-2 ${
                isGoingDark
                  ? 'bg-[#040812] border-2 border-black shadow-[4px_4px_0px_#000000]'
                  : 'rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042]'
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center ${
                  isGoingDark
                    ? 'bg-[#0b152c] border border-black text-[#38bdf8]'
                    : 'rounded-lg bg-[#1a1d29] border border-[#3e455c] text-[#e5b83b]'
                }`}
              >
                <Sparkles size={18} />
              </div>
              <h4 className={`font-heading font-bold text-sm ${isGoingDark ? 'text-[#f0f6ff]' : 'text-[#e0dacf]'}`}>
                9 Сфер Влияния
              </h4>
              <p className={`text-xs leading-relaxed ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
                Академия, Криминал, Коммерция, Высший свет, Низы, Оккультизм, Порядок, Религия, Технологии.
              </p>
            </div>
          </div>

          {onBackToMap && (
            <div className="pt-4">
              <button
                onClick={onBackToMap}
                className={`px-6 py-3 font-heading font-bold text-sm transition-all ${
                  isGoingDark
                    ? 'bg-[#b91c1c] hover:bg-[#dc2626] text-white border-2 border-black shadow-[4px_4px_0px_#000000]'
                    : 'rounded-xl bg-[#780016] hover:bg-[#96001c] text-[#f0cb78] hover:text-white border border-[#c59b27] shadow-xl'
                }`}
              >
                Вернуться к изучению районов на карте
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
