import React from 'react';
import { BookOpen } from 'lucide-react';
import { CharacterClass } from '../../types/game';
import { ClassCard } from './ClassCard';
import { ClassModal } from './ClassModal';
import classesData from '../../data/classes.json';
import { useRouter } from '../../router/RouterContext';
import { useTheme } from '../../theme/ThemeContext';

export const ClassesList: React.FC = () => {
  const { route, openClassModal, closeClassModal } = useRouter();
  const { isGoingDark } = useTheme();
  const classes: CharacterClass[] = classesData as CharacterClass[];

  const selectedClass = route.classId ? classes.find(c => c.id === route.classId) || null : null;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div
        className={`spire-banner relative overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isGoingDark
            ? 'bg-gradient-to-r from-[#0d1730] via-[#091124] to-[#060b17] border-2 border-black shadow-[6px_6px_0px_#000000]'
            : 'bg-gradient-to-r from-[#210911] via-[#141620] to-[#0d0e14] border border-[#4a2e12] rounded-2xl shadow-xl'
        }`}
      >
        {isGoingDark && (
          <div className="spire-ink-hatch absolute inset-y-0 right-0 w-1/3 pointer-events-none opacity-45" />
        )}
        <div className="relative z-10">
          {isGoingDark && (
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="spire-archive-stamp">ДЕЛА КЛАССОВ</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7dd3fc]">
                ДОПУСК: АГЕНТ МИНИСТЕРСТВА
              </span>
            </div>
          )}
          <h2
            className={`text-2xl sm:text-3xl font-heading font-bold mb-2 flex items-center gap-3 ${
              isGoingDark ? 'text-[#f0f6ff] tracking-wide' : 'text-[#e5b83b]'
            }`}
          >
            <BookOpen className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} size={28} />
            Классы Персонажей Шпиля
          </h2>
          <p
            className={`text-sm sm:text-base max-w-3xl leading-relaxed ${
              isGoingDark ? 'text-[#cbd5e1]' : 'text-[#ccc5b8]'
            }`}
          >
            Каждый класс — это тайная роль дроу в восстании против аэльфирских угнетателей. Выберите класс, чтобы изучить его уникальные ключевые механики, стартовые характеристики и разветвлённое древо продвижений.
          </p>
        </div>

        <div
          className={`relative z-10 flex-shrink-0 self-start sm:self-center px-3.5 py-1.5 text-xs font-mono tabular-nums ${
            isGoingDark
              ? 'bg-[#03050b] border-2 border-black shadow-[3px_3px_0px_#000000] text-[#7dd3fc] uppercase tracking-wider'
              : 'rounded-xl bg-black/60 border border-[#3d2b0e] text-[#c59b27]'
          }`}
        >
          Всего классов: <strong className="text-white text-sm">{classes.length}</strong>
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map(characterClass => (
          <ClassCard
            key={characterClass.id}
            characterClass={characterClass}
            onSelect={(cls) => openClassModal(cls.id)}
          />
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedClass && (
        <ClassModal
          characterClass={selectedClass}
          onClose={closeClassModal}
        />
      )}
    </div>
  );
};
