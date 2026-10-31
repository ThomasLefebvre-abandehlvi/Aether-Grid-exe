import { CavePlatform, CaveSegment, MerchantItem, OreType, PlanetTheme } from '../types/game';

export const planetThemes: Record<number, PlanetTheme> = {
  1: {
    id: 1,
    name: 'Aether',
    tagline: 'The Luminous Origin',
    mallName: 'AETHER MALL',
    logoColor: '#00ffcc',
    logoType: 'hex',
    sky: '#0a0d1f',
    star: '#dfe9ff',
    distant: '#8a8fc7',
    layers: [
      { y: 110, color: '#1f2343', size: 30 },
      { y: 120, color: '#2d3258', size: 42 },
      { y: 136, color: '#3a4068', size: 52 },
    ],
    ground: ['#5b2d88', '#4c2475', '#7e4db3', '#2c163f', '#3d1d69'],
    cave: {
      background: '#090a15',
      a: '#1a1a2b',
      b: '#111524',
      rock: '#2b2d3d',
      trim: '#ff0055',
      floor: '#3a2c48',
    },
    mall: {
      wall: '#171a34',
      panel: '#232a4d',
      floor: '#20233b',
      trim: '#00ffff',
      accent: '#85efff',
      manager: 'Mr. RoBiT A-01',
      greeting: 'Welcome to Aether Mall. I keep every shop, airlock, and trade terminal in pristine order.',
      shops: ['ROBIT HUB', 'GEM RELAY', 'CARRY COSMOS', 'PICKAXE LAB'],
      keepers: ['Mr. RoBiT', 'Luma', 'Pax', 'Nova'],
      keeperColors: [
        ['#1f2238', '#00ebff'],
        ['#ffd100', '#ffe67a'],
        ['#cc00ff', '#9dffeb'],
        ['#ff6a00', '#ffd166'],
      ],
      pickaxeBrand: 'Aether',
      bagBrand: 'Aether',
      mascot: { variant: 'orb', skin: '#78db43', accent: '#00ffff' },
    },
  },
  2: {
    id: 2,
    name: 'Virelia',
    tagline: 'The Verdant Biosphere',
    mallName: 'VIRELIA OUTPOST',
    logoColor: '#7ef9a0',
    logoType: 'wave',
    sky: '#082532',
    star: '#c6fbef',
    distant: '#68d8c3',
    layers: [
      { y: 106, color: '#123d48', size: 38 },
      { y: 126, color: '#176052', size: 54 },
      { y: 144, color: '#2c8068', size: 66 },
    ],
    ground: ['#277b62', '#205e53', '#59b78a', '#153d3b', '#102e34'],
    cave: {
      background: '#071a20',
      a: '#12313a',
      b: '#0c252d',
      rock: '#2b5552',
      trim: '#46d9ba',
      floor: '#17433d',
    },
    mall: {
      wall: '#12373b',
      panel: '#20594e',
      floor: '#214b43',
      trim: '#73f9ac',
      accent: '#caff72',
      manager: 'Mr. RoBiT V-02',
      greeting: 'Welcome to Virelia Outpost. I oversee trade amidst the cosmic groves and tidal decks.',
      shops: ['ROBIT GREEN', 'BLOOM MARKET', 'FERN FREIGHT', 'TIDE TOOLS'],
      keepers: ['Mr. RoBiT', 'Moss', 'Tide', 'Fern'],
      keeperColors: [
        ['#21403d', '#73f9ac'],
        ['#3cbd9a', '#d9f4a1'],
        ['#236c78', '#8af3dd'],
        ['#587a3c', '#caff72'],
      ],
      pickaxeBrand: 'Tideglass',
      bagBrand: 'Bloomwoven',
      mascot: { variant: 'sprout', skin: '#57cf63', accent: '#caff72' },
    },
  },
  3: {
    id: 3,
    name: 'Noxara',
    tagline: 'The Obsidian Peaks',
    mallName: 'NOXARA MALL',
    logoColor: '#ffc16a',
    logoType: 'orbit',
    sky: '#1a1027',
    star: '#ffe2c2',
    distant: '#ff876a',
    layers: [
      { y: 108, color: '#35203c', size: 42 },
      { y: 128, color: '#563040', size: 60 },
      { y: 148, color: '#754744', size: 72 },
    ],
    ground: ['#79513b', '#593c39', '#c18459', '#322734', '#382433'],
    cave: {
      background: '#120e1b',
      a: '#29202d',
      b: '#1c1725',
      rock: '#594044',
      trim: '#ff7961',
      floor: '#52343b',
    },
    mall: {
      wall: '#281b2a',
      panel: '#49303c',
      floor: '#362632',
      trim: '#ffc16a',
      accent: '#ff916f',
      manager: 'Mr. RoBiT N-03',
      greeting: 'Welcome to Noxara Mall. I monitor the volcanic heat, summits, and cinder shipments.',
      shops: ['ROBIT ASHFALL', 'EMBER VAULT', 'SUMMIT PACKS', 'CINDER FORGE'],
      keepers: ['Mr. RoBiT', 'Ember', 'Cinder', 'Ash'],
      keeperColors: [
        ['#332431', '#ffc16a'],
        ['#9b553d', '#ffd17a'],
        ['#584054', '#e3a5ff'],
        ['#643b34', '#ff916f'],
      ],
      pickaxeBrand: 'Cinder',
      bagBrand: 'Ashen',
      mascot: { variant: 'spined', skin: '#70c94b', accent: '#ffc16a' },
    },
  },
  4: {
    id: 4,
    name: 'Cryothea',
    tagline: 'The Glacial Expanse',
    mallName: 'CRYOTHEA STATION',
    logoColor: '#4bf0ff',
    logoType: 'frost',
    sky: '#061726',
    star: '#c2f8ff',
    distant: '#4ad9ff',
    layers: [
      { y: 104, color: '#0d2d42', size: 40 },
      { y: 122, color: '#134763', size: 56 },
      { y: 142, color: '#1c6287', size: 70 },
    ],
    ground: ['#285d77', '#1b4458', '#54a3c7', '#102733', '#0b1c26'],
    cave: {
      background: '#04101c',
      a: '#0c2436',
      b: '#071824',
      rock: '#1e485e',
      trim: '#4bf0ff',
      floor: '#163647',
    },
    mall: {
      wall: '#0d2838',
      panel: '#1b455c',
      floor: '#173648',
      trim: '#4bf0ff',
      accent: '#a5f7ff',
      manager: 'Mr. RoBiT C-04',
      greeting: 'Welcome to Cryothea Station. Temperature strictly regulated at absolute trade equilibrium.',
      shops: ['ROBIT FROST', 'AURORA GEMS', 'BLIZZARD BAGS', 'PERMAFROST PICKS'],
      keepers: ['Mr. RoBiT', 'Glacia', 'Boreal', 'Shiver'],
      keeperColors: [
        ['#142f3d', '#4bf0ff'],
        ['#2cb0d1', '#c7f8ff'],
        ['#175173', '#72e3ff'],
        ['#36789e', '#a8f2ff'],
      ],
      pickaxeBrand: 'Glacial',
      bagBrand: 'CryoWeave',
      mascot: { variant: 'crystal', skin: '#38c5d9', accent: '#e2fcff' },
    },
  },
  5: {
    id: 5,
    name: 'Zephyria',
    tagline: 'The Cradle of Ancients',
    mallName: 'ZEPHYRIA SANCTUARY',
    logoColor: '#f783ff',
    logoType: 'cosmic',
    sky: '#180929',
    star: '#ffd6fa',
    distant: '#da5df5',
    layers: [
      { y: 102, color: '#31144a', size: 44 },
      { y: 120, color: '#4a1b70', size: 60 },
      { y: 140, color: '#68269e', size: 75 },
    ],
    ground: ['#652b75', '#491d57', '#a850be', '#2b1036', '#1c0824'],
    cave: {
      background: '#0e0417',
      a: '#200c30',
      b: '#140621',
      rock: '#471c66',
      trim: '#ff6bf0',
      floor: '#3b1654',
    },
    mall: {
      wall: '#260f38',
      panel: '#431961',
      floor: '#321447',
      trim: '#f783ff',
      accent: '#ffbcfd',
      manager: 'Mr. RoBiT Z-05',
      greeting: 'Welcome to Zephyria Sanctuary. Ancient alien technology synthesizes with supreme mining gear here.',
      shops: ['ROBIT ASTRAL', 'VOID RELICS', 'ETERNITY PACKS', 'SINGULARITY FORGE'],
      keepers: ['Mr. RoBiT', 'Vael', 'Astra', 'Chronos'],
      keeperColors: [
        ['#2b123d', '#f783ff'],
        ['#8f2bbd', '#ffd6fa'],
        ['#5e1c8a', '#ff94f3'],
        ['#ad38c9', '#ffe6fd'],
      ],
      pickaxeBrand: 'Singularity',
      bagBrand: 'AethelVoid',
      mascot: { variant: 'ancient', skin: '#9b30c7', accent: '#ffe3fd' },
    },
  },
};

