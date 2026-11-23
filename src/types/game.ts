export type AbilityTier = 'core' | 'low' | 'medium' | 'high';

export interface Ability {
  id: string;
  name: string;
  tier: AbilityTier;
  tag?: string;
  tags?: string[];
  description: string;
  flavor?: string;
}

export interface EquipmentOption {
  label: string;
  items: string[];
  note?: string;
}

export interface EquipmentChoiceGroup {
  name: string;
  options: EquipmentOption[];
}

export interface ClassEquipment {
  fixed: string[];
  choiceGroups: EquipmentChoiceGroup[];
}

export interface CharacterClass {
  id: string;
  nameRu: string;
  nameEn: string;
  quote: string;
  whoIs?: string;
  description?: string;
  inANutshell?: string;
  keyMechanics?: string[];
  whatWillYouDo?: string[];
  summary?: string;
  resistances: string[];
  refresh: string;
  skills: string[];
  domains: string[];
  bonds?: string[];
  startingEquipment: string[];
  equipment?: ClassEquipment;
  image: string;
  abilities: Ability[];
}

export interface ExtraAdvance {
  id: string;
  nameRu: string;
  previewName?: string;
  nameEn?: string;
  source?: string;
  quote?: string;
  description?: string;
  requirement: string;
  refresh: string;
  image?: string;
  abilities: Ability[];
}

export interface Landmark {
  name: string;
  desc: string;
  details?: string;
  dangerLevel?: string;
}

export interface District {
  id: string;
  nameRu: string;
  nameEn: string;
  level: string;
  domains: string[];
  danger: string;
  description: string;
  longDescription?: string;
  bookQuote?: string;
  historyAndStructure?: string;
  atmosphere?: string;
  rumorsAndDangers?: string[];
  architecture?: string;
  factions?: string[];
  factionsDetails?: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  landmarks: Landmark[];
}

export interface Equipment {
  id: string;
  nameRu: string;
  category: 'weapon' | 'armor' | 'gear';
  damage?: string;
  armorValue?: number;
  range?: string;
  tags: string[];
  description: string;
}

export interface TagInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  desc: string;
}

export interface Resistance {
  id: string;
  nameRu: string;
  nameEn: string;
  desc: string;
}

export interface FalloutEntry {
  name: string;
  desc: string;
  narrativeExample?: string;
}

export interface RulesData {
  coreMechanic: {
    title: string;
    table: Array<{
      roll: string;
      result: string;
      stress: string;
      desc: string;
    }>;
    dicePoolRules: string[];
    difficultyRules: string[];
  };
  resistances: Resistance[];
  falloutRules: {
    trigger: string;
    relief: string[];
  };
  falloutTables: Record<string, {
    minor: FalloutEntry[];
    major: FalloutEntry[];
    severe: FalloutEntry[];
  }>;
}
