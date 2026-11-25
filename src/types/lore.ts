export type LoreCategory = 'intro' | 'races' | 'domains' | 'gods' | 'society';

export interface LoreTOCItem {
  id: string;
  title: string;
  level?: number;
}

export interface LoreSectionBlock {
  id: string;
  title: string;
  subtitle?: string;
  lead?: string;
  layout?: 'default' | 'cards' | 'virtues' | 'magister-precepts';
  paragraphs: string[];
  callout?: {
    type: 'warning' | 'info' | 'secret' | 'quote' | 'danger';
    title: string;
    text: string;
  };
  bullets?: Array<{
    term?: string;
    quote?: string;
    badge?: string;
    description: string;
    spoilerPhrase?: string;
  }>;
  subsections?: Array<{
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: Array<{
      term?: string;
      description: string;
    }>;
  }>;
}

export interface LoreArticle {
  id: string;
  category: LoreCategory;
  title: string;
  subtitle?: string;
  quote?: string;
  quoteAuthor?: string;
  image?: {
    url: string;
    caption?: string;
    alt?: string;
  };
  sections: LoreSectionBlock[];
  relatedDistrictIds?: string[];
  relatedDomainNames?: string[];
}

export interface DomainInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  icon: string;
  color: string;
  badgeBg: string;
  summary: string;
  essence: string;
  hazards: string[];
  rulesOfSurvival: string[];
  districts: string[]; // district IDs
  keyLandmarks: Array<{
    name: string;
    districtId: string;
    desc: string;
  }>;
}

export interface RaceInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  status: string;
  quote: string;
  image?: string;
  overview: string;
  sections: LoreSectionBlock[];
}

export interface GodInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  epithet: string;
  domain: string;
  pantheon: 'drow' | 'aelfir' | 'forbidden';
  status: 'allowed' | 'secret' | 'forbidden';
  quote: string;
  doctrine: string;
  manifestation: string;
  ritesAndTaboos: string[];
  symbols: string;
}

export interface MoonFaceInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  aspect: string;
  status: string;
  quote?: string;
  image?: string;
  overview?: string;
  sections?: LoreSectionBlock[];
  isPlaceholder?: boolean;
}

export interface ReligionSubsection {
  id: string;
  title: string;
  titleEn: string;
  badge: string;
  description: string;
  quote?: string;
  image?: string;
  overview?: string;
  sections?: LoreSectionBlock[];
  faces?: MoonFaceInfo[];
  isPlaceholder?: boolean;
}

export interface ReligionsData {
  subsections: ReligionSubsection[];
}
