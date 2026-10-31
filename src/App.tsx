import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimension,
  GearReward,
  MerchantItem,
  OreType,
  PickaxeItem,
  BagItem,
  Player,
  PlayerSkin,
  CaveOre,
  DialogueData,
} from './types/game';
import {
  baseBagShopItems,
  baseOreCatalog,
  basePickaxeShopItems,
  mysteryBoxes,
  planet2MerchantItems,
  planet3MerchantItems,
  planet4MerchantItems,
  planet5MerchantItems,
  planetBetterShopItems,
} from './data/items';
import {
  generatePlanetCaveTerrain,
  getCaveHeightAt,
  planet4IcePlatforms,
  planetExclusiveOres,
  planetRouteCosts,
  planetThemes,
  ultimatePlanet5RocketRepairCost,
} from './data/planets';
import { alienCivilizationNPCs } from './data/alienCivilization';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { GameCanvas } from './components/GameCanvas';
import { DialogueModal } from './components/DialogueModal';
import { ShopCardItem, ShopModal } from './components/ShopModal';
import { BoxModal } from './components/BoxModal';
import { SpeedModal } from './components/SpeedModal';
import { PlanetTravelModal } from './components/PlanetTravelModal';
import { FeedbackModal } from './components/FeedbackModal';
import { MenuDropdown } from './components/MenuDropdown';
import { DresserModal } from './components/DresserModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const LOCAL_STORAGE_KEY = 'aether_grid_save_v2';

