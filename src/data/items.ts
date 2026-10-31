import { BagItem, MerchantItem, MysteryBoxTier, OreType, PickaxeItem } from '../types/game';

export const baseOreCatalog: OreType[] = [
  { name: 'Blue Shard', weight: 2, value: 15, hp: 300, color: '#00c8ff', spawnWeight: 28 },
  { name: 'Skyglass', weight: 3, value: 18, hp: 330, color: '#70dfff', spawnWeight: 24 },
  { name: 'Mist Pearl', weight: 2, value: 20, hp: 360, color: '#9df3ff', spawnWeight: 22 },
  { name: 'Cyan Bloom', weight: 4, value: 24, hp: 400, color: '#4de2ff', spawnWeight: 20 },
  { name: 'Aurora Dust', weight: 3, value: 25, hp: 420, color: '#73f7ff', spawnWeight: 18 },
  { name: 'Amber Crystal', weight: 5, value: 40, hp: 600, color: '#ffaa00', spawnWeight: 16 },
  { name: 'Sun Ember', weight: 6, value: 42, hp: 640, color: '#ffb347', spawnWeight: 15 },
  { name: 'Gold Prism', weight: 7, value: 51, hp: 700, color: '#ffd166', spawnWeight: 14 },
  { name: 'Neon Quartz', weight: 10, value: 95, hp: 1000, color: '#ff0080', spawnWeight: 13 },
  { name: 'Pink Arc', weight: 11, value: 104, hp: 1050, color: '#ff5ec4', spawnWeight: 12 },
  { name: 'Violet Flare', weight: 12, value: 110, hp: 1100, color: '#d77cff', spawnWeight: 10 },
  { name: 'Emerald Shard', weight: 18, value: 180, hp: 1600, color: '#00ff66', spawnWeight: 9 },
  { name: 'Jade Pulse', weight: 19, value: 190, hp: 1660, color: '#66ffbd', spawnWeight: 8 },
  { name: 'Moonstone', weight: 22, value: 220, hp: 1750, color: '#b9d8ff', spawnWeight: 8 },
  { name: 'Void Crystal', weight: 35, value: 350, hp: 2500, color: '#9600ff', spawnWeight: 7 },
  { name: 'Prism Bloom', weight: 42, value: 430, hp: 2900, color: '#7af7ff', spawnWeight: 6 },
  { name: 'Sunflare Gem', weight: 48, value: 520, hp: 3400, color: '#ffd166', spawnWeight: 5 },
  { name: 'Nova Sapphire', weight: 54, value: 650, hp: 3900, color: '#3da5ff', spawnWeight: 5 },
  { name: 'Rift Opal', weight: 61, value: 820, hp: 4700, color: '#a18dff', spawnWeight: 4 },
  { name: 'Chronaite', weight: 68, value: 980, hp: 5400, color: '#7bffcc', spawnWeight: 4 },
  { name: 'Celestite', weight: 78, value: 1150, hp: 6200, color: '#8fd8ff', spawnWeight: 3 },
  { name: 'Astral Topaz', weight: 86, value: 1280, hp: 7000, color: '#ffb347', spawnWeight: 3 },
  { name: 'Eclipse Lens', weight: 94, value: 1450, hp: 7900, color: '#d68bff', spawnWeight: 2 },
  { name: 'Stellar Bloom', weight: 105, value: 1700, hp: 9000, color: '#7affd8', spawnWeight: 2 },
  { name: 'Singularity Core', weight: 128, value: 2200, hp: 12000, color: '#ff5fd2', spawnWeight: 1 },
];

export const basePickaxeShopItems: PickaxeItem[] = [
  { name: 'Iron Pick', power: 1, cost: 70 },
  { name: 'Copper Pick', power: 1, cost: 90 },
  { name: 'Bronze Pick', power: 2, cost: 140 },
  { name: 'Steel Pick', power: 2, cost: 200 },
  { name: 'Neon Pick', power: 2, cost: 260 },
  { name: 'Glass Pick', power: 3, cost: 330 },
  { name: 'Forge Pick', power: 3, cost: 420 },
  { name: 'Laser Pick', power: 4, cost: 520 },
  { name: 'Solar Pick', power: 4, cost: 640 },
  { name: 'Nova Pick', power: 5, cost: 770 },
  { name: 'Prism Pick', power: 6, cost: 1080 },
];

