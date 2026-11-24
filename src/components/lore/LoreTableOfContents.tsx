import React, { useEffect, useState } from 'react';
import { List, ChevronRight, ArrowUp, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = controlledActiveId || internalActiveId;

  useEffect(() => {
    if (controlledActiveId) return;

    const handleScroll = () => {
      // 180px threshold accounts for sticky navbar (64px) + atlas bar (48px) + offset
      const scrollPosition = window.scrollY + 180;

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
    // Run once on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, controlledActiveId]);

  const scrollToSection = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    }
    const el = document.getElementById(id);
    if (el) {
      // Offset calculation for sticky top navbar + atlas sub-nav bar
      const headerOffset = 132;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileOpen(false);
  };

  const scrollToArticleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  if (!items || items.length === 0) return null;

  const renderNavList = () => (
    <nav className="space-y-1">
      {items.map(item => {
        const isActive = activeId === item.id;
        const isSub = item.level && item.level > 1;

        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`w-full text-left flex items-start gap-2 py-2 px-3 rounded-lg text-xs font-body transition-all group ${
              isSub ? 'pl-6 text-[11px]' : ''
            } ${
              isActive
                ? 'bg-[#3b0b14] text-[#f5c342] font-semibold border-l-2 border-[#c59b27] shadow-sm'
                : 'text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724]'
            }`}
          >
            <ChevronRight
              size={13}
              className={`mt-0.5 shrink-0 transition-transform ${
                isActive ? 'text-[#c59b27] rotate-90' : 'text-[#635f56] group-hover:text-[#c59b27]'
              }`}
            />
            <span className="line-clamp-2 leading-relaxed">{item.title}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (stays pinned to the right as the user scrolls) */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 self-stretch relative">
        <div className="sticky top-28 xl:top-32 rounded-2xl bg-[#0a0d14]/95 backdrop-blur-md border border-[#3e2d14] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-h-[calc(100vh-9.5rem)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#2b2112] text-[#c59b27]">
            <List size={16} className="text-[#c59b27]" />
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#e0dacf]">
              Оглавление статьи
            </span>
          </div>

          {/* Links List */}
          {renderNavList()}

          {/* Quick jump back to top of the article */}
          <button
            onClick={scrollToArticleTop}
            className="mt-4 pt-3 border-t border-[#2b2112] w-full flex items-center justify-center gap-1.5 text-[11px] font-heading font-medium text-[#8c8577] hover:text-[#f5c342] transition-colors"
          >
            <ArrowUp size={12} className="text-[#c59b27]" />
            <span>К началу статьи</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Floating Button (available on smaller screens) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0a0d14]/95 text-[#f5c342] border border-[#c59b27]/60 shadow-[0_8px_30px_rgba(0,0,0,0.9)] backdrop-blur-md font-heading text-xs font-bold uppercase tracking-wider hover:bg-[#780016] transition-all"
        >
          <List size={16} className="text-[#f5c342]" />
          <span>Оглавление</span>
        </button>
      </div>

      {/* Mobile / Tablet Slide-over Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#0a0d14] border-l border-[#3e2d14] h-full p-6 shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2b2112] text-[#c59b27]">
              <div className="flex items-center gap-2">
                <List size={18} className="text-[#c59b27]" />
                <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#e0dacf]">
                  Оглавление статьи
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-[#8c8577] hover:text-white hover:bg-[#1a1e2c] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderNavList()}
            </div>

            <button
              onClick={scrollToArticleTop}
              className="mt-6 pt-3 border-t border-[#2b2112] w-full flex items-center justify-center gap-2 text-xs font-heading font-medium text-[#8c8577] hover:text-[#f5c342] transition-colors"
            >
              <ArrowUp size={14} className="text-[#c59b27]" />
              <span>К началу статьи</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