export default function App() {
  // Game Stats
  const [money, setMoney] = useState<number>(200);
  const [devMode, setDevMode] = useState<boolean>(false);
  const [maxWeight, setMaxWeight] = useState<number>(10);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [miningPower, setMiningPower] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1.6);
  const [inventory, setInventory] = useState<OreType[]>([]);
  const [gearInventory, setGearInventory] = useState<GearReward[]>([]);
  const [equippedGear, setEquippedGear] = useState<Record<string, GearReward>>({});

  // Progression & Planets (1 to 5)
  const [currentPlanet, setCurrentPlanet] = useState<number>(1);
  const [highestUnlockedPlanet, setHighestUnlockedPlanet] = useState<number>(1);
  const [planetTravelUnlocked, setPlanetTravelUnlocked] = useState<boolean>(false);
  const [currentDimension, setCurrentDimension] = useState<Dimension>('surface');
  const [unlockedFinalPickaxe, setUnlockedFinalPickaxe] = useState<boolean>(false);
  const [unlockedFinalBag, setUnlockedFinalBag] = useState<boolean>(false);
  const [visitedAlienNPCs, setVisitedAlienNPCs] = useState<string[]>([]);

  // Timed merchant on Planet 2
  const [planet2MerchantNextStart, setPlanet2MerchantNextStart] = useState<number>(
    Date.now() + 600000
  );
  const [planet2MerchantActive, setPlanet2MerchantActive] = useState<boolean>(false);

  // Mobile Controls & HUD
  const [mobileControlsActive, setMobileControlsActive] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [dresserModalOpen, setDresserModalOpen] = useState<boolean>(false);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['default']);
  const [currentSkinId, setCurrentSkinId] = useState<string>('default');
  const [travelModalOpen, setTravelModalOpen] = useState<boolean>(false);
  const [boxModalOpen, setBoxModalOpen] = useState<boolean>(false);
  const [speedModalOpen, setSpeedModalOpen] = useState<boolean>(false);
  const [shopModalOpen, setShopModalOpen] = useState<boolean>(false);
  const [shopModalData, setShopModalData] = useState<{
    title: string;
    subtitle?: string;
    items: ShopCardItem[];
  }>({ title: '', items: [] });

  // Dialogue
  const [activeDialogue, setActiveDialogue] = useState<DialogueData | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio System
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioKey = useRef<string>('');

  // World physics & Player
  const surfaceGroundY = 190;
  const indoorGroundY = 210;
  const caveShaftX = 760;
  const gravity = 0.42;
  const jumpForce = -7.6;

  const [player, setPlayer] = useState<Player>({
    x: 60,
    y: surfaceGroundY - 24,
    width: 14,
    height: 24,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right',
    skinId: 'default',
  });

  // Cave Ores & Mining
  const [caveOres, setCaveOres] = useState<CaveOre[]>([]);
  const [miningOreIndex, setMiningOreIndex] = useState<number | null>(null);
  const [miningAnimTimer, setMiningAnimTimer] = useState<number>(0);
  const [breathingTimer, setBreathingTimer] = useState<number>(0);

  // Ascent cutscene from cave
  const [cutsceneActive, setCutsceneActive] = useState<boolean>(false);
  const [cutsceneTimer, setCutsceneTimer] = useState<number>(0);

  // Controls input state
  const keysPressed = useRef<Record<string, boolean>>({});
  const mobileInput = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Toast message trigger
  const showMessage = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Save progress automatically to localStorage
  const saveProgress = useCallback(() => {
    const saveData = {
      money,
      devMode,
      maxWeight,
      currentWeight,
      miningPower,
      speed,
      inventory,
      gearInventory,
      equippedGear,
      currentPlanet,
      highestUnlockedPlanet,
      planetTravelUnlocked,
      currentDimension,
      unlockedFinalPickaxe,
      unlockedFinalBag,
      visitedAlienNPCs,
      planet2MerchantNextStart,
      player,
      unlockedSkins,
      currentSkin: currentSkinId,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
    } catch {
      // ignore
    }
  }, [
    money,
    devMode,
    maxWeight,
    currentWeight,
    miningPower,
    speed,
    inventory,
    gearInventory,
    equippedGear,
    currentPlanet,
    highestUnlockedPlanet,
    planetTravelUnlocked,
    currentDimension,
    unlockedFinalPickaxe,
    unlockedFinalBag,
    visitedAlienNPCs,
    planet2MerchantNextStart,
    player,
    unlockedSkins,
    currentSkinId,
  ]);

  // Load progress from localStorage on initial mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setMoney(Number(d.money ?? 200));
        setDevMode(Boolean(d.devMode));
        setMaxWeight(Number(d.maxWeight ?? 10));
        setCurrentWeight(Number(d.currentWeight ?? 0));
        setMiningPower(Number(d.miningPower ?? 1));
        setSpeed(Number(d.speed ?? 1.6));
        setInventory(Array.isArray(d.inventory) ? d.inventory : []);
        setGearInventory(Array.isArray(d.gearInventory) ? d.gearInventory : []);
        setEquippedGear(d.equippedGear && typeof d.equippedGear === 'object' ? d.equippedGear : {});
        setCurrentPlanet(Math.min(5, Math.max(1, Number(d.currentPlanet ?? 1))));
        setHighestUnlockedPlanet(Math.min(5, Math.max(1, Number(d.highestUnlockedPlanet ?? 1))));
        setPlanetTravelUnlocked(Boolean(d.planetTravelUnlocked));
        setCurrentDimension(d.currentDimension || 'surface');
        setUnlockedFinalPickaxe(Boolean(d.unlockedFinalPickaxe));
        setUnlockedFinalBag(Boolean(d.unlockedFinalBag));
        setVisitedAlienNPCs(Array.isArray(d.visitedAlienNPCs) ? d.visitedAlienNPCs : []);
        setPlanet2MerchantNextStart(Number(d.planet2MerchantNextStart ?? Date.now() + 600000));
        const loadedSkins = Array.isArray(d.unlockedSkins) && d.unlockedSkins.length > 0 ? d.unlockedSkins : ['default'];
        const loadedSkinId = d.currentSkin || d.currentSkinId || 'default';
        setUnlockedSkins(loadedSkins);
        setCurrentSkinId(loadedSkinId);
        if (d.player) {
          setPlayer((p) => ({
            ...p,
            x: Number(d.player.x ?? 60),
            y: Number(d.player.y ?? surfaceGroundY - 24),
            facing: d.player.facing || 'right',
            skinId: loadedSkinId,
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Periodic and beforeunload auto-save
  useEffect(() => {
    const timer = setInterval(saveProgress, 5000);
    window.addEventListener('beforeunload', saveProgress);
    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeunload', saveProgress);
    };
  }, [saveProgress]);

  // Generate dynamic cave ores along the sloped terrain of the active planet
  const generateCaveOresForPlanet = useCallback((planet: number) => {
    const terrain = generatePlanetCaveTerrain(planet);
    const ores: CaveOre[] = [];
    const exclusive = planetExclusiveOres[planet] || [];
    const pool = exclusive.length > 0 ? exclusive : baseOreCatalog;

    const oreCount = 24 + Math.floor(Math.random() * 8);
    for (let i = 0; i < oreCount; i++) {
      const type = pool[Math.floor(Math.random() * pool.length)];
      // Spawn along the cavern from shaft to end
      const ox = terrain.shaftX + 60 + Math.random() * (terrain.worldWidth - terrain.shaftX - 120);
      const { floorY, ceilY } = getCaveHeightAt(terrain, ox);

      // Either on the sloped floor, on sloped ceiling, or on a platform
      const attachToCeiling = Math.random() < 0.28;
      const oy = attachToCeiling
        ? ceilY + 12 + Math.random() * 8
        : floorY - 14 - Math.random() * 8;

      ores.push({
        id: `ore_${i}_${Date.now()}`,
        type,
        x: Math.round(ox),
        y: Math.round(oy),
        currentHp: type.hp,
      });
    }

    // Also spawn rare cluster crystals on platforms!
    terrain.platforms.forEach((plat, pIdx) => {
      const type = pool[pool.length - 1 - (pIdx % 2)];
      ores.push({
        id: `plat_ore_${pIdx}_${Date.now()}`,
        type,
        x: Math.round(plat.x + plat.width / 2),
        y: Math.round(plat.y - 12),
        currentHp: type.hp,
      });
    });

    setCaveOres(ores);
  }, []);

  // Sync background music according to dimension and planet
  const syncBgm = useCallback(() => {
    const isMall =
      currentDimension === 'mall_interior' ||
      currentDimension === 'mall_upper' ||
      currentDimension === 'robit_office' ||
      currentDimension === 'gem_interior' ||
      currentDimension === 'bag_interior' ||
      currentDimension === 'pickaxe_interior' ||
      currentDimension === 'better_bag_interior' ||
      currentDimension === 'better_pickaxe_interior' ||
      currentDimension === 'gambler_interior' ||
      currentDimension === 'cryo_hermit_interior';

    let targetFile = '/bgm1.mp3';
    if (isMall) {
      targetFile = '/bgmmal.mp3';
    } else if (currentPlanet === 2 || currentPlanet === 5) {
      targetFile = '/bgm2.mp3';
    } else if (currentPlanet === 3) {
      targetFile = '/bgm3.mp3';
    } else if (currentPlanet === 4) {
      targetFile = '/bgm1.mp3';
    }

    if (currentAudioKey.current === targetFile) return;
    currentAudioKey.current = targetFile;

    if (!audioRef.current) {
      audioRef.current = new Audio(targetFile);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    } else {
      audioRef.current.src = targetFile;
    }

    if (!audioMuted) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentDimension, currentPlanet, audioMuted]);

  useEffect(() => {
    syncBgm();
  }, [syncBgm]);

  const toggleAudio = () => {
    setAudioMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) audioRef.current.pause();
        else audioRef.current.play().catch(() => {});
      }
      return next;
    });
  };

  // Timed merchant on Planet 2 (visits for 90s every 10 min)
  useEffect(() => {
    const checkMerchant = () => {
      const now = Date.now();
      const duration = 90000;
      const cycle = 600000;
      if (now >= planet2MerchantNextStart + duration) {
        const elapsed = Math.floor((now - planet2MerchantNextStart - duration) / cycle) + 1;
        setPlanet2MerchantNextStart((prev) => prev + elapsed * cycle);
      }
      setPlanet2MerchantActive(
        now >= planet2MerchantNextStart && now < planet2MerchantNextStart + duration
      );
    };
    checkMerchant();
    const interval = setInterval(checkMerchant, 1000);
    return () => clearInterval(interval);
  }, [planet2MerchantNextStart]);

  // Activate infinite money cheat
  const activateInfiniteMoneyCheat = () => {
    setDevMode(true);
    setMoney(999999999999999);
    saveProgress();
  };

  // Reset Progress confirmation
  
  // Buy Skin
  const handleBuySkin = (skin: PlayerSkin) => {
    if (!devMode && money < skin.cost) {
      showMessage(`Need $${skin.cost.toLocaleString()} for ${skin.name}!`);
      return;
    }
    if (!devMode) setMoney((m) => m - skin.cost);
    setUnlockedSkins((prev) => (prev.includes(skin.id) ? prev : [...prev, skin.id]));
    setCurrentSkinId(skin.id);
    setPlayer((p) => ({ ...p, skinId: skin.id }));
    showMessage(`🎉 Unlocked & equipped ${skin.name}!`);
    saveProgress();
  };