export const planetRouteCosts: Record<number, number> = {
  2: 6000000000, // $6B
  3: 100000000000, // $100B
  4: 1800000000000, // $1.8T
  5: 35000000000000, // $35T
};

export const ultimatePlanet5RocketRepairCost = 500000000000000; // $500T on planet 5 to unlock permanent travel

// Secret merchant inventory for Planet 4 (Cryo Hermit)
export const planet4MerchantItems: MerchantItem[] = [
  { name: 'Absolute Zero Core', type: 'pickaxe', amount: 120, cost: 850000000000, description: 'Shatters solid permafrost veins' },
  { name: 'Aurora Borealis Hold', type: 'backpack', amount: 2500, cost: 950000000000, description: 'Cryo-insulated hyper dimensional bag' },
  { name: 'Froststep Skates', type: 'accessory', amount: 2.5, cost: 1200000000000, description: 'Glides over icy friction-free terrain' },
  { name: 'Sub-Zero Singularity Drill', type: 'pickaxe', amount: 220, cost: 1800000000000, description: 'Freezes crystal lattices for instant extraction' },
];

// Secret merchant inventory for Planet 5 (Archon Vael / Void Runner)
export const planet5MerchantItems: MerchantItem[] = [
  { name: 'Genesis Cosmic Maul', type: 'pickaxe', amount: 650, cost: 18000000000000, description: 'Channel the primordial force of celestial birth' },
  { name: 'Infinity Void Chamber', type: 'backpack', amount: 15000, cost: 24000000000000, description: 'Infinite fold pocket capacity' },
  { name: 'Warp-Stride Graviton Boots', type: 'accessory', amount: 5.0, cost: 28000000000000, description: 'Distorts space-time for supersonic sprinting' },
  { name: 'Omega Reality Sunderer', type: 'pickaxe', amount: 1200, cost: 42000000000000, description: 'The absolute pinnacle of mining engineering' },
];

