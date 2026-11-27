import React, { useEffect, useRef, useState } from 'react';
import { List, ChevronRight, ArrowUp, X } from 'lucide-react';
import { LoreTOCItem } from '../../types/lore';
import { useTheme } from '../../theme/ThemeContext';

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
  const { isGoingDark } = useTheme();
  const [internalActiveId, setInternalActiveId] = useState<string>(items[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const activeId = controlledActiveId || internalActiveId;

  const getStickyBottomOffset = (): number => {
    if (asideRef.current) {
      const raw = getComputedStyle(asideRef.current).getPropertyValue('--lore-sticky-bottom').trim();
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return 124;
  };

  useEffect(() => {
    if (controlledActiveId) return;

    const handleScroll = () => {
      // Account for all pinned sticky bars above + comfortable reading threshold
      const stickyOffset = getStickyBottomOffset();
      const scrollPosition = window.scrollY + stickyOffset + 60;

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
      // Offset calculation for all pinned sticky top navigation bars
      const headerOffset = getStickyBottomOffset() + 20;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
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
            className={`w-full text-left flex items-start gap-2 py-2 px-3 text-xs font-body transition-all group ${
              isSub ? 'pl-6 text-[11px]' : ''
            } ${
              isGoingDark
                ? isActive
                  ? 'bg-[#0d1c3d] text-[#7dd3fc] font-semibold border-l-4 border-[#38bdf8] shadow-[2px_2px_0px_#000000]'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#09142b]'
                : isActive
                  ? 'rounded-lg bg-[#3b0b14] text-[#f5c342] font-semibold border-l-2 border-[#c59b27] shadow-sm'
                  : 'rounded-lg text-[#9c9587] hover:text-[#e0dacf] hover:bg-[#141724]'
            }`}
          >
            <ChevronRight
              size={13}
              className={`mt-0.5 shrink-0 transition-transform ${
                isGoingDark
                  ? isActive
                    ? 'text-[#38bdf8] rotate-90'
                    : 'text-[#475569] group-hover:text-[#7dd3fc]'
                  : isActive
                    ? 'text-[#c59b27] rotate-90'
                    : 'text-[#635f56] group-hover:text-[#c59b27]'
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
      {/* Desktop Sticky Sidebar (stays pinned right below the sticky top navigation bars) */}
      <aside ref={asideRef} className="hidden lg:block w-64 xl:w-72 shrink-0 self-stretch relative">
        <div
          style={{
            top: 'calc(var(--lore-sticky-bottom, 180px) + 12px)',
            maxHeight: 'calc(100vh - var(--lore-sticky-bottom, 180px) - 24px)',
          }}
          className={`sticky p-5 overflow-y-auto ${
            isGoingDark
              ? 'spire-card-shell bg-[#081022]/95 border-2 border-black shadow-[5px_5px_0px_#000000]'
              : 'rounded-2xl bg-[#0a0d14]/95 backdrop-blur-md border border-[#3e2d14] shadow-[0_12px_40px_rgba(0,0,0,0.85)]'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 pb-3 mb-3 border-b ${
              isGoingDark ? 'border-black text-[#38bdf8]' : 'border-[#2b2112] text-[#c59b27]'
            }`}
          >
            <List size={16} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
            <span
              className={`font-bold text-xs uppercase tracking-wider ${
                isGoingDark ? 'font-mono text-[#e2e8f0]' : 'font-heading text-[#e0dacf]'
              }`}
            >
              Оглавление статьи
            </span>
          </div>

          {/* Links List */}
          {renderNavList()}

          {/* Quick jump back to top of the article */}
          <button
            onClick={scrollToArticleTop}
            className={`mt-4 pt-3 border-t w-full flex items-center justify-center gap-1.5 text-[11px] font-heading font-medium transition-colors ${
              isGoingDark
                ? 'border-black text-[#94a3b8] hover:text-[#7dd3fc]'
                : 'border-[#2b2112] text-[#8c8577] hover:text-[#f5c342]'
            }`}
          >
            <ArrowUp size={12} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
            <span>К началу статьи</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Floating Button (available on smaller screens) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
            isGoingDark
              ? 'font-mono bg-[#0b152c] text-[#7dd3fc] border-2 border-black shadow-[4px_4px_0px_#000000] hover:bg-[#b91c1c] hover:text-white'
              : 'font-heading rounded-full bg-[#0a0d14]/95 text-[#f5c342] border border-[#c59b27]/60 shadow-[0_8px_30px_rgba(0,0,0,0.9)] backdrop-blur-md hover:bg-[#780016]'
          }`}
        >
          <List size={16} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#f5c342]'} />
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
          <div
            className={`relative w-full max-w-xs h-full p-6 shadow-2xl flex flex-col z-10 overflow-y-auto ${
              isGoingDark
                ? 'bg-[#081022] border-l-2 border-black'
                : 'bg-[#0a0d14] border-l border-[#3e2d14]'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 mb-4 border-b ${
                isGoingDark ? 'border-black text-[#38bdf8]' : 'border-[#2b2112] text-[#c59b27]'
              }`}
            >
              <div className="flex items-center gap-2">
                <List size={18} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
                <span
                  className={`font-bold text-sm uppercase tracking-wider ${
                    isGoingDark ? 'font-mono text-[#e2e8f0]' : 'font-heading text-[#e0dacf]'
                  }`}
                >
                  Оглавление статьи
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className={`p-1.5 transition-colors ${
                  isGoingDark
                    ? 'text-[#94a3b8] hover:text-white hover:bg-[#111d38] border border-black'
                    : 'rounded-lg text-[#8c8577] hover:text-white hover:bg-[#1a1e2c]'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderNavList()}
            </div>

            <button
              onClick={scrollToArticleTop}
              className={`mt-6 pt-3 border-t w-full flex items-center justify-center gap-2 text-xs font-heading font-medium transition-colors ${
                isGoingDark
                  ? 'border-black text-[#94a3b8] hover:text-[#7dd3fc]'
                  : 'border-[#2b2112] text-[#8c8577] hover:text-[#f5c342]'
              }`}
            >
              <ArrowUp size={14} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#c59b27]'} />
              <span>К началу статьи</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
