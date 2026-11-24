import React from 'react';
import { LoreTOCItem, LoreSectionBlock } from '../../types/lore';
import { LoreTableOfContents } from './LoreTableOfContents';
import { BurningScrollSpoiler } from './BurningScrollSpoiler';
import { Flame, ShieldAlert, Sparkles, BookOpen, Quote, Info, Shield, Users } from 'lucide-react';

interface LoreArticleLayoutProps {
  id: string;
  title: string;
  subtitle?: string;
  quote?: string;
  quoteAuthor?: string;
  image?: {
    url: string;
    caption?: string;
    alt?: string;
  };
  lead?: string;
  sections: LoreSectionBlock[];
  tocItems?: LoreTOCItem[];
  actions?: React.ReactNode;
}

export const LoreArticleLayout: React.FC<LoreArticleLayoutProps> = ({
  id,
  title,
  subtitle,
  quote,
  quoteAuthor,
  image,
  lead,
  sections,
  tocItems,
  actions
}) => {
  // Generate TOC items if not explicitly passed
  const items: LoreTOCItem[] = tocItems || [
    { id: `${id}-overview`, title: 'Введение' },
    ...sections.map(s => ({ id: s.id, title: s.title }))
  ];

  const renderCallout = (callout: NonNullable<LoreSectionBlock['callout']>) => {
    let icon = <Info size={18} className="text-[#38bdf8]" />;
    let borderClass = 'border-l-4 border-[#38bdf8] bg-[#0b1c2b]/80';
    let titleClass = 'text-[#7dd3fc]';

    if (callout.type === 'secret') {
      icon = <Sparkles size={18} className="text-[#a855f7]" />;
      borderClass = 'border-l-4 border-[#a855f7] bg-[#220d30]/80';
      titleClass = 'text-[#d8b4fe]';
    } else if (callout.type === 'warning' || callout.type === 'danger') {
      icon = <ShieldAlert size={18} className="text-[#ef4444]" />;
      borderClass = 'border-l-4 border-[#ef4444] bg-[#2b0d12]/80';
      titleClass = 'text-[#fca5a5]';
    } else if (callout.type === 'quote') {
      icon = <Quote size={18} className="text-[#c59b27]" />;
      borderClass = 'border-l-4 border-[#c59b27] bg-[#231809]/80';
      titleClass = 'text-[#f5c342]';
    }

    return (
      <div className={`my-6 p-4 sm:p-5 rounded-r-xl ${borderClass} shadow-md`}>
        <div className="flex items-center gap-2.5 mb-2 font-heading font-bold text-sm tracking-wide">
          {icon}
          <span className={titleClass}>{callout.title}</span>
        </div>
        <p className="text-sm font-body text-[#d6d0c2] leading-relaxed">
          {callout.text}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Main Reading Column */}
      <article className="flex-1 w-full min-w-0 bg-[#07090e]/90 backdrop-blur-md rounded-2xl border border-[#3e2d14] p-6 sm:p-8 lg:p-10 shadow-[0_8px_35px_rgba(0,0,0,0.9)]">
        {/* Article Header */}
        <header id={`${id}-overview`} className="mb-8 border-b border-[#2b2112] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            {subtitle && (
              <span className="text-[11px] font-heading uppercase tracking-widest px-3 py-1 rounded-full bg-[#171b26] border border-[#3d2e1a] text-[#c59b27]">
                {subtitle}
              </span>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#f3ca52] tracking-wide leading-tight mb-4">
            {title}
          </h1>

          {/* Epigraph / Quote */}
          {quote && (
            <div className="my-5 p-4 rounded-xl bg-[#0f121b] border-l-4 border-[#780016] text-[#c9c2b3] italic font-flavor text-base sm:text-lg leading-relaxed shadow-inner">
              <p>{quote}</p>
              {quoteAuthor && (
                <div className="text-right text-xs not-italic font-heading text-[#8a8274] mt-2 font-semibold">
                  — {quoteAuthor}
                </div>
              )}
            </div>
          )}

          {/* Hero Image if present - fitted frame hugging the artwork */}
          {image && (
            <figure
              className={`my-6 mx-auto w-fit max-w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col items-center bg-[#07090e] ${
                id.includes('lekole')
                  ? 'border-[#780016] shadow-[0_12px_40px_rgba(120,0,22,0.3)]'
                  : id.includes('lombre')
                  ? 'border-[#4a2868] shadow-[0_12px_40px_rgba(74,40,104,0.3)]'
                  : 'border-[#5c441c] shadow-[0_12px_40px_rgba(92,68,28,0.3)]'
              }`}
            >
              <div className="relative overflow-hidden flex items-center justify-center">
                <img
                  src={image.url}
                  alt={image.alt || title}
                  className="max-w-full max-h-[560px] w-auto h-auto block object-contain transition-transform duration-500 hover:scale-[1.01]"
                  loading="lazy"
                />
              </div>
              {image.caption && (
                <figcaption className="w-full px-4 py-2 bg-[#0a0d14] text-xs text-[#958e81] font-heading tracking-wide text-center border-t border-[#1e170e]">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Lead Paragraph */}
          {lead && (
            <p className="text-base sm:text-lg text-[#ded7ca] font-body leading-relaxed">
              {lead}
            </p>
          )}
        </header>

        {/* Article Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-36 pt-4 border-t border-[#1e170e]/80 first:border-t-0 first:pt-0">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#e8c04d] tracking-wide mb-4 flex items-center gap-2">
                <Flame size={18} className="text-[#780016] shrink-0" />
                <span>{section.title}</span>
              </h2>

              {section.lead && (
                <p className="text-sm sm:text-base text-[#e0dacf] font-body font-medium leading-relaxed mb-4">
                  {section.lead}
                </p>
              )}

              {section.paragraphs && section.paragraphs.length > 0 && (
                <div className="space-y-3.5 mb-5 text-sm sm:text-base font-body text-[#c4bcb0] leading-relaxed">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
              )}

              {/* Bullets List / Illuminated Cards */}
              {section.layout === 'virtues' && section.bullets && section.bullets.length > 0 ? (
                <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {section.bullets.map((bullet, bIdx) => {
                    const isLekole = id.includes('lekole');
                    const isLombre = id.includes('lombre');

                    // Virtue theming by goddess and index
                    let cardClasses = 'bg-gradient-to-br from-[#121826]/95 via-[#0b0e17]/95 to-[#06080e]/95 border-2 border-[#5a6b82] shadow-[0_0_25px_rgba(100,140,200,0.18)] hover:border-[#829bb8]';
                    let ambientColor = 'bg-[#38bdf8]';
                    let badgeClasses = 'bg-[#1b253b] text-[#93c5fd] border-[#3b82f6]/40';
                    let titleColor = 'text-[#e0edff]';
                    let quoteClasses = 'bg-[#151c2e]/70 border-[#60a5fa] text-[#cbd5e1]';
                    let defaultBadge = 'Священная добродетель I';
                    let virtueIcon = <Shield size={20} className="text-[#93c5fd]" />;

                    if (isLekole) {
                      if (bIdx === 0) {
                        // Мудрость (Wisdom - Smoldering Amber)
                        cardClasses = 'bg-gradient-to-br from-[#2a130f]/95 via-[#190c0a]/95 to-[#0b0506]/95 border-2 border-[#853422] shadow-[0_0_25px_rgba(200,80,50,0.18)] hover:border-[#b84e36]';
                        ambientColor = 'bg-[#ea580c]';
                        badgeClasses = 'bg-[#3f1910] text-[#fdba74] border-[#ea580c]/40';
                        titleColor = 'text-[#fed7aa]';
                        quoteClasses = 'bg-[#28110b]/70 border-[#f97316] text-[#fed7aa]';
                        defaultBadge = 'Священная добродетель V';
                        virtueIcon = <BookOpen size={20} className="text-[#fdba74]" />;
                      } else {
                        // Ярость (Fury - Revolutionary Crimson Flame)
                        cardClasses = 'bg-gradient-to-br from-[#300e13]/95 via-[#1a070a]/95 to-[#0b0406]/95 border-2 border-[#991b1b] shadow-[0_0_25px_rgba(220,38,38,0.25)] hover:border-[#dc2626]';
                        ambientColor = 'bg-[#ef4444]';
                        badgeClasses = 'bg-[#450a0a] text-[#fca5a5] border-[#ef4444]/40';
                        titleColor = 'text-[#fecaca]';
                        quoteClasses = 'bg-[#2e090d]/70 border-[#ef4444] text-[#fecaca]';
                        defaultBadge = 'Священная добродетель VI';
                        virtueIcon = <Flame size={20} className="text-[#fca5a5]" />;
                      }
                    } else if (isLombre) {
                      if (bIdx === 0) {
                        // Изящество (Subtlety - Shadow Amethyst)
                        cardClasses = 'bg-gradient-to-br from-[#1a1226]/95 via-[#0e0a17]/95 to-[#06040e]/95 border-2 border-[#6b428c] shadow-[0_0_25px_rgba(168,85,247,0.18)] hover:border-[#935ec0]';
                        ambientColor = 'bg-[#a855f7]';
                        badgeClasses = 'bg-[#241338] text-[#d8b4fe] border-[#a855f7]/40';
                        titleColor = 'text-[#f3e8ff]';
                        quoteClasses = 'bg-[#201032]/70 border-[#c084fc] text-[#e9d5ff]';
                        defaultBadge = 'Священная добродетель III';
                        virtueIcon = <Sparkles size={20} className="text-[#d8b4fe]" />;
                      } else {
                        // Бдительность (Vigilance - Deep Midnight Cyan)
                        cardClasses = 'bg-gradient-to-br from-[#121826]/95 via-[#0b0e17]/95 to-[#06080e]/95 border-2 border-[#3b5982] shadow-[0_0_25px_rgba(56,189,248,0.18)] hover:border-[#537fb8]';
                        ambientColor = 'bg-[#38bdf8]';
                        badgeClasses = 'bg-[#132338] text-[#7dd3fc] border-[#38bdf8]/40';
                        titleColor = 'text-[#e0f2fe]';
                        quoteClasses = 'bg-[#0f1d30]/70 border-[#38bdf8] text-[#bae6fd]';
                        defaultBadge = 'Священная добродетель IV';
                        virtueIcon = <Shield size={20} className="text-[#7dd3fc]" />;
                      }
                    } else {
                      // Limye (Default: Silver & Gold)
                      if (bIdx === 1) {
                        cardClasses = 'bg-gradient-to-br from-[#211a12]/95 via-[#13100b]/95 to-[#06080e]/95 border-2 border-[#7c5e26] shadow-[0_0_25px_rgba(210,165,60,0.18)] hover:border-[#b8913d]';
                        ambientColor = 'bg-[#eab308]';
                        badgeClasses = 'bg-[#36250f] text-[#fcd34d] border-[#eab308]/40';
                        titleColor = 'text-[#fef08a]';
                        quoteClasses = 'bg-[#291e10]/70 border-[#f59e0b] text-[#fde68a]';
                        defaultBadge = 'Священная добродетель II';
                        virtueIcon = <Users size={20} className="text-[#fcd34d]" />;
                      }
                    }

                    return (
                      <div
                        key={bIdx}
                        className={`relative p-5 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between ${cardClasses}`}
                      >
                        {/* Glowing ambient light */}
                        <div
                          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 ${ambientColor}`}
                        />

                        <div>
                          {/* Header badge */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`text-[10px] font-heading font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${badgeClasses}`}
                            >
                              {bullet.badge || defaultBadge}
                            </span>
                            <div>
                              {virtueIcon}
                            </div>
                          </div>

                          {/* Title */}
                          <h3
                            className={`font-heading font-extrabold text-xl sm:text-2xl tracking-wide mb-2 ${titleColor}`}
                          >
                            {bullet.term}
                          </h3>

                          {/* Sacred Creed / Quote if present */}
                          {bullet.quote && (
                            <div
                              className={`my-3 p-3 rounded-xl border-l-4 italic font-flavor text-xs sm:text-sm leading-relaxed ${quoteClasses}`}
                            >
                              {bullet.quote}
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-xs sm:text-sm font-body text-[#c7bfb3] leading-relaxed mt-2">
                            {bullet.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : section.bullets && section.bullets.length > 0 ? (
                <div className="my-5 space-y-4">
                  {section.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-4 sm:p-5 rounded-xl bg-[#0b0e16]/80 border border-[#23293a]/80 hover:border-[#780016]/60 transition-colors"
                    >
                      {bullet.term && (
                        <div className="font-heading font-extrabold text-sm sm:text-base text-[#f0ca5b] mb-1.5 flex items-center justify-between">
                          <span>{bullet.term}</span>
                        </div>
                      )}
                      <div className="text-xs sm:text-sm font-body text-[#b8b0a2] leading-relaxed whitespace-pre-line">
                        {bullet.description}
                      </div>

                      {/* Interactive Burning Scroll Spoiler */}
                      {bullet.spoilerPhrase && (
                        <div className="pt-2">
                          <BurningScrollSpoiler
                            phrase={bullet.spoilerPhrase}
                            orderNumber={bIdx + 1}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Callout Box */}
              {section.callout && renderCallout(section.callout)}
            </section>
          ))}
        </div>
      </article>

      {/* Floating Table of Contents */}
      <LoreTableOfContents items={items} />
    </div>
  );
};
