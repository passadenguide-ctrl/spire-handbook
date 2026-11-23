import React from 'react';
import { LoreArticleLayout } from './LoreArticleLayout';
import introData from '../../data/lore/intro.json';
import { MapPin } from 'lucide-react';

interface IntroViewProps {
  onNavigateToMap: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({
  onNavigateToMap
}) => {
  const sections = [
    {
      id: 'intro-chronicles',
      title: 'Хроники Падения и Восстания',
      paragraphs: introData.paragraphs,
      callout: {
        type: 'warning' as const,
        title: 'Тайный Орден Министерства',
        text: 'Вы не герои в сверкающих доспехах. Вы — ячейка мятежников, действующая из темных подвалов и чердаков. Каждое ваше действие может повлечь репрессии против всего квартала. Будьте осторожны в выборе врагов и друзей.'
      }
    }
  ];

  const quickNavActions = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onNavigateToMap}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#780016] hover:bg-[#99001c] text-white text-xs font-heading font-semibold transition-colors shadow-md border border-[#c59b27]/30"
      >
        <MapPin size={14} />
        <span>Открыть Карту</span>
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <LoreArticleLayout
        id="intro"
        title={introData.title}
        subtitle={introData.titleEn}
        quote={introData.quote}
        quoteAuthor={introData.quoteAuthor}
        image={introData.image}
        lead={introData.lead}
        sections={sections}
        actions={quickNavActions}
      />
    </div>
  );
};
