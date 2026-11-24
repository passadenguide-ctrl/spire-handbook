import React from 'react';
import { BookOpen } from 'lucide-react';
import { CharacterClass } from '../../types/game';
import { ClassCard } from './ClassCard';
import { ClassModal } from './ClassModal';
import classesData from '../../data/classes.json';
import { useRouter } from '../../router/RouterContext';

export const ClassesList: React.FC = () => {
  const { route, openClassModal, closeClassModal } = useRouter();
  const classes: CharacterClass[] = classesData as CharacterClass[];

  const selectedClass = route.classId ? classes.find(c => c.id === route.classId) || null : null;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#210911] via-[#141620] to-[#0d0e14] border border-[#4a2e12] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#e5b83b] mb-2 flex items-center gap-3">
            <BookOpen className="text-[#c59b27]" size={28} />
            Классы Персонажей Шпиля
          </h2>
          <p className="text-sm sm:text-base text-[#ccc5b8] max-w-3xl leading-relaxed">
            Каждый класс — это тайная роль дроу в восстании против аэльфирских угнетателей. Выберите класс, чтобы изучить его уникальные ключевые механики, стартовые характеристики и разветвлённое древо продвижений.
          </p>
        </div>

        <div className="flex-shrink-0 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-black/60 border border-[#3d2b0e] text-xs font-mono text-[#c59b27]">
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
