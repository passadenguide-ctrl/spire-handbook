import React from 'react';
import { FolderSync, FileText, Sparkles, MapPin, ArrowLeft, Shield, Clock } from 'lucide-react';

interface DomainLocationsViewProps {
  onBackToMap?: () => void;
  selectedLandmarkContext?: string | null;
}

export const DomainLocationsView: React.FC<DomainLocationsViewProps> = ({ 
  onBackToMap,
  selectedLandmarkContext 
}) => {
  return (
    <div className="space-y-6 text-[#e0dacf]">
      {/* Return Button */}
      {onBackToMap && (
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141724] hover:bg-[#780016] text-[#c59b27] hover:text-white border border-[#3d311c] text-xs font-heading font-semibold transition-all"
        >
          <ArrowLeft size={16} />
          <span>Вернуться к Интерактивной Карте</span>
        </button>
      )}

      {/* Main Atmospheric Placeholder Banner */}
      <div className="bg-gradient-to-br from-[#1c1209] via-[#10131d] to-[#07090f] border-2 border-[#543f16] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#780016]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2a1c0d] border border-[#c59b27]/60 text-xs text-[#f0cb78] font-heading font-bold">
            <Clock size={14} className="animate-spin" />
            <span>Раздел в подготовке • Интеграция с Google Drive</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#f0cb78] leading-tight">
            Локации и Тайные Убежища Сфер
          </h2>

          {selectedLandmarkContext && (
            <div className="p-4 rounded-xl bg-[#090b10] border border-[#c59b27] flex items-center gap-3">
              <MapPin size={20} className="text-[#c59b27] flex-shrink-0" />
              <div>
                <span className="text-xs text-[#959085] block font-heading">
                  Вы выбрали объект на карте:
                </span>
                <span className="text-base font-heading font-bold text-[#f0cb78]">
                  {selectedLandmarkContext}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm sm:text-base text-[#d1c9bd] font-serif leading-relaxed">
            Этот раздел предназначен для авторских досье ключевых локаций Шпиля. Все материалы будут автоматически синхронизироваться из выделенной папки вашего <strong>Google Диска</strong> (файлы <code>.docx</code> и <code>.md</code>) и раскладываться по 9 официальным Сферам города.
          </p>

          {/* Planned Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1d29] border border-[#3e455c] flex items-center justify-center text-[#9fcbf5]">
                <FolderSync size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#e0dacf]">Прямая синхронизация</h4>
              <p className="text-xs text-[#959085] leading-relaxed">
                Достаточно положить новый документ в облако и запустить выгрузку.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1d29] border border-[#3e455c] flex items-center justify-center text-[#f0cb78]">
                <FileText size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#e0dacf]">Поддержка Word и MD</h4>
              <p className="text-xs text-[#959085] leading-relaxed">
                Автоматическое чтение форматирования, таблиц, цитат и заметок для Ведущего.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0f17]/90 border border-[#2b3042] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1d29] border border-[#3e455c] flex items-center justify-center text-[#e5b83b]">
                <Sparkles size={18} />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#e0dacf]">9 Сфер Влияния</h4>
              <p className="text-xs text-[#959085] leading-relaxed">
                Академия, Криминал, Коммерция, Высший свет, Низы, Оккультизм, Порядок, Религия, Технологии.
              </p>
            </div>
          </div>

          {onBackToMap && (
            <div className="pt-4">
              <button
                onClick={onBackToMap}
                className="px-6 py-3 rounded-xl bg-[#780016] hover:bg-[#96001c] text-[#f0cb78] hover:text-white border border-[#c59b27] font-heading font-bold text-sm shadow-xl transition-all"
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