// Planet exclusive ores
export const planetExclusiveOres: Record<number, OreType[]> = {
  2: [
    { name: 'Verdantite', weight: 14, value: 260, hp: 1800, color: '#73ff9a', spawnWeight: 24 },
    { name: 'Tideglass', weight: 20, value: 380, hp: 2450, color: '#55e8d2', spawnWeight: 19 },
    { name: 'Bloom Quartz', weight: 28, value: 540, hp: 3300, color: '#c2ff72', spawnWeight: 14 },
    { name: 'Virellium Core', weight: 42, value: 860, hp: 4800, color: '#54b8ff', spawnWeight: 8 },
  ],
  3: [
    { name: 'Noxstone', weight: 30, value: 1100, hp: 5200, color: '#ff785d', spawnWeight: 24 },
    { name: 'Emberglass', weight: 42, value: 1650, hp: 6900, color: '#ffc15c', spawnWeight: 18 },
    { name: 'Crown Opal', weight: 58, value: 2400, hp: 8600, color: '#d99aff', spawnWeight: 12 },
    { name: 'Summit Star', weight: 82, value: 3600, hp: 11200, color: '#fff0a8', spawnWeight: 6 },
  ],
  4: [
    { name: 'Frost Prism', weight: 48, value: 4500, hp: 12000, color: '#7df9ff', spawnWeight: 25 },
    { name: 'Glacial Core', weight: 70, value: 7200, hp: 16500, color: '#4dc2ff', spawnWeight: 18 },
    { name: 'Borealis Pearl', weight: 95, value: 11000, hp: 22000, color: '#a5f7ff', spawnWeight: 12 },
    { name: 'Cryo-Diamond', weight: 130, value: 18000, hp: 32000, color: '#ffffff', spawnWeight: 5 },
  ],
  5: [
    { name: 'Zephyr Bloom', weight: 110, value: 25000, hp: 38000, color: '#ea73ff', spawnWeight: 24 },
    { name: 'Cosmic Amber', weight: 160, value: 42000, hp: 52000, color: '#ffab40', spawnWeight: 18 },
    { name: 'Singularity Shard', weight: 220, value: 75000, hp: 75000, color: '#a13eff', spawnWeight: 11 },
    { name: 'Genesis Star', weight: 350, value: 140000, hp: 120000, color: '#ffe652', spawnWeight: 4 },
  ],
};

