import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';
import { LoreTOCItem } from '../../types/lore';

interface LoreTableOfContentsProps {
  items: LoreTOCItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export const LoreTableOfContents: React.FC<LoreTableOfContentsProps> = ({
  items,
  activeId: controlledActiveId,
  onItemClick
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(items[0]?.id || '');
  const activeId = controlledActiveId || internalActiveId;

  useEffect(() => {
    if (controlledActiveId) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setInternalActiveId(items[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, controlledActiveId]);

  const scrollToSection = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
      <div className="sticky top-24 rounded-2xl bg-[#0a0d14]/90 backdrop-blur-md border border-[#3e2d14] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#2b2112] text-[#c59b27]">
          <List size={16} className="text-[#c59b27]" />
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#e0dacf]">
            Оглавление статьи
          </span>
        </div>

        <nav className="space-y-1">
          {items.map(item => {
            const isActive = activeId === item.id;
            const isSub = item.level && item.level > 1;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left flex items-start gap-2 py-1.5 px-2.5 rounded-lg text-xs font-body transition-all group ${
                  isSub ? 'pl-6 text-[11px]' : ''
                } ${
                  isActive
                    ? 'bg-[#780016]/40 text-[#f5c342] font-semibold border-l-2 border-[#c59b27]'
                    : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724]'
                }`}
              >
                <ChevronRight
                  size={12}
                  className={`mt-0.5 shrink-0 transition-transform ${
                    isActive ? 'text-[#c59b27] rotate-90' : 'text-[#635f56] group-hover:text-[#c59b27]'
                  }`}
                />
                <span className="line-clamp-2 leading-relaxed">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
