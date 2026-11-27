import React, { useState } from 'react';
import { Shield, Crosshair, Dices, Menu, X, Award, BookOpen, MapPin, MoonStar } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

export type NavTab = 'classes' | 'extra' | 'lore' | 'map' | 'equipment' | 'rules';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isGoingDark, toggleTheme } = useTheme();

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'classes', label: 'Классы', icon: <Shield size={16} /> },
    { id: 'extra', label: 'Доп. Продвижения', icon: <Award size={16} /> },
    { id: 'lore', label: 'Хроники', icon: <BookOpen size={16} /> },
    { id: 'map', label: 'Карта', icon: <MapPin size={16} /> },
    { id: 'equipment', label: 'Снаряжение и Теги', icon: <Crosshair size={16} /> },
    { id: 'rules', label: 'Механики и Последствия', icon: <Dices size={16} /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 h-16 box-border backdrop-blur-md transition-colors duration-200 ${
        isGoingDark
          ? 'bg-[#04070f]/97 border-b-2 border-black shadow-[0_4px_0_#000000]'
          : 'bg-[#06080d]/95 border-b border-[#3d2b0e] shadow-[0_4px_25px_rgba(0,0,0,0.85)]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick('classes')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div
              className={`w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 ${
                isGoingDark
                  ? 'rounded-xs border-2 border-black shadow-[3px_3px_0_#000000] bg-[linear-gradient(90deg,#000000_46%,#f8fafc_46%,#f8fafc_54%,#0a1224_54%)]'
                  : 'rounded-lg bg-gradient-to-br from-[#780016] to-[#36000a] border border-[#c59b27] shadow-md'
              }`}
            >
              <span
                className={`font-heading font-black text-sm ${
                  isGoingDark ? 'text-[#38bdf8] drop-shadow-[0_0_4px_#000]' : 'text-[#e5b83b]'
                }`}
              >
                S
              </span>
            </div>
            <div>
              <h1
                className={`font-heading font-bold text-base sm:text-lg tracking-wider leading-none ${
                  isGoingDark ? 'text-[#f8fafc]' : 'text-[#e5b83b]'
                }`}
              >
                ШПИЛЬ
              </h1>
              <span
                className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-heading whitespace-nowrap block ${
                  isGoingDark ? 'text-[#7dd3fc]' : 'text-[#959085]'
                }`}
              >
                {isGoingDark ? 'Архив Министерства' : 'Город Должен Пасть'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden xl:flex items-center gap-1 p-1 ${
              isGoingDark
                ? 'bg-[#03060e] rounded-xs border-2 border-black shadow-[3px_3px_0_#000000]'
                : 'bg-[#0d0f17] rounded-xl border border-[#262c3e]'
            }`}
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 2xl:px-3.5 py-1.5 text-xs font-heading font-semibold whitespace-nowrap transition-colors ${
                  isGoingDark ? 'rounded-xs' : 'rounded-lg'
                } ${
                  currentTab === item.id
                    ? isGoingDark
                      ? 'bg-[#b91c1c] text-white border border-black shadow-[2px_2px_0_#000000]'
                      : 'bg-[#780016] text-white shadow-md border border-[#c59b27]/40'
                    : isGoingDark
                    ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111d38] border border-transparent'
                    : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26] border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Tactical Going Dark Button (Visible on Desktop & Mobile) + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isGoingDark}
              title={isGoingDark ? 'Вернуться в классическую тему' : 'Активировать режим шпионского архива (Indigo / Mignola Noir)'}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-heading font-bold tracking-wider whitespace-nowrap cursor-pointer transition-all duration-150 ${
                isGoingDark
                  ? 'rounded-xs bg-[#0f1b38] text-[#f8fafc] border-2 border-[#38bdf8] shadow-[3px_3px_0_#000000] hover:bg-[#16274f]'
                  : 'rounded-xl bg-[#0e1017] text-[#e0dacf] border border-[#3e321e] hover:border-[#38bdf8] hover:text-[#7dd3fc] shadow-md'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                  isGoingDark
                    ? 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]'
                    : 'bg-[#64748b]'
                }`}
              />
              <MoonStar size={14} className={isGoingDark ? 'text-[#38bdf8]' : 'text-[#94a3b8]'} />
              <span>Going Dark</span>
            </button>

            <div className="xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isGoingDark
                    ? 'text-[#cbd5e1] hover:text-white hover:bg-[#111d38]'
                    : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                }`}
                aria-label="Открыть меню"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu Dropdown (< xl) */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden p-4 space-y-2 ${
            isGoingDark
              ? 'border-b-2 border-t-2 border-black bg-[#060b18] shadow-[0_6px_0_#000000]'
              : 'border-t border-[#262c3e] bg-[#090b12]'
          }`}
        >
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading font-semibold transition-colors ${
                isGoingDark ? 'rounded-xs' : 'rounded-xl'
              } ${
                currentTab === item.id
                  ? isGoingDark
                    ? 'bg-[#b91c1c] text-white border-2 border-black shadow-[3px_3px_0_#000000]'
                    : 'bg-[#780016] text-white border border-[#c59b27]/30'
                  : isGoingDark
                  ? 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#111d38]'
                  : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#141724]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