// Planet 4 Mountain Platforms (Glacial Ice Spires)
export const planet4IcePlatforms: CavePlatform[] = Array.from({ length: 16 }, (_, index) => ({
  x: 820 + index * 36,
  y: 160 - index * 22,
  width: 82,
  height: 16,
  color: '#3482a6',
}));
export const planet4Summit = planet4IcePlatforms[planet4IcePlatforms.length - 1];

// Dynamic Cave Terrain Profiles for each planet:
// Defines undulating slopes, rising chambers, deep pits, and multi-tier platforms!
export interface PlanetCaveTerrain {
  segments: CaveSegment[];
  platforms: CavePlatform[];
  worldWidth: number;
  shaftX: number;
}

export function generatePlanetCaveTerrain(planet: number): PlanetCaveTerrain {
  const shaftX = 760;
  
  if (planet === 1) {
    // Aether: Drops down into a crystal hollow valley (y: 200 -> 280), climbs up to an elevated cavern shelf (y: 180)
    const worldWidth = 2400;
    const segments: CaveSegment[] = [
      { x1: shaftX - 40, x2: shaftX + 100, floorY1: 210, floorY2: 210, ceilY1: 170, ceilY2: 170 },
      { x1: shaftX + 100, x2: 1100, floorY1: 210, floorY2: 275, ceilY1: 170, ceilY2: 155 }, // downward slope into deep crystal basin
      { x1: 1100, x2: 1450, floorY1: 275, floorY2: 275, ceilY1: 155, ceilY2: 150 }, // wide deep basin
      { x1: 1450, x2: 1800, floorY1: 275, floorY2: 195, ceilY1: 150, ceilY2: 135 }, // upward ramp climbing out
      { x1: 1800, x2: 2400, floorY1: 195, floorY2: 195, ceilY1: 135, ceilY2: 135 }, // high terrace
    ];
    const platforms: CavePlatform[] = [
      { x: 1180, y: 220, width: 80, height: 14, color: '#4a3b61' },
      { x: 1320, y: 190, width: 90, height: 14, color: '#4a3b61' },
      { x: 1950, y: 155, width: 85, height: 14, color: '#563e75' },
    ];
    return { segments, platforms, worldWidth, shaftX };
  }

  if (planet === 2) {
    // Virelia: Undulating mangrove roots, rising terraces and water hollows
    const worldWidth = 2600;
    const segments: CaveSegment[] = [
      { x1: shaftX - 40, x2: shaftX + 80, floorY1: 210, floorY2: 210, ceilY1: 170, ceilY2: 170 },
      { x1: shaftX + 80, x2: 1050, floorY1: 210, floorY2: 165, ceilY1: 170, ceilY2: 115 }, // rises upward
      { x1: 1050, x2: 1350, floorY1: 165, floorY2: 260, ceilY1: 115, ceilY2: 140 }, // plunges down into root pool
      { x1: 1350, x2: 1750, floorY1: 260, floorY2: 260, ceilY1: 140, ceilY2: 140 }, // wide swamp floor
      { x1: 1750, x2: 2100, floorY1: 260, floorY2: 180, ceilY1: 140, ceilY2: 120 }, // ascends upward
      { x1: 2100, x2: 2600, floorY1: 180, floorY2: 180, ceilY1: 120, ceilY2: 120 },
    ];
    const platforms: CavePlatform[] = [
      { x: 1200, y: 210, width: 75, height: 14, color: '#276356' },
      { x: 1450, y: 200, width: 110, height: 14, color: '#276356' },
      { x: 1620, y: 180, width: 85, height: 14, color: '#276356' },
      { x: 2250, y: 140, width: 90, height: 14, color: '#317869' },
    ];
    return { segments, platforms, worldWidth, shaftX };
  }

  if (planet === 3) {
    // Noxara: Jagged volcanic fissure plunging downward into molten basalt chasm
    const worldWidth = 2800;
    const segments: CaveSegment[] = [
      { x1: shaftX - 40, x2: shaftX + 90, floorY1: 210, floorY2: 210, ceilY1: 170, ceilY2: 170 },
      { x1: shaftX + 90, x2: 1100, floorY1: 210, floorY2: 280, ceilY1: 170, ceilY2: 160 }, // steep drop
      { x1: 1100, x2: 1400, floorY1: 280, floorY2: 340, ceilY1: 160, ceilY2: 180 }, // deeper plunge!
      { x1: 1400, x2: 1850, floorY1: 340, floorY2: 340, ceilY1: 180, ceilY2: 170 }, // abyss floor
      { x1: 1850, x2: 2300, floorY1: 340, floorY2: 210, ceilY1: 170, ceilY2: 130 }, // steep magma climb
      { x1: 2300, x2: 2800, floorY1: 210, floorY2: 210, ceilY1: 130, ceilY2: 130 },
    ];
    const platforms: CavePlatform[] = [
      { x: 1150, y: 240, width: 85, height: 16, color: '#633d43' },
      { x: 1450, y: 270, width: 95, height: 16, color: '#633d43' },
      { x: 1650, y: 230, width: 90, height: 16, color: '#633d43' },
      { x: 2000, y: 270, width: 80, height: 16, color: '#754b52' },
      { x: 2450, y: 170, width: 100, height: 16, color: '#754b52' },
    ];
    return { segments, platforms, worldWidth, shaftX };
  }

  if (planet === 4) {
    // Cryothea: Ascending glacial cave with frozen ramps rising up to high crystal stalactite spires, then sloping down to an icy rift
    const worldWidth = 3000;
    const segments: CaveSegment[] = [
      { x1: shaftX - 40, x2: shaftX + 80, floorY1: 210, floorY2: 210, ceilY1: 170, ceilY2: 170 },
      { x1: shaftX + 80, x2: 1150, floorY1: 210, floorY2: 140, ceilY1: 170, ceilY2: 80 }, // major upward glacial climb!
      { x1: 1150, x2: 1550, floorY1: 140, floorY2: 140, ceilY1: 80, ceilY2: 70 }, // high ice plateau
      { x1: 1550, x2: 2000, floorY1: 140, floorY2: 290, ceilY1: 70, ceilY2: 150 }, // icy canyon slide down
      { x1: 2000, x2: 2450, floorY1: 290, floorY2: 290, ceilY1: 150, ceilY2: 140 }, // subzero rift floor
      { x1: 2450, x2: 3000, floorY1: 290, floorY2: 200, ceilY1: 140, ceilY2: 110 }, // frozen exit ramp
    ];
    const platforms: CavePlatform[] = [
      { x: 1250, y: 95, width: 85, height: 14, color: '#275e7a' },
      { x: 1420, y: 75, width: 75, height: 14, color: '#275e7a' },
      { x: 1750, y: 220, width: 90, height: 14, color: '#2b6f91' },
      { x: 2150, y: 230, width: 105, height: 14, color: '#2b6f91' },
      { x: 2650, y: 230, width: 85, height: 14, color: '#357d9f' },
    ];
    return { segments, platforms, worldWidth, shaftX };
  }

  // Planet 5 (Zephyria): Multi-tier ancient alien subterranean ruins with winding ceremonial ramps and grand altars
  const worldWidth = 3200;
  const segments: CaveSegment[] = [
    { x1: shaftX - 40, x2: shaftX + 90, floorY1: 210, floorY2: 210, ceilY1: 170, ceilY2: 170 },
    { x1: shaftX + 90, x2: 1100, floorY1: 210, floorY2: 150, ceilY1: 170, ceilY2: 90 }, // upward ceremonial ascent
    { x1: 1100, x2: 1450, floorY1: 150, floorY2: 150, ceilY1: 90, ceilY2: 80 }, // high shrine corridor
    { x1: 1450, x2: 1850, floorY1: 150, floorY2: 310, ceilY1: 80, ceilY2: 160 }, // deep void descent
    { x1: 1850, x2: 2350, floorY1: 310, floorY2: 310, ceilY1: 160, ceilY2: 150 }, // subterranean alien plaza
    { x1: 2350, x2: 2750, floorY1: 310, floorY2: 190, ceilY1: 150, ceilY2: 110 }, // staircase out
    { x1: 2750, x2: 3200, floorY1: 190, floorY2: 190, ceilY1: 110, ceilY2: 110 }, // sanctum vault
  ];
  const platforms: CavePlatform[] = [
    { x: 1200, y: 110, width: 90, height: 14, color: '#57227d' },
    { x: 1550, y: 210, width: 80, height: 14, color: '#57227d' },
    { x: 1950, y: 250, width: 120, height: 16, color: '#722da3' },
    { x: 2150, y: 200, width: 90, height: 14, color: '#722da3' },
    { x: 2500, y: 240, width: 80, height: 14, color: '#8837c2' },
    { x: 2900, y: 140, width: 110, height: 16, color: '#8837c2' },
  ];
  return { segments, platforms, worldWidth, shaftX };
}

// Function to calculate exact cave floor and ceiling at any coordinate X
export function getCaveHeightAt(terrain: PlanetCaveTerrain, x: number): { floorY: number; ceilY: number } {
  for (const seg of terrain.segments) {
    if (x >= seg.x1 && x <= seg.x2) {
      const t = (x - seg.x1) / Math.max(1, seg.x2 - seg.x1);
      const floorY = seg.floorY1 + t * (seg.floorY2 - seg.floorY1);
      const ceilY = seg.ceilY1 + t * (seg.ceilY2 - seg.ceilY1);
      return { floorY, ceilY };
    }
  }
  const last = terrain.segments[terrain.segments.length - 1];
  return { floorY: last.floorY2, ceilY: last.ceilY2 };
}