export const baseBagShopItems: BagItem[] = [
  { name: 'Small Bag', capacity: 6, cost: 80 },
  { name: 'Travel Bag', capacity: 8, cost: 110 },
  { name: 'Pocket Sack', capacity: 10, cost: 150 },
  { name: 'Med Bag', capacity: 12, cost: 200 },
  { name: 'Utility Bag', capacity: 16, cost: 270 },
  { name: 'Heavy Bag', capacity: 20, cost: 340 },
  { name: 'Carrier Pack', capacity: 24, cost: 430 },
  { name: 'Quantum Bag', capacity: 30, cost: 520 },
  { name: 'Starlight Pack', capacity: 36, cost: 620 },
  { name: 'Flux Pack', capacity: 44, cost: 760 },
  { name: 'Infinity Sack', capacity: 200, cost: 3400 },
];

export const planetBetterShopItems: Record<
  number,
  { pickaxes: PickaxeItem[]; bags: BagItem[] }
> = {
  1: {
    pickaxes: [
      { name: 'Aether Pick', power: 7, cost: 1260 },
      { name: 'Quantum Pick', power: 8, cost: 1480 },
      { name: 'Hyperion Pick', power: 9, cost: 1700 },
      { name: 'Singularity Pick', power: 10, cost: 1950 },
      { name: 'Obsidian Pick', power: 11, cost: 2200 },
      { name: 'Nebula Pick', power: 12, cost: 2500 },
      { name: 'Helix Pick', power: 13, cost: 2800 },
      { name: 'Eclipse Pick', power: 14, cost: 3150 },
      { name: 'Abyss Pick', power: 15, cost: 3500 },
      { name: 'Ultra Nova Pick', power: 16, cost: 3900 },
    ],
    bags: [
      { name: 'Abyss Pack', capacity: 52, cost: 910 },
      { name: 'Comet Pack', capacity: 62, cost: 1080 },
      { name: 'Plasma Pack', capacity: 74, cost: 1290 },
      { name: 'Omega Pack', capacity: 86, cost: 1510 },
      { name: 'Void Vault', capacity: 100, cost: 1750 },
      { name: 'Titan Pouch', capacity: 116, cost: 2000 },
      { name: 'Astral Crate', capacity: 134, cost: 2280 },
      { name: 'Nova Crate', capacity: 152, cost: 2600 },
      { name: 'Celestial Vault', capacity: 172, cost: 3000 },
      { name: 'Ultima Carry', capacity: 220, cost: 3600 },
    ],
  },
  2: {
    pickaxes: [
      'Canopy Piercer',
      'Mossline Drill',
      'Tideglass Cutter',
      'Grovebreaker',
      'Bloomforge Pick',
      'Virellium Edge',
      'Rootsplitter',
      'Rainfall Maul',
      'Verdant Comet',
      'Virellian Crown',
    ].map((name, index) => ({
      name,
      power: 17 + index,
      cost: 4100 + index * 400,
    })),
    bags: [
      'Reedwoven Pack',
      'Bloom Satchel',
      'Tide Vault',
      'Fern Carrier',
      'Canopy Crate',
      'Rainkeeper Pack',
      'Grove Hauler',
      'Virellium Hold',
      'Mangrove Vault',
      'Verdant Horizon',
    ].map((name, index) => ({
      name,
      capacity: 240 + index * 20,
      cost: 4100 + index * 400,
    })),
  },
  3: {
    pickaxes: [
      'Ashfall Driver',
      'Cinder Talon',
      'Noxstone Breaker',
      'Ember Crown',
      'Blackstar Drill',
      'Rift Hammer',
      'Obsidian Comet',
      'Duskfall Maul',
      'Crownfire Edge',
      'Noxara Singularity',
    ].map((name, index) => ({
      name,
      power: 27 + index,
      cost: 7800 + index * 600,
    })),
    bags: [
      'Ashen Cache',
      'Ember Hauler',
      'Nox Vault',
      'Cinder Crate',
      'Dusk Carrier',
      'Blackstar Hold',
      'Crownfire Pack',
      'Rift Reliquary',
      'Summit Strongbox',
      'Noxara Ark',
    ].map((name, index) => ({
      name,
      capacity: 440 + index * 30,
      cost: 7800 + index * 600,
    })),
  },
  4: {
    pickaxes: [
      'Glacial Spike',
      'Frostbite Breaker',
      'Permafrost Cutter',
      'Blizzard Drill',
      'Cryo Sunderer',
      'Icefang Pick',
      'Subzero Maul',
      'Polaris Edge',
      'Absolute Zero Pick',
      'Cryothea Sovereign',
    ].map((name, index) => ({
      name,
      power: 38 + index * 2,
      cost: 16000 + index * 1200,
    })),
    bags: [
      'Frostweft Pouch',
      'Glacier Crate',
      'Chillvault 500',
      'Borealis Carrier',
      'Shiverpack Lux',
      'Perma-Hold',
      'Cryo-Chamber Pack',
      'Icefall Vault',
      'Subzero Strongbox',
      'Cryothea Eternity Hold',
    ].map((name, index) => ({
      name,
      capacity: 750 + index * 50,
      cost: 16000 + index * 1200,
    })),
  },
  5: {
    pickaxes: [
      'Aethel Blade',
      'Singularity Driver',
      'Void Harvester',
      'Cosmic Sunderer',
      'Astral Cleaver',
      'Chrono Breaker',
      'Genesis Core Pick',
      'Omega Resonance Maul',
      'Reality Fracturer',
      'Zephyrian Godpick',
    ].map((name, index) => ({
      name,
      power: 60 + index * 4,
      cost: 35000 + index * 2500,
    })),
    bags: [
      'Voidfolded Pouch',
      'Singularity Hold',
      'Astral Vault 1000',
      'Cosmic Reliquary',
      'Aethel Weave Sack',
      'Event Horizon Pack',
      'Time-Dilation Carrier',
      'Infinite Matrix Vault',
      'Genesis Hold',
      'Zephyria Omnipack',
    ].map((name, index) => ({
      name,
      capacity: 1300 + index * 100,
      cost: 35000 + index * 2500,
    })),
  },
};