const handleResetProgress = () => {
  if (
    !window.confirm(
      'Are you sure you want to reset your Aether Grid journey? All crystals, gear, and planet progress will be restored to beginning.'
    )
  ) {
    return;
  }

  // 1. Core stats
  setMoney(200);
  setDevMode(false);
  setMaxWeight(10);
  setCurrentWeight(0);
  setMiningPower(1);
  setSpeed(1.6);
  setInventory([]);
  setGearInventory([]);
  setEquippedGear({});

  // 2. Progression
  setCurrentPlanet(1);
  setHighestUnlockedPlanet(1);
  setPlanetTravelUnlocked(false);
  setCurrentDimension('surface');
  setUnlockedFinalPickaxe(false);
  setUnlockedFinalBag(false);
  setVisitedAlienNPCs([]);
  setPlanet2MerchantNextStart(Date.now() + 600000);
  setPlanet2MerchantActive(false);

  // 3. Skins
  setUnlockedSkins(['default']);
  setCurrentSkinId('default');

  // 4. Player
  setPlayer({
    x: 60,
    y: surfaceGroundY - 24,
    width: 14,
    height: 24,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right',
    skinId: 'default',
  });

  // 5. Cave / mining / cutscene runtime state
  setCaveOres([]);
  setMiningOreIndex(null);
  setMiningAnimTimer(0);
  setBreathingTimer(0);
  setCutsceneActive(false);
  setCutsceneTimer(0);

  // 6. UI state
  setActiveDialogue(null);
  setShopModalOpen(false);
  setShopModalData(null);
  setBoxModalOpen(false);
  setSpeedModalOpen(false);
  setTravelModalOpen(false);
  setDresserModalOpen(false);
  setFeedbackOpen(false);
  setMenuOpen(false);

  // 7. Held inputs
  keysPressed.current = {};
  mobileInput.current = { left: false, right: false, jump: false };

  // 8. Wipe the save, then write a clean one so the autosave can't resurrect old data
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        money: 200,
        devMode: false,
        maxWeight: 10,
        currentWeight: 0,
        miningPower: 1,
        speed: 1.6,
        inventory: [],
        gearInventory: [],
        equippedGear: {},
        currentPlanet: 1,
        highestUnlockedPlanet: 1,
        planetTravelUnlocked: false,
        currentDimension: 'surface',
        unlockedFinalPickaxe: false,
        unlockedFinalBag: false,
        visitedAlienNPCs: [],
        planet2MerchantNextStart: Date.now() + 600000,
        player: { x: 60, y: surfaceGroundY - 24, facing: 'right' },
        unlockedSkins: ['default'],
        currentSkin: 'default',
        savedAt: Date.now(),
      })
    );
  } catch {
    // ignore
  }

  showMessage('Journey has been reset to starting state.');
};
  // Equip Skin
  const handleEquipSkin = (skinId: string) => {
    setCurrentSkinId(skinId);
    setPlayer((p) => ({ ...p, skinId }));
    showMessage('Equipped suit!');
    saveProgress();
  };

  // Travel to an unlocked planet
  const handleSelectPlanet = (planet: number) => {
    if (planet < 1 || planet > 5) return;
    if (planet > highestUnlockedPlanet && !devMode) {
      showMessage(`Planet ${planet} is locked. Repair planetary rocket routes first!`);
      return;
    }
    setCurrentPlanet(planet);
    setCurrentDimension('surface');
    setPlayer((p) => ({
      ...p,
      x: 350,
      y: surfaceGroundY - p.height,
      vx: 0,
      vy: 0,
      isGrounded: true,
    }));
    setTravelModalOpen(false);
    showMessage(`Arrived on Planet ${planet}: ${planetThemes[planet].name}!`);
    saveProgress();
  };

  // Rocket Route Repair and Travel dialogue logic
  const openRocketDialogue = () => {
    const nextPlanet = currentPlanet + 1;
    const theme = planetThemes[currentPlanet];

    if (currentPlanet < 5) {
      const repairCost = planetRouteCosts[nextPlanet] || 6000000000;
      const isRepaired = highestUnlockedPlanet >= nextPlanet;

      if (!isRepaired) {
        setActiveDialogue({
          speaker: 'PLANETARY ROCKET INTERFACE',
          speakerRole: 'Warp Transport',
          avatarColor: theme.logoColor,
          text: `The launch engines for Planet ${nextPlanet} (${planetThemes[nextPlanet].name}) require structural repair.\nCost: $${repairCost.toLocaleString()}`,
          options: [
            {
              text: `1. Repair and Launch to Planet ${nextPlanet} ($${repairCost.toLocaleString()})`,
              action: () => {
                if (devMode || money >= repairCost) {
                  if (!devMode) setMoney((m) => m - repairCost);
                  setHighestUnlockedPlanet((h) => Math.max(h, nextPlanet));
                  setCurrentPlanet(nextPlanet);
                  setPlayer((p) => ({
                    ...p,
                    x: 350,
                    y: surfaceGroundY - p.height,
                    vx: 0,
                    vy: 0,
                    isGrounded: true,
                  }));
                  setActiveDialogue(null);
                  showMessage(`Rocket repaired! Launched to Planet ${nextPlanet}: ${planetThemes[nextPlanet].name}!`);
                  saveProgress();
                } else {
                  showMessage(`Requires $${repairCost.toLocaleString()} to repair route.`);
                }
              },
            },
            {
              text: '2. Cancel / Not yet',
              action: () => setActiveDialogue(null),
            },
          ],
        });
      } else {
        setActiveDialogue({
          speaker: 'PLANETARY ROCKET INTERFACE',
          speakerRole: 'Active Conduit',
          avatarColor: theme.logoColor,
          text: `Route to Planet ${nextPlanet} is operational. Ready for warp launch.`,
          options: [
            {
              text: `1. Launch to Planet ${nextPlanet} (${planetThemes[nextPlanet].name})`,
              action: () => {
                setCurrentPlanet(nextPlanet);
                setPlayer((p) => ({
                  ...p,
                  x: 350,
                  y: surfaceGroundY - p.height,
                  vx: 0,
                  vy: 0,
                  isGrounded: true,
                }));
                setActiveDialogue(null);
                showMessage(`Arrived on Planet ${nextPlanet}: ${planetThemes[nextPlanet].name}!`);
                saveProgress();
              },
            },
            ...(currentPlanet > 1
              ? [
                  {
                    text: `2. Return to Planet 1 (${planetThemes[1].name})`,
                    action: () => {
                      setCurrentPlanet(1);
                      setPlayer((p) => ({
                        ...p,
                        x: 350,
                        y: surfaceGroundY - p.height,
                        vx: 0,
                        vy: 0,
                        isGrounded: true,
                      }));
                      setActiveDialogue(null);
                      showMessage(`Returned to Planet 1: Aether.`);
                      saveProgress();
                    },
                  },
                ]
              : []),
            {
              text: '3. Stay on current planet',
              action: () => setActiveDialogue(null),
            },
          ],
        });
      }
    } else {
      // PLANET 5: The Ultimate Rocket!
      // "also move the permanent planet travel to the end of the planets where you fix the rocket on planet 5."
      if (!planetTravelUnlocked) {
        const repairCost = ultimatePlanet5RocketRepairCost;
        setActiveDialogue({
          speaker: 'MASTER WARP ROCKET CORE',
          speakerRole: 'Ancient Nexus Hyperdrive',
          avatarColor: '#f783ff',
          text: `This is the Master Warp Rocket of the Ancient Zephyrians. Restoring its Singularity Hyperdrive will permanently unlock fast-travel across all 5 planets!\nRepair Cost: $${repairCost.toLocaleString()}`,
          options: [
            {
              text: `1. Repair Master Rocket & Unlock Permanent Warp Matrix ($${repairCost.toLocaleString()})`,
              action: () => {
                if (devMode || money >= repairCost) {
                  if (!devMode) setMoney((m) => m - repairCost);
                  setPlanetTravelUnlocked(true);
                  setActiveDialogue(null);
                  showMessage('🎉 MASTER WARP MATRIX UNLOCKED! You can now freely fast-travel across all 5 planets at any time!');
                  saveProgress();
                } else {
                  showMessage(`Requires $${repairCost.toLocaleString()} to restore the Master Hyperdrive.`);
                }
              },
            },
            {
              text: '2. Not yet',
              action: () => setActiveDialogue(null),
            },
          ],
        });
      } else {
        setActiveDialogue({
          speaker: 'MASTER WARP ROCKET CORE',
          speakerRole: 'Full Synchronized',
          avatarColor: '#f783ff',
          text: 'The Master Warp Rocket is fully calibrated! Fast-travel across all five planetary sectors is active.',
          options: [
            {
              text: '1. Open Planetary Warp Matrix',
              action: () => {
                setActiveDialogue(null);
                setTravelModalOpen(true);
              },
            },
            {
              text: '2. Dismiss',
              action: () => setActiveDialogue(null),
            },
          ],
        });
      }
    }
  };

  // Mining crystal action
  const handleMineOre = (index: number) => {
    const ore = caveOres[index];
    if (!ore) return;

    const dist = Math.hypot(player.x - ore.x, player.y - ore.y);
    if (dist > 95) {
      setMiningOreIndex(null);
      return;
    }

    setMiningOreIndex(index);
    setMiningAnimTimer(10);

    const damage = Math.max(22, (ore.type.hp / 4.2) * 0.14 * miningPower);
    const nextHp = ore.currentHp - damage;

    if (nextHp <= 0) {
      if (currentWeight + ore.type.weight <= maxWeight) {
        setCurrentWeight((w) => w + ore.type.weight);
        setInventory((inv) => [...inv, ore.type]);
        setCaveOres((ores) => ores.filter((_, idx) => idx !== index));
        setMiningOreIndex(null);
        showMessage(`+1 ${ore.type.name} mined! ($${ore.type.value.toLocaleString()})`);
      } else {
        ore.currentHp = ore.type.hp;
        setMiningOreIndex(null);
        showMessage('⚠️ Bag is full! Upgrade capacity at a bag shop or sell gems.');
      }
    } else {
      ore.currentHp = nextHp;
    }
  };

  // Open Drunk Alien mystery box
  const handleOpenMysteryBox = (tierKey: string): GearReward | null => {
    const box = mysteryBoxes[tierKey];
    if (!box) return null;

    if (!devMode && money < box.cost) {
      showMessage(`Need $${box.cost.toLocaleString()} for ${box.label} Box!`);
      return null;
    }

    if (!devMode) setMoney((m) => m - box.cost);

    const rewardTemplate = box.rewards[Math.floor(Math.random() * box.rewards.length)];
    const reward: GearReward = {
      ...rewardTemplate,
      tier: box.label,
    };

    setGearInventory((g) => [...g, reward]);

    // Equip if stronger
    const currentEquipped = equippedGear[reward.slot];
    const curVal = currentEquipped ? currentEquipped.value : 0;
    if (reward.value > curVal) {
      const diff = reward.value - curVal;
      if (reward.stat === 'miningPower') setMiningPower((p) => p + diff);
      else if (reward.stat === 'maxWeight') setMaxWeight((w) => w + diff);
      else if (reward.stat === 'speed') setSpeed((s) => s + diff);
      setEquippedGear((eq) => ({ ...eq, [reward.slot]: reward }));
      showMessage(`Equipped ${reward.name} (${reward.detail})!`);
    } else {
      showMessage(`Obtained ${reward.name} (stored in vault collection).`);
    }

    saveProgress();
    return reward;
  };

  // Speed Capsule upgrade
  const handleUpgradeSpeed = () => {
    const cost = 120;
    if (devMode || money >= cost) {
      if (!devMode) setMoney((m) => m - cost);
      setSpeed((s) => s + 0.25);
      showMessage('⚡ Speed boosted by +0.25!');
      setSpeedModalOpen(false);
      saveProgress();
    } else {
      showMessage('Need $120 for Speed Capsule!');
    }
  };

  // Selling all inventory gems
  const handleSellAllGems = () => {
    const total = inventory.reduce((sum, item) => sum + item.value, 0);
    setMoney((m) => m + total);
    setInventory([]);
    setCurrentWeight(0);
    setActiveDialogue(null);
    showMessage(`💎 Sold ${inventory.length} gems for +$${total.toLocaleString()}!`);
    saveProgress();
  };

  // Open Standard or Elite Shop
  const openShopCatalog = (type: 'pickaxe' | 'bag', elite = false) => {
    const theme = planetThemes[currentPlanet] || planetThemes[1];
    const mall = theme.mall;

    let items: ShopCardItem[] = [];

    if (!elite) {
      if (type === 'pickaxe') {
        items = basePickaxeShopItems.map((item) => ({
          name: `${mall.pickaxeBrand} ${item.name}`,
          subtitle: `Mining Power: +${item.power}`,
          cost: item.cost,
          onBuy: () => {
            if (devMode || money >= item.cost) {
              if (!devMode) setMoney((m) => m - item.cost);
              setMiningPower((p) => p + item.power);
              showMessage(`Upgraded to ${item.name}! (+${item.power} Power)`);
              setShopModalOpen(false);
              saveProgress();
            } else {
              showMessage('Not enough money for this pickaxe.');
            }
          },
        }));
      } else {
        items = baseBagShopItems.map((item) => ({
          name: `${mall.bagBrand} ${item.name}`,
          subtitle: `Carry Capacity: +${item.capacity}`,
          cost: item.cost,
          onBuy: () => {
            if (devMode || money >= item.cost) {
              if (!devMode) setMoney((m) => m - item.cost);
              setMaxWeight((w) => w + item.capacity);
              showMessage(`Upgraded to ${item.name}! (+${item.capacity} Capacity)`);
              setShopModalOpen(false);
              saveProgress();
            } else {
              showMessage('Not enough money for this bag.');
            }
          },
        }));
      }
    } else {
      const eliteData = planetBetterShopItems[currentPlanet] || planetBetterShopItems[1];
      if (type === 'pickaxe') {
        items = eliteData.pickaxes.map((item) => ({
          name: item.name,
          subtitle: `Elite Mining Power: +${item.power}`,
          cost: item.cost,
          badge: 'ELITE',
          onBuy: () => {
            if (devMode || money >= item.cost) {
              if (!devMode) setMoney((m) => m - item.cost);
              setMiningPower((p) => p + item.power);
              showMessage(`Forged Elite ${item.name}! (+${item.power} Power)`);
              setShopModalOpen(false);
              saveProgress();
            } else {
              showMessage('Not enough funds for elite pickaxe.');
            }
          },
        }));
      } else {
        items = eliteData.bags.map((item) => ({
          name: item.name,
          subtitle: `Elite Carry Capacity: +${item.capacity}`,
          cost: item.cost,
          badge: 'ELITE',
          onBuy: () => {
            if (devMode || money >= item.cost) {
              if (!devMode) setMoney((m) => m - item.cost);
              setMaxWeight((w) => w + item.capacity);
              showMessage(`Equipped Elite ${item.name}! (+${item.capacity} Capacity)`);
              setShopModalOpen(false);
              saveProgress();
            } else {
              showMessage('Not enough funds for elite bag.');
            }
          },
        }));
      }
    }

    setShopModalData({
      title: `${theme.mallName} | ${type === 'pickaxe' ? 'PICKAXE LAB' : 'BAG SUPPLY'}${elite ? ' [ELITE]' : ''}`,
      subtitle: `Balance: ${devMode ? '∞' : '$' + money.toLocaleString()}`,
      items,
    });
    setShopModalOpen(true);
  };

  // Open Secret Merchant Shop (Planet 2, 3, 4, 5)
  const openSecretMerchantShop = (planetNum: number) => {
    let merchantItems: MerchantItem[] = [];
    let title = '';
    let discount = 0.2;

    if (planetNum === 2) {
      merchantItems = planet2MerchantItems;
      title = 'VIRELIA VISITING MERCHANT | 25% DISCOUNT';
      discount = 0.25;
    } else if (planetNum === 3) {
      merchantItems = planet3MerchantItems;
      title = 'NOXARA SUMMIT MERCHANT | 20% DISCOUNT';
      discount = 0.2;
    } else if (planetNum === 4) {
      merchantItems = planet4MerchantItems;
      title = 'CRYO HERMIT ALCHEMIST | 30% DISCOUNT';
      discount = 0.3;
    } else if (planetNum === 5) {
      merchantItems = planet5MerchantItems;
      title = 'ARCHON VAEL (VOID RUNNER PROTOTYPES)';
      discount = 0.2;
    }

    const cards: ShopCardItem[] = merchantItems.map((item) => {
      const price = Math.floor(item.cost * (1 - discount));
      return {
        name: item.name,
        subtitle: `${item.type.toUpperCase()}: +${item.amount} (${item.description || ''})`,
        cost: price,
        originalCost: item.cost,
        discountTag: `${Math.round(discount * 100)}% OFF`,
        onBuy: () => {
          if (devMode || money >= price) {
            if (!devMode) setMoney((m) => m - price);
            if (item.type === 'pickaxe') setMiningPower((p) => p + item.amount);
            else if (item.type === 'backpack') setMaxWeight((w) => w + item.amount);
            else if (item.type === 'accessory') setSpeed((s) => s + item.amount);
            showMessage(`Purchased secret item ${item.name}!`);
            setShopModalOpen(false);
            saveProgress();
          } else {
            showMessage('Not enough funds for secret merchandise.');
          }
        },
      };
    });

    setShopModalData({
      title,
      subtitle: 'Rare planetary items with extraordinary stat multipliers',
      items: cards,
    });
    setShopModalOpen(true);
  };

  // Interact Action (Triggered by [E] key or INTERACT slice on circular cluster)
  const handleInteract = () => {
    if (activeDialogue || shopModalOpen || boxModalOpen || speedModalOpen || travelModalOpen) {
      return;
    }

    const theme = planetThemes[currentPlanet] || planetThemes[1];

    if (currentDimension === 'surface') {
      // 1. Broken Rocket Landmark
      if (player.x > 70 && player.x < 170) {
        openRocketDialogue();
        return;
      }

      // 2. Planet 2 Visiting Merchant
      if (currentPlanet === 2 && planet2MerchantActive && Math.abs(player.x - 1180) < 55) {
        openSecretMerchantShop(2);
        return;
      }

      // 3. Planet 3 Summit Mountain Merchant
      if (currentPlanet === 3 && player.x > 1350 && player.x < 1460 && player.y < -200) {
        openSecretMerchantShop(3);
        return;
      }

      // 4. Planet 4 Glacial Ridge Summit Hermit
      if (currentPlanet === 4 && player.x > 1320 && player.x < 1440 && player.y < -120) {
        openSecretMerchantShop(4);
        return;
      }

      // 5. Planet 5: Alien Civilization NPCs!
      if (currentPlanet === 5 && player.x > 940 && player.x < 1850) {
        // Find closest alien NPC
        for (const npc of alienCivilizationNPCs) {
          if (Math.abs(player.x - npc.x) < 45) {
            const alreadyVisited = visitedAlienNPCs.includes(npc.id);
            setActiveDialogue({
              speaker: npc.name,
              speakerRole: npc.title,
              avatarColor: npc.color,
              text: npc.dialogueTree.greeting,
              options: [
                ...npc.dialogueTree.topics.map((topic) => ({
                  text: topic.label,
                  action: () => {
                    if (topic.reward && !alreadyVisited) {
                      const rew = topic.reward;
                      setVisitedAlienNPCs((v) => [...v, npc.id]);
                      if (rew.type === 'power') {
                        setMiningPower((p) => p + rew.amount);
                      } else if (rew.type === 'speed') {
                        setSpeed((s) => s + rew.amount);
                      } else if (rew.type === 'money') {
                        setMoney((m) => m + rew.amount);
                      }
                      showMessage(rew.message);
                    }
                    setActiveDialogue({
                      speaker: npc.name,
                      speakerRole: npc.title,
                      avatarColor: npc.color,
                      text: topic.response,
                      options: [
                        {
                          text: '1. Ask something else',
                          action: () => handleInteract(),
                        },
                        {
                          text: '2. Farewell, ancient one.',
                          action: () => setActiveDialogue(null),
                        },
                      ],
                    });
                  },
                })),
                {
                  text: 'Farewell for now.',
                  action: () => setActiveDialogue(null),
                },
              ],
            });
            return;
          }
        }

        // Void runner merchant shack
        if (Math.abs(player.x - 1730) < 45) {
          openSecretMerchantShop(5);
          return;
        }
      }

      // 6. Enter Mall
      if (player.x > 375 && player.x < 425) {
        setCurrentDimension('mall_interior');
        setPlayer((p) => ({
          ...p,
          x: 150,
          y: indoorGroundY - p.height,
          vx: 0,
          isGrounded: true,
        }));
        showMessage(`Entered ${theme.mallName}!`);
        return;
      }

      // 7. Speed Capsule
      if (player.x > 530 && player.x < 575) {
        setSpeedModalOpen(true);
        return;
      }
    } else if (currentDimension === 'cave') {
      // In cave, mine closest ore if nearby!
      let closestIdx = -1;
      let closestDist = Infinity;
      caveOres.forEach((ore, idx) => {
        const d = Math.hypot(player.x - ore.x, player.y - ore.y);
        if (d < 95 && d < closestDist) {
          closestDist = d;
          closestIdx = idx;
        }
      });
      if (closestIdx >= 0) {
        handleMineOre(closestIdx);
      } else if (player.x <= caveShaftX + 25) {
        // Exit cave ascent
        setCutsceneActive(true);
        setCutsceneTimer(0);
      }
    } else if (currentDimension === 'mall_interior') {
      // RoBiT Manager
      if (player.x > 80 && player.x < 170) {
        setActiveDialogue({
          speaker: theme.mall.manager,
          speakerRole: 'Mall Director',
          avatarColor: theme.logoColor,
          text: theme.mall.greeting,
          options: [
            {
              text: `1. Hello ${theme.mall.manager}! What are the sectors here?`,
              action: () => {
                setActiveDialogue({
                  speaker: theme.mall.manager,
                  speakerRole: 'Mall Director',
                  avatarColor: theme.logoColor,
                  text: `Our mall houses the Gem Relay (sell crystals), Bag Supply (carry capacity), and Pickaxe Lab (mining power). For the elite tiers, take the stairs at the east wing!`,
                  options: [{ text: 'Thank you!', action: () => setActiveDialogue(null) }],
                });
              },
            },
            {
              text: '2. Carry on.',
              action: () => setActiveDialogue(null),
            },
          ],
        });
        return;
      }

      // Stairs to Upper Deck
      if (player.x > 930 && player.x < 1060) {
        setCurrentDimension('mall_upper');
        setPlayer((p) => ({ ...p, x: 990, y: 150, isGrounded: true }));
        showMessage('Arrived at Mall Upper Deck!');
        return;
      }

      // Exit Mall
      if (player.x > 1470 && player.x < 1560) {
        setCurrentDimension('surface');
        setPlayer((p) => ({ ...p, x: 400, y: surfaceGroundY - p.height, isGrounded: true }));
        showMessage('Exited Mall back to surface.');
        return;
      }

      // RoBiT HQ door
      if (player.x > 95 && player.x < 145) {
        setCurrentDimension('robit_office');
        setPlayer((p) => ({ ...p, x: 40, isGrounded: true }));
        return;
      }

      // Gem Relay (Sell)
      if (player.x > 255 && player.x < 305) {
        const totalVal = inventory.reduce((sum, item) => sum + item.value, 0);
        setActiveDialogue({
          speaker: theme.mall.keepers[1],
          speakerRole: 'Gem Dealer',
          avatarColor: theme.mall.keeperColors[1][1],
          text: `Welcome to ${theme.mall.shops[1]}! You have ${inventory.length} gems in your bag.\nTotal Appraisal Value: $${totalVal.toLocaleString()}`,
          options: [
            {
              text: `1. Sell all gems for +$${totalVal.toLocaleString()}`,
              action: handleSellAllGems,
            },
            {
              text: '2. Just admiring the collection.',
              action: () => setActiveDialogue(null),
            },
          ],
        });
        return;
      }

      // Bags
      if (player.x > 445 && player.x < 495) {
        openShopCatalog('bag', false);
        return;
      }

      // Picks
      if (player.x > 635 && player.x < 685) {
        openShopCatalog('pickaxe', false);
        return;
      }

      // Dresser & Suits Boutique
      if (player.x > 775 && player.x < 845) {
        setDresserModalOpen(true);
        return;
      }
    } else if (currentDimension === 'mall_upper') {
      // Gambler Vent on Planet 1!
      if (currentPlanet === 1 && player.x < 110) {
        setCurrentDimension('gambler_interior');
        setPlayer((p) => ({ ...p, x: 50, isGrounded: true }));
        showMessage("Crawled through the vent into the Drunk Alien's Vault!");
        return;
      }

      // Return to Lower Deck
      if (player.x > 930 && player.x < 1060) {
        setCurrentDimension('mall_interior');
        setPlayer((p) => ({ ...p, x: 1000, y: 170, isGrounded: true }));
        return;
      }

      // Elite Pickaxes
      if (player.x > 215 && player.x < 265) {
        openShopCatalog('pickaxe', true);
        return;
      }

      // Elite Bags
      if (player.x > 585 && player.x < 635) {
        openShopCatalog('bag', true);
        return;
      }
    } else if (currentDimension === 'gambler_interior') {
      setBoxModalOpen(true);
    }
  };

  // Exit Action (Triggered by [ESC] key or EXIT slice on circular cluster)
  const handleExit = () => {
    // If dialogue or modal is open, close it
    if (activeDialogue) {
      setActiveDialogue(null);
      return;
    }
    if (dresserModalOpen) {
      setDresserModalOpen(false);
      return;
    }
    if (shopModalOpen) {
      setShopModalOpen(false);
      return;
    }
    if (boxModalOpen) {
      setBoxModalOpen(false);
      return;
    }
    if (speedModalOpen) {
      setSpeedModalOpen(false);
      return;
    }
    if (travelModalOpen) {
      setTravelModalOpen(false);
      return;
    }
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    // Dimension exits
    if (currentDimension === 'cave') {
      setCutsceneActive(true);
      setCutsceneTimer(0);
      return;
    }

    if (currentDimension === 'mall_interior') {
      setCurrentDimension('surface');
      setPlayer((p) => ({ ...p, x: 400, y: surfaceGroundY - p.height, isGrounded: true }));
      showMessage('Exited Mall.');
      return;
    }

    if (currentDimension === 'mall_upper') {
      setCurrentDimension('mall_interior');
      setPlayer((p) => ({ ...p, x: 990, y: 170, isGrounded: true }));
      return;
    }

    if (currentDimension === 'gambler_interior') {
      setCurrentDimension('mall_upper');
      setPlayer((p) => ({ ...p, x: 120, isGrounded: true }));
      return;
    }

    if (
      currentDimension === 'robit_office' ||
      currentDimension === 'gem_interior' ||
      currentDimension === 'bag_interior' ||
      currentDimension === 'pickaxe_interior' ||
      currentDimension === 'better_bag_interior' ||
      currentDimension === 'better_pickaxe_interior'
    ) {
      setCurrentDimension('mall_interior');
      setPlayer((p) => ({ ...p, x: 280, isGrounded: true }));
    }
  };

  // Jump Action
  const handleJumpStart = () => {
    mobileInput.current.jump = true;
  };
  const handleJumpEnd = () => {
    mobileInput.current.jump = false;
  };

  // Left & Right continuous movement
  const handleMoveLeftStart = () => {
    mobileInput.current.left = true;
  };
  const handleMoveLeftEnd = () => {
    mobileInput.current.left = false;
  };
  const handleMoveRightStart = () => {
    mobileInput.current.right = true;
  };
  const handleMoveRightEnd = () => {
    mobileInput.current.right = false;
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;

      if (e.key === ' ' || e.code === 'Space') {
        keysPressed.current[' '] = true;
        e.preventDefault();
      }
      if (k === 'w' || k === 'arrowup') {
        keysPressed.current[k] = true;
        e.preventDefault();
      }

      if (k === 'e') {
        handleInteract();
      } else if (k === 'escape') {
        handleExit();
      } else if (k === 'f' && planetTravelUnlocked) {
        setTravelModalOpen((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = false;

      if (e.key === ' ' || e.code === 'Space') {
        keysPressed.current[' '] = false;
      }
      if (k === 'w' || k === 'arrowup') {
        keysPressed.current[k] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // Main Game Physics Update Loop (60 FPS)
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      setBreathingTimer((t) => t + 0.08);

      if (miningAnimTimer > 0) {
        setMiningAnimTimer((t) => t - 1);
      }

      // Handle cave ascent cutscene
      if (cutsceneActive) {
        setCutsceneTimer((timer) => {
          const next = timer + 1;
          if (next < 35) {
            setPlayer((p) => ({ ...p, x: p.x - 1.5, facing: 'left' }));
          } else if (next < 85) {
            setPlayer((p) => ({ ...p, x: caveShaftX, y: p.y - 3.0 }));
          } else {
            setCutsceneActive(false);
            setCurrentDimension('surface');
            setPlayer((p) => ({
              ...p,
              x: caveShaftX - 35,
              y: surfaceGroundY - p.height,
              vy: 0,
              isGrounded: true,
            }));
            saveProgress();
          }
          return next;
        });
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // Check horizontal inputs
      const isLeft =
        keysPressed.current['arrowleft'] ||
        keysPressed.current['a'] ||
        mobileInput.current.left;
      const isRight =
        keysPressed.current['arrowright'] ||
        keysPressed.current['d'] ||
        mobileInput.current.right;
      const isJump =
        keysPressed.current[' '] ||
        keysPressed.current['arrowup'] ||
        keysPressed.current['w'] ||
        mobileInput.current.jump;

      setPlayer((prev) => {
        let vx = 0;
        let facing = prev.facing;

        if (isLeft) {
          vx = -speed;
          facing = 'left';
        } else if (isRight) {
          vx = speed;
          facing = 'right';
        }

        // Apply jump velocity before updating y
        let vy = prev.vy;
        let isGrounded = false;

        if (isJump && prev.isGrounded) {
          vy = jumpForce;
        } else {
          vy += gravity;
        }

        let x = prev.x + vx;
        let y = prev.y + vy;

        if (currentDimension === 'surface') {
          // Horizontal bounds
          x = Math.max(10, Math.min(2180, x));

          // In shaft drop
          const inShaft = x > caveShaftX - 16 && x < caveShaftX + 16;
          const prevBottom = prev.y + prev.height;

          // Planet 3 mountain platforms
          if (currentPlanet === 3) {
            const mountainPlatforms = Array.from({ length: 18 }, (_, index) => ({
              x: 800 + index * 34,
              y: 164 - index * 24,
              width: 84,
              height: 16,
            }));
            mountainPlatforms.forEach((platform) => {
              const inX = x + prev.width > platform.x && x < platform.x + platform.width;
              if (inX && vy >= 0 && prevBottom <= platform.y + 6 && y + prev.height >= platform.y) {
                y = platform.y - prev.height;
                vy = 0;
                isGrounded = true;
              }
            });
          }

          // Planet 4 ice platforms
          if (currentPlanet === 4) {
            planet4IcePlatforms.forEach((platform) => {
              const inX = x + prev.width > platform.x && x < platform.x + platform.width;
              if (inX && vy >= 0 && prevBottom <= platform.y + 6 && y + prev.height >= platform.y) {
                y = platform.y - prev.height;
                vy = 0;
                isGrounded = true;
              }
            });
          }

          // Surface ground collision (only when landing downwards!)
          if (!inShaft && !isGrounded && vy >= 0 && y + prev.height >= surfaceGroundY) {
            y = surfaceGroundY - prev.height;
            vy = 0;
            isGrounded = true;
          }

          // Entering cave mine
          if (inShaft && y > surfaceGroundY + 25) {
            setCurrentDimension('cave');
            generateCaveOresForPlanet(currentPlanet);
            x = caveShaftX;
            y = 190;
            vy = 0;
            showMessage('Entered subterranean mine.');
          }
        } else if (currentDimension === 'cave') {
          // Dynamic Sloped Cave Physics!
          const terrain = generatePlanetCaveTerrain(currentPlanet);
          x = Math.max(caveShaftX - 25, Math.min(terrain.worldWidth - 25, x));

          const { floorY, ceilY } = getCaveHeightAt(terrain, x);
          const prevBottom = prev.y + prev.height;

          // Check cave platforms
          terrain.platforms.forEach((plat) => {
            const inX = x + prev.width > plat.x && x < plat.x + plat.width;
            if (inX && vy >= 0 && prevBottom <= plat.y + 6 && y + prev.height >= plat.y) {
              y = plat.y - prev.height;
              vy = 0;
              isGrounded = true;
            }
          });

          // Ceiling collision
          if (y <= ceilY && vy < 0) {
            y = ceilY;
            vy = 0;
          }

          // Dynamic sloped floor collision (only when landing downwards!)
          if (!isGrounded && vy >= 0 && y + prev.height >= floorY) {
            y = floorY - prev.height;
            vy = 0;
            isGrounded = true;
          }

          // Shaft exit
          if (x <= caveShaftX - 18) {
            setCutsceneActive(true);
            setCutsceneTimer(0);
          }
        } else {
          // Indoor areas (Mall, Shops, Vault)
          x = Math.max(20, Math.min(1560, x));
          if (vy >= 0 && y + prev.height >= indoorGroundY) {
            y = indoorGroundY - prev.height;
            vy = 0;
            isGrounded = true;
          }
        }

        return {
          ...prev,
          x,
          y,
          vx,
          vy,
          isGrounded,
          facing,
        };
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    currentDimension,
    currentPlanet,
    speed,
    cutsceneActive,
    generateCaveOresForPlanet,
    miningAnimTimer,
    saveProgress,
    showMessage,
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030308] select-none font-mono">
      {/* Top HUD */}
      <HUD
        money={money}
        devMode={devMode}
        currentWeight={currentWeight}
        maxWeight={maxWeight}
        miningPower={miningPower}
        speed={speed}
        currentPlanet={currentPlanet}
        currentDimension={currentDimension}
        planetTravelUnlocked={planetTravelUnlocked}
        mobileControlsActive={mobileControlsActive}
        onToggleMobileControls={() => setMobileControlsActive((prev) => !prev)}
        onOpenTravelModal={() => setTravelModalOpen(true)}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        audioMuted={audioMuted}
        onToggleAudio={toggleAudio}
      />

      {/* Main 2D Canvas */}
      <GameCanvas
        player={player}
        currentDimension={currentDimension}
        currentPlanet={currentPlanet}
        caveOres={caveOres}
        miningOreIndex={miningOreIndex}
        miningAnimTimer={miningAnimTimer}
        breathingTimer={breathingTimer}
        planet2MerchantActive={planet2MerchantActive}
        onMineOre={handleMineOre}
        cutsceneActive={cutsceneActive}
        cutsceneTimer={cutsceneTimer}
      />

      {/* Mobile Controls (with requested 1/3 circular cluster) */}
      {mobileControlsActive && (
        <MobileControls
          onInteract={handleInteract}
          onExit={handleExit}
          onJumpStart={handleJumpStart}
          onJumpEnd={handleJumpEnd}
          onMoveLeftStart={handleMoveLeftStart}
          onMoveLeftEnd={handleMoveLeftEnd}
          onMoveRightStart={handleMoveRightStart}
          onMoveRightEnd={handleMoveRightEnd}
        />
      )}

      {/* In-Game Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 rounded-lg border-2 border-cyan-400 bg-[#0d1020]/95 px-4 py-2 font-mono text-xs text-cyan-200 shadow-[0_0_15px_rgba(0,255,255,0.4)] backdrop-blur-md animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* 3-Dots Menu Dropdown */}
      <MenuDropdown
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenFeedback={() => setFeedbackOpen(true)}
        onOpenDresser={() => setDresserModalOpen(true)}
        onResetProgress={handleResetProgress}
        audioMuted={audioMuted}
        onToggleAudio={toggleAudio}
        onShowMessage={showMessage}
      />

      {/* Wardrobe Dresser & Suit Boutique Modal */}
      <DresserModal
        isOpen={dresserModalOpen}
        playerMoney={money}
        devMode={devMode}
        unlockedSkins={unlockedSkins}
        currentSkinId={currentSkinId}
        onBuySkin={handleBuySkin}
        onEquipSkin={handleEquipSkin}
        onClose={() => setDresserModalOpen(false)}
      />

      {/* Feedback & Cheat Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onActivateCheat={activateInfiniteMoneyCheat}
        onShowMessage={showMessage}
      />

      {/* Interactive Dialogue Modal */}
      <DialogueModal dialogue={activeDialogue} onClose={() => setActiveDialogue(null)} />

      {/* Shop Modal */}
      <ShopModal
        isOpen={shopModalOpen}
        title={shopModalData.title}
        subtitle={shopModalData.subtitle}
        items={shopModalData.items}
        playerMoney={money}
        devMode={devMode}
        onClose={() => setShopModalOpen(false)}
      />

      {/* Mystery Box Gear Vault Modal */}
      <BoxModal
        isOpen={boxModalOpen}
        mysteryBoxes={mysteryBoxes}
        playerMoney={money}
        devMode={devMode}
        onOpenBox={handleOpenMysteryBox}
        onClose={() => setBoxModalOpen(false)}
      />

      {/* Speed Capsule Modal */}
      <SpeedModal
        isOpen={speedModalOpen}
        cost={120}
        devMode={devMode}
        playerMoney={money}
        currentSpeed={speed}
        onUpgrade={handleUpgradeSpeed}
        onClose={() => setSpeedModalOpen(false)}
      />

      {/* Planet Travel Matrix Modal */}
      <PlanetTravelModal
        isOpen={travelModalOpen}
        currentPlanet={currentPlanet}
        highestUnlockedPlanet={highestUnlockedPlanet}
        devMode={devMode}
        onSelectPlanet={handleSelectPlanet}
        onClose={() => setTravelModalOpen(false)}
      />

      {/* PWA Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );
}
