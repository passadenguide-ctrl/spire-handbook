export type MainTab = 'classes' | 'extra' | 'districts' | 'equipment' | 'rules';
export type AtlasMode = 'lore' | 'map';
export type LoreCategory = 'intro' | 'races' | 'domains' | 'gods';

export interface AppRoute {
  tab: MainTab;
  atlasMode: AtlasMode;
  loreTab: LoreCategory;
  raceId?: string;          // e.g. 'drow' | 'aelfir' | 'human' | 'gnoll'
  godSubsectionId?: string; // e.g. 'damnu' | 'solar-pantheon' | 'forbidden-cults'
  godFaceId?: string;       // e.g. 'limye' | 'lombre' | 'lekole'
  classId?: string;         // e.g. 'azurite'
  advanceId?: string;       // e.g. 'blood-witches'
  districtId?: string;      // e.g. 'derelictus'
  rulesResistance?: string; // e.g. 'blood' | 'mind' | 'silver' | 'shadow' | 'reputation'
  equipmentCategory?: string; // e.g. 'weapon' | 'armor' | 'all'
}

export const DEFAULT_ROUTE: AppRoute = {
  tab: 'classes',
  atlasMode: 'lore',
  loreTab: 'intro',
  raceId: 'drow',
  godSubsectionId: 'damnu',
  godFaceId: 'limye',
};

/**
 * Parses a window.location.hash or fallback pathname into a structured AppRoute.
 */
export function parseRoute(hashString: string): AppRoute {
  let hash = hashString.startsWith('#') ? hashString.slice(1) : hashString;
  if (hash.startsWith('/')) {
    hash = hash.slice(1);
  }

  // Fallback: If hash is empty, check pathname (useful if user entered direct subpath before 404 redirect)
  if (!hash && typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'spire-handbook') {
      parts.shift();
    }
    if (parts.length > 0) {
      hash = parts.join('/');
    }
  }

  const segments = hash.split('/').filter(Boolean).map(s => decodeURIComponent(s));

  if (segments.length === 0) {
    return { ...DEFAULT_ROUTE };
  }

  const first = segments[0]?.toLowerCase();

  // 1. Classes: #/classes or #/classes/:classId
  if (first === 'classes') {
    return {
      ...DEFAULT_ROUTE,
      tab: 'classes',
      classId: segments[1] || undefined,
    };
  }

  // 2. Extra Advances: #/extra or #/extra/:advanceId
  if (first === 'extra') {
    return {
      ...DEFAULT_ROUTE,
      tab: 'extra',
      advanceId: segments[1] || undefined,
    };
  }

  // 3. Map: #/map or #/map/:districtId
  if (first === 'map') {
    return {
      ...DEFAULT_ROUTE,
      tab: 'districts',
      atlasMode: 'map',
      districtId: segments[1] || undefined,
    };
  }

  // 4. Districts: #/districts or #/districts/map or #/districts/lore/...
  if (first === 'districts') {
    const second = segments[1]?.toLowerCase();
    if (second === 'map') {
      return {
        ...DEFAULT_ROUTE,
        tab: 'districts',
        atlasMode: 'map',
        districtId: segments[2] || undefined,
      };
    }
    return parseLoreSegments(segments.slice(second === 'lore' ? 2 : 1));
  }

  // 5. Lore: #/lore or #/lore/:loreTab/...
  if (first === 'lore') {
    return parseLoreSegments(segments.slice(1));
  }

  // 6. Equipment: #/equipment or #/equipment/:category
  if (first === 'equipment') {
    return {
      ...DEFAULT_ROUTE,
      tab: 'equipment',
      equipmentCategory: segments[1] || undefined,
    };
  }

  // 7. Rules: #/rules or #/rules/:resistance
  if (first === 'rules') {
    return {
      ...DEFAULT_ROUTE,
      tab: 'rules',
      rulesResistance: segments[1] || undefined,
    };
  }

  return { ...DEFAULT_ROUTE };
}

function parseLoreSegments(segments: string[]): AppRoute {
  const loreTabSegment = segments[0]?.toLowerCase();
  const validLoreTabs: LoreCategory[] = ['intro', 'races', 'domains', 'gods'];
  const loreTab: LoreCategory = validLoreTabs.includes(loreTabSegment as LoreCategory)
    ? (loreTabSegment as LoreCategory)
    : 'intro';

  const route: AppRoute = {
    ...DEFAULT_ROUTE,
    tab: 'districts',
    atlasMode: 'lore',
    loreTab,
  };

  if (loreTab === 'races') {
    if (segments[1]) {
      route.raceId = segments[1].toLowerCase();
    }
  } else if (loreTab === 'gods') {
    if (segments[1]) {
      route.godSubsectionId = segments[1].toLowerCase();
    }
    if (segments[2]) {
      route.godFaceId = segments[2].toLowerCase();
    }
  } else if (loreTab === 'domains') {
    if (segments[1]) {
      route.districtId = segments[1].toLowerCase();
    }
  }

  return route;
}

/**
 * Builds a hash path string from an AppRoute.
 */
export function buildRoutePath(route: Partial<AppRoute>): string {
  const tab = route.tab || 'classes';

  if (tab === 'classes') {
    return route.classId ? `#/classes/${route.classId}` : `#/classes`;
  }

  if (tab === 'extra') {
    return route.advanceId ? `#/extra/${route.advanceId}` : `#/extra`;
  }

  if (tab === 'districts') {
    if (route.atlasMode === 'map') {
      return route.districtId ? `#/map/${route.districtId}` : `#/map`;
    }

    const loreTab = route.loreTab || 'intro';

    if (loreTab === 'races') {
      const race = route.raceId || 'drow';
      return `#/lore/races/${race}`;
    }

    if (loreTab === 'gods') {
      const subId = route.godSubsectionId || 'damnu';
      if (subId === 'damnu') {
        const face = route.godFaceId || 'limye';
        return `#/lore/gods/damnu/${face}`;
      }
      return `#/lore/gods/${subId}`;
    }

    if (loreTab === 'domains') {
      return route.districtId ? `#/lore/domains/${route.districtId}` : `#/lore/domains`;
    }

    return `#/lore/${loreTab}`;
  }

  if (tab === 'equipment') {
    return route.equipmentCategory && route.equipmentCategory !== 'all'
      ? `#/equipment/${route.equipmentCategory}`
      : `#/equipment`;
  }

  if (tab === 'rules') {
    return route.rulesResistance ? `#/rules/${route.rulesResistance}` : `#/rules`;
  }

  return `#/classes`;
}