export const mysteryBoxes: Record<string, MysteryBoxTier> = {
  common: {
    label: 'COMMON',
    cost: 120,
    color: '#9ee7ff',
    rewards: [
      { name: 'Aetherite Pick', slot: 'pickaxe', stat: 'miningPower', value: 2, detail: 'Mining power +2' },
      { name: 'Lumen Pack', slot: 'backpack', stat: 'maxWeight', value: 18, detail: 'Carry capacity +18' },
      { name: 'Drifter Charm', slot: 'accessory', stat: 'speed', value: 0.3, detail: 'Movement speed +0.3' },
    ],
  },
  rare: {
    label: 'RARE',
    cost: 600,
    color: '#55d6ff',
    rewards: [
      { name: 'Tidebreaker Pick', slot: 'pickaxe', stat: 'miningPower', value: 5, detail: 'Mining power +5' },
      { name: 'Riftwalker Pack', slot: 'backpack', stat: 'maxWeight', value: 42, detail: 'Carry capacity +42' },
      { name: 'Comet Loop', slot: 'accessory', stat: 'speed', value: 0.6, detail: 'Movement speed +0.6' },
    ],
  },
  legendary: {
    label: 'LEGENDARY',
    cost: 1800,
    color: '#ffc857',
    rewards: [
      { name: 'Event Horizon Pick', slot: 'pickaxe', stat: 'miningPower', value: 10, detail: 'Mining power +10' },
      { name: 'Celestial Vaultpack', slot: 'backpack', stat: 'maxWeight', value: 90, detail: 'Carry capacity +90' },
      { name: 'Aether Crown', slot: 'accessory', stat: 'speed', value: 1.0, detail: 'Movement speed +1.0' },
    ],
  },
};

export const planet2MerchantItems: MerchantItem[] = [
  { name: 'Virellian Drill', type: 'pickaxe', amount: 18, cost: 1200000000 },
  { name: 'Tidebreaker Pack', type: 'backpack', amount: 300, cost: 1500000000 },
  { name: 'Prismstep Boots', type: 'accessory', amount: 0.5, cost: 1800000000 },
  { name: 'Verdant Core Pick', type: 'pickaxe', amount: 26, cost: 2400000000 },
];

export const planet3MerchantItems: MerchantItem[] = [
  { name: 'Noxstone Maul', type: 'pickaxe', amount: 42, cost: 24000000000 },
  { name: 'Summit Vault', type: 'backpack', amount: 900, cost: 32000000000 },
  { name: 'Starfall Greaves', type: 'accessory', amount: 1.25, cost: 27000000000 },
  { name: 'Crownfire Drill', type: 'pickaxe', amount: 58, cost: 44000000000 },
];

export {
  planet4MerchantItems,
  planet5MerchantItems,
} from './planets';


