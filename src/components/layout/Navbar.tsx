import React, { useState } from 'react';
import { Shield, MapPin, Crosshair, Dices, Menu, X, Award, Compass } from 'lucide-react';

export type NavTab = 'classes' | 'extra' | 'districts' | 'equipment' | 'rules';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'classes', label: 'Классы', icon: <Shield size={16} /> },
    { id: 'extra', label: 'Доп. Продвижения', icon: <Award size={16} /> },
    { id: 'districts', label: 'Атлас и Хроники', icon: <Compass size={16} /> },
    { id: 'equipment', label: 'Снаряжение и Теги', icon: <Crosshair size={16} /> },
    { id: 'rules', label: 'Механики и Fallout', icon: <Dices size={16} /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06080d]/95 backdrop-blur-md border-b border-[#3d2b0e] shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('classes')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#780016] to-[#36000a] border border-[#c59b27] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="font-heading font-black text-sm text-[#e5b83b]">S</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-[#e5b83b] tracking-wider leading-none">
                ШПИЛЬ
              </h1>
              <span className="text-[10px] text-[#959085] tracking-widest uppercase font-heading">
                Город Должен Пасть
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0d0f17] p-1 rounded-xl border border-[#262c3e]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                  currentTab === item.id
                    ? 'bg-[#780016] text-white shadow-md border border-[#c59b27]/30'
                    : 'text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1017] border border-[#3e321e] text-[11px] text-[#c59b27] font-heading font-medium">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Справочник активен</span>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#959085] hover:text-[#e0dacf] hover:bg-[#1a1c26]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#262c3e] bg-[#090b12] p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                currentTab === item.id
                  ? 'bg-[#780016] text-white border border-[#c59b27]/30'
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
