export type Dimension =
  | 'surface'
  | 'cave'
  | 'mall_interior'
  | 'mall_upper'
  | 'robit_office'
  | 'gem_interior'
  | 'bag_interior'
  | 'pickaxe_interior'
  | 'better_bag_interior'
  | 'better_pickaxe_interior'
  | 'gambler_interior'
  | 'cryo_hermit_interior'
  | 'dresser_interior';

export interface PlayerSkin {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: 'Classic' | 'Retro' | 'Cyber' | 'Legend' | 'Cosmic';
  palette: {
    helmet: string;
    helmetShade: string;
    helmetHighlight: string;
    visor: string;
    visorGlow: string;
    visorReflection: string;
    skinTone?: string;
    hasMustache?: boolean;
    mustacheColor?: string;
    hatType: 'astronaut' | 'cap' | 'hunter' | 'ninja' | 'crown' | 'alien' | 'cyberpunk';
    torso: string;
    torsoShade: string;
    torsoDetail: string;
    collar: string;
    belt: string;
    beltBuckle: string;
    gloves: string;
    legs: string;
    legsShade: string;
    boots: string;
    bootSoles: string;
    backpack: string;
    backpackTank: string;
    auraColor?: string;
  };
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  skinId?: string;
}

export interface OreType {
  name: string;
  weight: number;
  value: number;
  hp: number;
  color: string;
  spawnWeight: number;
  glowColor?: string;
  isSpecial?: boolean;
}

export interface CaveOre {
  id: string;
  type: OreType;
  x: number;
  y: number;
  currentHp: number;
}

export interface PickaxeItem {
  name: string;
  power: number;
  cost: number;
  description?: string;
}

export interface BagItem {
  name: string;
  capacity: number;
  cost: number;
  description?: string;
}

export interface GearReward {
  name: string;
  slot: 'pickaxe' | 'backpack' | 'accessory';
  stat: 'miningPower' | 'maxWeight' | 'speed';
  value: number;
  detail: string;
  tier: string;
}

export interface MysteryBoxTier {
  label: string;
  cost: number;
  color: string;
  rewards: Omit<GearReward, 'tier'>[];
}

export interface MerchantItem {
  name: string;
  type: 'pickaxe' | 'backpack' | 'accessory';
  amount: number;
  cost: number;
  description?: string;
}

export interface DialogueChoice {
  text: string;
  action: () => void;
}

export interface DialogueData {
  speaker: string;
  speakerRole?: string;
  text: string;
  options: DialogueChoice[];
  avatarColor?: string;
}

export interface AlienNPC {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  color: string;
  accent: string;
  dialogueTree: {
    greeting: string;
    topics: {
      label: string;
      response: string;
      reward?: { type: 'money' | 'speed' | 'power'; amount: number; message: string };
    }[];
  };
}

export interface CaveSegment {
  x1: number;
  x2: number;
  floorY1: number;
  floorY2: number;
  ceilY1: number;
  ceilY2: number;
}

export interface CavePlatform {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export interface PlanetTheme {
  id: number;
  name: string;
  tagline: string;
  mallName: string;
  logoColor: string;
  logoType: 'hex' | 'wave' | 'orbit' | 'frost' | 'cosmic';
  sky: string;
  star: string;
  distant: string;
  layers: { y: number; color: string; size: number }[];
  ground: [string, string, string, string, string]; // [groundA, groundB, accent, detail, underground]
  cave: {
    background: string;
    a: string;
    b: string;
    rock: string;
    trim: string;
    floor: string;
  };
  mall: {
    wall: string;
    panel: string;
    floor: string;
    trim: string;
    accent: string;
    manager: string;
    greeting: string;
    shops: [string, string, string, string];
    keepers: [string, string, string, string];
    keeperColors: [string, string][];
    pickaxeBrand: string;
    bagBrand: string;
    mascot: {
      variant: 'orb' | 'sprout' | 'spined' | 'crystal' | 'ancient';
      skin: string;
      accent: string;
    };
  };
}

export interface GameSaveData {
  money: number;
  currentPlanet: number;
  highestUnlockedPlanet: number;
  planetTravelUnlocked: boolean;
  maxWeight: number;
  currentWeight: number;
  miningPower: number;
  speed: number;
  inventory: OreType[];
  gearInventory: GearReward[];
  equippedGear: Record<string, GearReward>;
  currentDimension: Dimension;
  unlockedFinalPickaxe: boolean;
  unlockedFinalBag: boolean;
  devMode: boolean;
  planet2MerchantNextStart: number;
  player: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    isGrounded: boolean;
    facing: 'left' | 'right';
  };
  visitedAlienNPCs?: string[];
  unlockedSkins?: string[];
  currentSkin?: string;
  savedAt: number;
}
