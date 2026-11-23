import React, { useState } from 'react';
import tagsData from '../../data/tags.json';

interface TagBadgeProps {
  tagName: string;
  className?: string;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tagName, className = '' }) => {
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

  return (
    <span className="relative inline-block my-0.5">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-help transition-colors border ${
          cleanName.includes('Сакральный') || cleanName.includes('Оккультный')
            ? 'bg-[#2b101d] text-[#e89db7] border-[#6b2542] hover:bg-[#3d162a]'
            : 'bg-[#181b24] text-[#d4af37] border-[#4a3b14] hover:bg-[#252a38] hover:border-[#c59b27]'
        } ${className}`}
      >
        [{cleanName}]
      </button>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-[#13151c] text-[#e2dcd2] text-xs rounded-lg shadow-xl border border-[#c59b27] pointer-events-none">
          <div className="font-heading font-bold text-[#c59b27] mb-1 flex justify-between">
            <span>{tagInfo ? tagInfo.nameRu : cleanName}</span>
            {tagInfo && <span className="text-[#959085] italic font-normal">{tagInfo.nameEn}</span>}
          </div>
          <p className="leading-relaxed">
            {tagInfo ? tagInfo.desc : 'Особое свойство снаряжения или способности.'}
          </p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#c59b27]" />
        </div>
      )}
    </span>
  );
};
