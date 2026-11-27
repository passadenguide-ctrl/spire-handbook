import React, { useState } from 'react';
import tagsData from '../../data/tags.json';
import { useTheme } from '../../theme/ThemeContext';

interface TagBadgeProps {
  tagName: string;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tagName, className = '' }) => {
  const { isGoingDark } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  // Normalize tag name (e.g., "Разброс d3" -> "Разброс Dx", "Сакральный", etc.)
  const cleanName = tagName.trim();
  
  // Find tag in weapon or armor tags
  const allTags = [...tagsData.weapons, ...tagsData.armor];
  const tagInfo = allTags.find(t => 
    t.nameRu.toLowerCase() === cleanName.toLowerCase() ||
    cleanName.toLowerCase().startsWith(t.nameRu.toLowerCase().split(' ')[0]) ||
    t.nameEn.toLowerCase() === cleanName.toLowerCase()
  );

  const isMystic = cleanName.includes('Сакральный') || cleanName.includes('Оккультный');

  return (
    <span className="relative inline-block my-0.5">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium cursor-help transition-colors border ${
          isGoingDark
            ? isMystic
              ? 'font-mono bg-[#240a18] text-[#fda4af] border-[#9f1239] hover:bg-[#3b0f26]'
              : 'font-mono bg-[#03050b] text-[#7dd3fc] border-[#1e315c] hover:bg-[#0d1c3d] hover:border-[#38bdf8]'
            : isMystic
              ? 'rounded bg-[#2b101d] text-[#e89db7] border-[#6b2542] hover:bg-[#3d162a]'
              : 'rounded bg-[#181b24] text-[#d4af37] border-[#4a3b14] hover:bg-[#252a38] hover:border-[#c59b27]'
        } ${className}`}
      >
        [{cleanName}]
      </button>

      {showTooltip && (
        <div
          className={`absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 text-xs pointer-events-none ${
            isGoingDark
              ? 'bg-[#03050b] text-[#e2e8f0] shadow-[4px_4px_0px_#000000] border-2 border-[#38bdf8]'
              : 'bg-[#13151c] text-[#e2dcd2] rounded-lg shadow-xl border border-[#c59b27]'
          }`}
        >
          <div
            className={`font-heading font-bold mb-1 flex justify-between ${
              isGoingDark ? 'text-[#7dd3fc]' : 'text-[#c59b27]'
            }`}
          >
            <span>{tagInfo ? tagInfo.nameRu : cleanName}</span>
            {tagInfo && (
              <span className={`italic font-normal ${isGoingDark ? 'text-[#94a3b8]' : 'text-[#959085]'}`}>
                {tagInfo.nameEn}
              </span>
            )}
          </div>
          <p className="leading-relaxed">
            {tagInfo ? tagInfo.desc : 'Особое свойство снаряжения или способности.'}
          </p>
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
              isGoingDark ? 'border-t-[#38bdf8]' : 'border-t-[#c59b27]'
            }`}
          />
        </div>
      )}
    </span>
  );
};
