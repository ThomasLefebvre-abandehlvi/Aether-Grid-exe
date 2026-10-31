import React, { useEffect, useRef, useState } from 'react';
import { CaveOre, CavePlatform, Dimension, OreType, PlanetTheme, Player } from '../types/game';
import { getCaveHeightAt, generatePlanetCaveTerrain, PlanetCaveTerrain, planetThemes, planet4IcePlatforms, planet4Summit } from '../data/planets';
import { alienCivilizationNPCs } from '../data/alienCivilization';
import { playerSkins } from '../data/skins';
 
// Logical height of the original design view. Camera maths use this, so the
// game plays the same no matter how big the canvas becomes.
const BASE_H = 270;
 
// Pick an internal resolution that matches the window's shape:
// wide window -> same height, more width; tall window -> same width, more height.
const computeViewSize = (cw: number, ch: number) => {
  const aspect = cw / ch;
  if (aspect >= 1) {
    return { w: Math.min(1100, Math.max(BASE_H, Math.round(BASE_H * aspect))), h: BASE_H };
  }
  return { w: BASE_H, h: Math.min(640, Math.round(BASE_H / aspect)) };
};
 
interface GameCanvasProps {
  player: Player;
  currentDimension: Dimension;
  currentPlanet: number;
  caveOres: CaveOre[];
  miningOreIndex: number | null;
  miningAnimTimer: number;
  breathingTimer: number;
  planet2MerchantActive: boolean;
  onMineOre: (index: number) => void;
  cutsceneActive: boolean;
  cutsceneTimer: number;
}
 
export const GameCanvas: React.FC<GameCanvasProps> = ({
  player,
  currentDimension,
  currentPlanet,
  caveOres,
  miningOreIndex,
  miningAnimTimer,
  breathingTimer,
  planet2MerchantActive,
  onMineOre,
  cutsceneActive,
  cutsceneTimer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState({ w: 480, h: 270, cssW: 0, cssH: 0 });
 
  // Resize the canvas to fit the window shape
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      const { w, h } = computeViewSize(cw, ch);
      const scale = Math.min(cw / w, ch / h);
      const cssW = Math.round(w * scale);
      const cssH = Math.round(h * scale);
      setView((prev) =>
        prev.w === w && prev.h === h && prev.cssW === cssW && prev.cssH === cssH
          ? prev
          : { w, h, cssW, cssH }
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('orientationchange', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', update);
    };
  }, []);
 
  // Surface constants
  const surfaceGroundY = 190;
  const indoorGroundY = 210;
  const caveShaftX = 760;
  const gamblerVentX = 64;
 
  // Mountain platforms for Planet 3
  const planet3MountainPlatforms = Array.from({ length: 18 }, (_, index) => ({
    x: 800 + index * 34,
    y: 164 - index * 24,
    width: 84,
    height: 16,
  }));
  const planet3Summit = planet3MountainPlatforms[planet3MountainPlatforms.length - 1];
 
  // Helper to draw a pixel crystal
  const drawPixelCrystal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x + 1, y - 6, 2, 2);
    ctx.fillRect(x + 4, y - 8, 2, 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 10);
    ctx.lineTo(x + 9, y - 3);
    ctx.lineTo(x + 4, y + 8);
    ctx.lineTo(x - 1, y - 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 3, y - 7, 2, 2);
    ctx.fillRect(x + 2, y - 4, 2, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x + 4, y - 1, 2, 3);
    ctx.fillRect(x + 1, y + 2, 2, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(x + 1, y - 6, 1, 1);
    ctx.fillRect(x + 5, y - 7, 1, 1);
  };
 
  const drawPixelCrystalSprite = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    drawPixelCrystal(ctx, x - 4, y - 5, color);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x - 3, y - 6, 2, 2);
    ctx.fillRect(x + 2, y - 7, 2, 2);
    ctx.strokeStyle = 'rgba(20, 20, 30, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 6, y - 7, 12, 14);
  };
 
  const drawCashierRobot = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    bodyColor: string,
    accentColor: string
  ) => {
    ctx.fillStyle = '#1a1b2a';
    ctx.fillRect(x + 5, y + 18, 20, 3);
 
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 7, y + 9, 16, 11);
    ctx.fillRect(x + 5, y + 21, 5, 9);
    ctx.fillRect(x + 20, y + 21, 5, 9);
 
    ctx.fillStyle = accentColor;
    ctx.fillRect(x + 9, y + 6, 12, 4);
    ctx.fillRect(x + 8, y + 16, 4, 5);
    ctx.fillRect(x + 18, y + 16, 4, 5);
 
    ctx.fillStyle = '#ebf4ff';
    ctx.fillRect(x + 9, y + 2, 5, 5);
    ctx.fillRect(x + 16, y + 2, 5, 5);
 
    ctx.fillStyle = '#030308';
    ctx.fillRect(x + 11, y + 4, 2, 2);
    ctx.fillRect(x + 18, y + 4, 2, 2);
 
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(x + 12, y + 9, 6, 2);
 
    ctx.fillStyle = accentColor;
    ctx.fillRect(x + 2, y + 14, 4, 8);
    ctx.fillRect(x + 24, y + 14, 4, 8);
    ctx.fillRect(x + 11, y + 30, 4, 7);
    ctx.fillRect(x + 15, y + 30, 4, 7);
  };
 
  const drawAlienNPC = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    accent: string,
    isElder = false
  ) => {
    const bob = Math.floor(Math.sin(breathingTimer + x * 0.1) * 1.5);
    ctx.save();
    ctx.translate(x, y + bob);
 
    // Glowing aura
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(8, 12, isElder ? 18 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
 
    // Head with antennae
    ctx.fillStyle = color;
    ctx.fillRect(4, 2, 8, 8);
    // Antennae
    ctx.fillStyle = accent;
    ctx.fillRect(3, -3, 2, 5);
    ctx.fillRect(11, -3, 2, 5);
    ctx.fillRect(2, -4, 4, 2);
    ctx.fillRect(10, -4, 4, 2);
 
    // Multiple glowing alien eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 4, 2, 2);
    ctx.fillRect(9, 4, 2, 2);
    ctx.fillRect(7, 7, 2, 1.5);
 
    // Body / robe
    ctx.fillStyle = color;
    ctx.fillRect(2, 10, 12, 14);
 
    // Robe trim / runes
    ctx.fillStyle = accent;
    ctx.fillRect(4, 12, 8, 2);
    ctx.fillRect(6, 16, 4, 4);
 
    if (isElder) {
      // Golden crown halo
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(8, -2, 9, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
 
    ctx.restore();
  };
 
  // Draw Alien Shack / Dwellings on Planet 5
  const drawAlienShack = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    domeColor: string
  ) => {
    ctx.save();
    // Base hut
    ctx.fillStyle = '#1c0c2e';
    ctx.fillRect(x, y - height, width, height);
    ctx.strokeStyle = domeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y - height, width, height);
 
    // Bioluminescent rounded dome roof
    ctx.fillStyle = domeColor;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y - height, width / 2, 18, 0, Math.PI, 0);
    ctx.fill();
 
    // Runic entrance door
    ctx.fillStyle = '#0a0314';
    ctx.fillRect(x + width / 2 - 10, y - 28, 20, 28);
    ctx.strokeStyle = '#ff6bf0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + width / 2 - 10, y - 28, 20, 28);
 
    // Antenna array on roof
    ctx.fillStyle = '#ffbcfd';
    ctx.fillRect(x + width / 2 - 1.5, y - height - 22, 3, 22);
    ctx.beginPath();
    ctx.arc(x + width / 2, y - height - 22, 4, 0, Math.PI * 2);
    ctx.fill();
 
    // Label
    ctx.fillStyle = '#ffe3fd';
    ctx.font = 'bold 7px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y - height - 8);
 
    ctx.restore();
  };
 
  // Draw Detailed Pixel Character (Mario & Retro 16-bit style)
  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const px = Math.floor(player.x);
    const py = Math.floor(player.y);
    const facingRight = player.facing === 'right';
    const moving = Math.abs(player.vx) > 0.15;
    const jumping = !player.isGrounded;
    const running = !jumping && moving && Math.abs(player.vx) > 2.5;
    const walking = !jumping && moving && !running;
    const gait = Math.floor(breathingTimer * (running ? 7 : 3.5)) % 4;
    const breathOffset = jumping ? -1 : moving ? (gait % 2 === 0 ? 0 : -1) : Math.floor(Math.sin(breathingTimer) * 1);
    const bodyX = px;
 
    const skin = playerSkins.find((s) => s.id === player.skinId) || playerSkins[0];
    const p = skin.palette;
    const isMario = p.hasMustache;
 
    // Optional aura particle glow for legendary/cosmic skins
    if (p.auraColor) {
      ctx.fillStyle = p.auraColor;
      ctx.beginPath();
      ctx.arc(px + 7, py + 12 + breathOffset, 14, 0, Math.PI * 2);
      ctx.fill();
    }
 
    // 1. Oxygen / Aether Tank / Backpack (Drawn behind body)
    const tankX = facingRight ? bodyX - 2 : bodyX + 12;
    ctx.fillStyle = p.backpack;
    ctx.fillRect(tankX, py + 7 + breathOffset, 4, 11);
    ctx.fillStyle = p.backpackTank;
    ctx.fillRect(tankX + 1, py + 9 + breathOffset, 2, 7); // glowing fuel gauge
 
    // High-speed thruster flame when running or jumping
    if (running || jumping) {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(tankX + (facingRight ? -2 : 4), py + 16 + breathOffset, 2, 2);
      ctx.fillStyle = '#ffeedd';
      ctx.fillRect(tankX + (facingRight ? -1 : 3), py + 15 + breathOffset, 1.5, 1.5);
    }
 
    // 2. Legs & Boots (Animated gait)
    ctx.fillStyle = p.legs;
    if (jumping) {
      // Classic Mario / Platformer jump pose
      const frontLegX = facingRight ? bodyX + 6 : bodyX + 2;
      const backLegX = facingRight ? bodyX + 1 : bodyX + 9;
      ctx.fillRect(frontLegX, py + 16, 5, 4);
      ctx.fillRect(backLegX, py + 18, 4, 3);
      // Boots
      ctx.fillStyle = p.boots;
      ctx.fillRect(facingRight ? bodyX + 8 : bodyX - 1, py + 19, 5, 3);
      ctx.fillRect(facingRight ? bodyX : bodyX + 8, py + 20, 5, 3);
      ctx.fillStyle = p.bootSoles;
      ctx.fillRect(facingRight ? bodyX + 8 : bodyX - 1, py + 22, 5, 1);
      ctx.fillRect(facingRight ? bodyX : bodyX + 8, py + 23, 5, 1);
    } else if (walking || running) {
      // 4-frame animated leg cycle
      const legStride = running ? 3 : 2;
      if (gait === 0) {
        ctx.fillRect(bodyX + 2 - (facingRight ? legStride : -legStride), py + 17, 4, 5);
        ctx.fillRect(bodyX + 8 + (facingRight ? legStride : -legStride), py + 17, 4, 4);
        ctx.fillStyle = p.boots;
        ctx.fillRect(bodyX + 1 - (facingRight ? legStride : -legStride), py + 21, 5, 3);
        ctx.fillRect(bodyX + 8 + (facingRight ? legStride : -legStride), py + 20, 5, 3);
        ctx.fillStyle = p.bootSoles;
        ctx.fillRect(bodyX + 1 - (facingRight ? legStride : -legStride), py + 23, 5, 1);
        ctx.fillRect(bodyX + 8 + (facingRight ? legStride : -legStride), py + 22, 5, 1);
      } else if (gait === 1 || gait === 3) {
        ctx.fillRect(bodyX + 3, py + 17, 3, 5);
        ctx.fillRect(bodyX + 7, py + 17, 3, 5);
        ctx.fillStyle = p.boots;
        ctx.fillRect(bodyX + 2, py + 21, 4, 3);
        ctx.fillRect(bodyX + 7, py + 21, 4, 3);
        ctx.fillStyle = p.bootSoles;
        ctx.fillRect(bodyX + 2, py + 23, 4, 1);
        ctx.fillRect(bodyX + 7, py + 23, 4, 1);
      } else {
        ctx.fillRect(bodyX + 2 + (facingRight ? legStride : -legStride), py + 17, 4, 4);
        ctx.fillRect(bodyX + 8 - (facingRight ? legStride : -legStride), py + 17, 4, 5);
        ctx.fillStyle = p.boots;
        ctx.fillRect(bodyX + 2 + (facingRight ? legStride : -legStride), py + 20, 5, 3);
        ctx.fillRect(bodyX + 7 - (facingRight ? legStride : -legStride), py + 21, 5, 3);
        ctx.fillStyle = p.bootSoles;
        ctx.fillRect(bodyX + 2 + (facingRight ? legStride : -legStride), py + 22, 5, 1);
        ctx.fillRect(bodyX + 7 - (facingRight ? legStride : -legStride), py + 23, 5, 1);
      }
    } else {
      // Idle stance
      ctx.fillRect(bodyX + 2, py + 17, 4, 5);
      ctx.fillRect(bodyX + 8, py + 17, 4, 5);
      ctx.fillStyle = p.boots;
      ctx.fillRect(bodyX + 1, py + 21, 5, 3);
      ctx.fillRect(bodyX + 8, py + 21, 5, 3);
      ctx.fillStyle = p.bootSoles;
      ctx.fillRect(bodyX + 1, py + 23, 5, 1);
      ctx.fillRect(bodyX + 8, py + 23, 5, 1);
    }
 
    // 3. Torso (Suit / Overalls / Shirt)
    ctx.fillStyle = p.torso;
    ctx.fillRect(bodyX + 2, py + 7 + breathOffset, 10, 10);
    ctx.fillStyle = p.torsoShade;
    ctx.fillRect(bodyX + 2, py + 12 + breathOffset, 10, 4);
 
    // Overalls details (Mario) or Armor Chestplate details
    if (isMario) {
      // Denim overalls straps
      ctx.fillStyle = p.legs;
      ctx.fillRect(bodyX + 3, py + 10 + breathOffset, 2, 6);
      ctx.fillRect(bodyX + 9, py + 10 + breathOffset, 2, 6);
      // Bright yellow overall buttons
      ctx.fillStyle = p.torsoDetail;
      ctx.fillRect(bodyX + 3, py + 11 + breathOffset, 2, 2);
      ctx.fillRect(bodyX + 9, py + 11 + breathOffset, 2, 2);
    } else {
      ctx.fillStyle = p.torsoDetail;
      ctx.fillRect(bodyX + 6, py + 9 + breathOffset, 2, 4);
      ctx.fillRect(bodyX + 5, py + 10 + breathOffset, 4, 2);
    }
 
    // Belt & Buckle
    ctx.fillStyle = p.belt;
    ctx.fillRect(bodyX + 2, py + 15 + breathOffset, 10, 2);
    ctx.fillStyle = p.beltBuckle;
    ctx.fillRect(bodyX + 6, py + 15 + breathOffset, 2, 2);
 
    // 4. Arms & Gloves & Pickaxe
    ctx.fillStyle = p.torso;
    if (miningAnimTimer > 0) {
      // Pickaxe swing animation
      const armX = facingRight ? bodyX + 9 : bodyX - 1;
      ctx.fillRect(armX, py + 8 + breathOffset, 5, 4);
      ctx.fillStyle = p.gloves;
      ctx.fillRect(facingRight ? armX + 4 : armX - 1, py + 9 + breathOffset, 3, 3);
 
      // Pickaxe Handle & Pick Head
      ctx.save();
      const pickX = facingRight ? armX + 5 : armX - 1;
      const pickY = py + 10 + breathOffset;
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(pickX, pickY - 6, 2, 12);
      ctx.fillStyle = '#dcdde1';
      ctx.fillRect(facingRight ? pickX - 3 : pickX - 5, pickY - 7, 8, 3);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(facingRight ? pickX + 4 : pickX - 6, pickY - 8, 2, 3);
      ctx.restore();
 
      // Sparks
      ctx.fillStyle = '#ffff00';
      const spkX = facingRight ? bodyX + 18 : bodyX - 6;
      ctx.fillRect(spkX + (Math.random() * 6 - 3), py + 8 + (Math.random() * 6 - 3), 2, 2);
      ctx.fillRect(spkX + (Math.random() * 6 - 3), py + 11 + (Math.random() * 6 - 3), 1.5, 1.5);
    } else if (jumping) {
      ctx.fillRect(bodyX - 1, py + 7, 3, 4);
      ctx.fillRect(bodyX + 11, py + 7, 3, 4);
      ctx.fillStyle = p.gloves;
      ctx.fillRect(bodyX - 1, py + 5, 3, 3);
      ctx.fillRect(bodyX + 11, py + 5, 3, 3);
    } else if (walking || running) {
      const backArmX = facingRight ? bodyX - 1 : bodyX + 11;
      const frontArmX = facingRight ? bodyX + 11 : bodyX - 1;
      const armSwing = gait === 0 || gait === 1 ? 2 : -2;
 
      ctx.fillRect(backArmX, py + 8 + breathOffset - armSwing, 3, 5);
      ctx.fillRect(frontArmX, py + 8 + breathOffset + armSwing, 3, 5);
      ctx.fillStyle = p.gloves;
      ctx.fillRect(backArmX, py + 12 + breathOffset - armSwing, 3, 3);
      ctx.fillRect(frontArmX, py + 12 + breathOffset + armSwing, 3, 3);
    } else {
      const handX = facingRight ? bodyX + 9 : bodyX + 1;
      ctx.fillRect(handX, py + 8 + breathOffset, 3, 5);
      ctx.fillStyle = p.gloves;
      ctx.fillRect(handX, py + 12 + breathOffset, 3, 3);
    }
 
    // 5. Head / Helmet / Cap / Face
    if (isMario) {
      // RETRO SUPER PLUMBER (MARIO) DETAILS!
      const headX = bodyX + 2;
      const headY = py + breathOffset;
 
      // Brown hair / sideburns
      ctx.fillStyle = '#2b1b17';
      ctx.fillRect(facingRight ? headX + 1 : headX + 7, headY + 3, 2, 4);
      ctx.fillRect(facingRight ? headX : headX + 8, headY + 4, 3, 3);
 
      // Peach face
      ctx.fillStyle = p.skinTone || '#ffd0a0';
      ctx.fillRect(headX + 2, headY + 2, 7, 6);
 
      // Rounded nose
      ctx.fillStyle = '#ffa07a';
      const noseX = facingRight ? headX + 7 : headX + 1;
      ctx.fillRect(noseX, headY + 4, 3, 2);
 
      // Dark eye
      ctx.fillStyle = '#111111';
      const eyeX = facingRight ? headX + 6 : headX + 3;
      ctx.fillRect(eyeX, headY + 3, 1.5, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(eyeX, headY + 3, 0.8, 1);
 
      // Iconic black pixel mustache!
      ctx.fillStyle = p.mustacheColor || '#2b1b17';
      const musX = facingRight ? headX + 5 : headX + 1;
      ctx.fillRect(musX, headY + 6, 4, 2);
      ctx.fillRect(facingRight ? musX + 3 : musX, headY + 5, 2, 2);
 
      // Red Cap with curved brim
      ctx.fillStyle = p.helmet;
      ctx.fillRect(headX + 1, headY - 1, 9, 4);
      const brimX = facingRight ? headX + 4 : headX - 1;
      ctx.fillRect(brimX, headY + 1, 8, 2);
 
      // Cap Emblem (White circle with Red 'M')
      ctx.fillStyle = '#ffffff';
      const embX = facingRight ? headX + 4 : headX + 2;
      ctx.fillRect(embX, headY - 1, 3, 2.5);
      ctx.fillStyle = '#e52521';
      ctx.fillRect(embX + 1, headY - 0.5, 1.2, 1.5);
    } else {
      // ASTRONAUT / CYBERPUNK / BOUNTY HUNTER / CROWN
      const headX = bodyX + 2;
      const headY = py + breathOffset;
 
      if (p.hatType === 'crown') {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(headX + 1, headY - 3, 9, 3);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(headX + 5, headY - 2, 2, 2);
      }
 
      ctx.fillStyle = p.helmet;
      ctx.fillRect(headX + 1, headY, 9, 8);
      ctx.fillStyle = p.helmetShade;
      ctx.fillRect(headX + 1, headY + 5, 9, 3);
      ctx.fillStyle = p.helmetHighlight;
      ctx.fillRect(headX + 2, headY, 6, 2);
 
      ctx.fillStyle = p.visor;
      const vx = facingRight ? headX + 4 : headX + 1;
      ctx.fillRect(vx, headY + 2, 5, 4);
 
      ctx.fillStyle = p.visorReflection;
      ctx.fillRect(facingRight ? vx + 1 : vx + 2, headY + 2, 1.5, 2);
      ctx.fillRect(facingRight ? vx + 2 : vx + 1, headY + 4, 1.5, 1);
 
      ctx.fillStyle = p.helmetHighlight;
      ctx.fillRect(facingRight ? headX : headX + 9, headY + 2, 1.5, 3);
    }
  };
 
  // Draw Mall Mascot on the illuminated sign
  const drawMallMascot = (
    ctx: CanvasRenderingContext2D,
    theme: PlanetTheme,
    x: number,
    y: number
  ) => {
    const mascot = theme.mall.mascot;
    ctx.save();
    ctx.fillStyle = mascot.skin;
    if (mascot.variant === 'sprout') {
      ctx.fillRect(x + 2, y + 12, 7, 6);
      ctx.fillRect(x + 27, y + 12, 7, 6);
      ctx.fillRect(x + 11, y + 1, 5, 10);
      ctx.fillRect(x + 20, y + 1, 5, 10);
    } else if (mascot.variant === 'spined') {
      ctx.fillRect(x + 5, y + 2, 5, 7);
      ctx.fillRect(x + 15, y, 5, 8);
      ctx.fillRect(x + 25, y + 2, 5, 7);
    } else if (mascot.variant === 'crystal') {
      ctx.fillRect(x + 14, y - 2, 6, 12);
      ctx.fillRect(x + 8, y + 4, 18, 6);
      ctx.fillRect(x + 12, y + 8, 10, 4);
    } else if (mascot.variant === 'ancient') {
      ctx.fillRect(x + 12, y - 1, 10, 8);
      ctx.fillRect(x + 7, y + 3, 20, 4);
      ctx.fillRect(x + 4, y + 6, 26, 3);
    } else {
      ctx.fillRect(x + 14, y + 1, 5, 8);
      ctx.fillRect(x + 11, y + 7, 11, 4);
    }
 
    ctx.fillRect(x + 7, y + 10, 24, 18);
    ctx.fillRect(x + 10, y + 27, 7, 8);
    ctx.fillRect(x + 22, y + 27, 7, 8);
 
    ctx.fillStyle = '#d9fff0';
    ctx.fillRect(x + 10, y + 15, 4, 4);
    ctx.fillRect(x + 17, y + 13, 4, 4);
    ctx.fillRect(x + 24, y + 15, 4, 4);
 
    ctx.fillStyle = '#143126';
    ctx.fillRect(x + 11, y + 16, 2, 2);
    ctx.fillRect(x + 18, y + 14, 2, 2);
    ctx.fillRect(x + 25, y + 16, 2, 2);
 
    ctx.fillStyle = mascot.accent;
    ctx.fillRect(x + 16, y + 22, 7, 2);
 
    if (mascot.variant === 'sprout') {
      ctx.fillRect(x + 3, y + 6, 6, 3);
      ctx.fillRect(x + 29, y + 6, 6, 3);
    } else if (mascot.variant === 'spined') {
      ctx.fillRect(x + 7, y + 30, 19, 3);
    }
    ctx.restore();
  };
 
  // Draw Mall Illuminated Neon Signboard / Logo
  const drawMallLogo = (
    ctx: CanvasRenderingContext2D,
    theme: PlanetTheme,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.save();
    ctx.fillStyle = '#080c16';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = theme.logoColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = theme.logoColor;
    ctx.shadowBlur = 10;
    ctx.strokeRect(x + 4, y + 4, width - 8, height - 8);
 
    ctx.fillStyle = theme.logoColor;
    ctx.beginPath();
    if (theme.logoType === 'hex') {
      ctx.moveTo(x + 65, y + 16);
      ctx.lineTo(x + 76, y + 10);
      ctx.lineTo(x + 87, y + 16);
      ctx.lineTo(x + 87, y + 36);
      ctx.lineTo(x + 76, y + 42);
      ctx.lineTo(x + 65, y + 36);
      ctx.closePath();
      ctx.fill();
    } else if (theme.logoType === 'wave') {
      ctx.lineWidth = 4;
      ctx.moveTo(x + 62, y + 30);
      ctx.bezierCurveTo(x + 68, y + 8, x + 81, y + 50, x + 90, y + 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 75, y + 29, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme.logoType === 'orbit') {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x + 76, y + 28, 16, 7, -0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 76, y + 28, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme.logoType === 'frost') {
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x + 76, y + 12);
      ctx.lineTo(x + 76, y + 44);
      ctx.moveTo(x + 60, y + 28);
      ctx.lineTo(x + 92, y + 28);
      ctx.moveTo(x + 65, y + 17);
      ctx.lineTo(x + 87, y + 39);
      ctx.moveTo(x + 65, y + 39);
      ctx.lineTo(x + 87, y + 17);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 76, y + 28, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + 76, y + 28, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 76, y + 28, 20, 6, 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
 
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f4fbff';
    ctx.font = 'bold 9px "Courier New"';
    ctx.textAlign = 'left';
    ctx.fillText(theme.mallName, x + 100, y + 34);
    drawMallMascot(ctx, theme, x + 12, y + 8);
    ctx.restore();
  };
 
  // Draw 2-Story Mall Exterior with Upper Floor
  const drawMallExterior = (
    ctx: CanvasRenderingContext2D,
    theme: PlanetTheme
  ) => {
    const mall = theme.mall;
    const left = 190;
    const width = 250;
    const height = 180; // Extended height for 2 stories (Ground + Upper floor)
    const top = surfaceGroundY - height;
 
    // 1. Outer building structure
    ctx.fillStyle = '#0b0c15';
    ctx.fillRect(left, top, width, height);
 
    ctx.fillStyle = mall.wall;
    ctx.fillRect(left + 5, top + 5, width - 10, height - 5);
 
    // Architectural division between Ground Floor and Upper Floor
    ctx.fillStyle = mall.trim;
    ctx.fillRect(left - 5, top - 4, width + 10, 8); // Roof cornice trim
    ctx.fillRect(left - 7, surfaceGroundY - 5, width + 14, 5); // Foundation base trim
    ctx.fillRect(left - 4, surfaceGroundY - 72, width + 8, 6); // 2nd Floor mid-deck dividing beam!
 
    // Neon trim lines on building edges
    ctx.strokeStyle = mall.trim;
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 2, top + 2, width - 4, height - 4);
 
    // Rooftop Communications array & antenna beacon
    ctx.fillStyle = '#1c223a';
    ctx.fillRect(left + 22, top - 18, 4, 18);
    ctx.fillRect(left + 18, top - 24, 12, 6);
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(left + 23, top - 26, 2, 2); // Pulsing beacon
 
    ctx.fillStyle = '#1c223a';
    ctx.fillRect(left + 220, top - 14, 3, 14);
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(left + 220, top - 18, 3, 4); // Warning light
 
    // 2. Rooftop Illuminated Neon Signboard / Logo
    drawMallLogo(ctx, theme, left + 8, top + 8, width - 16, 54);
 
    // 3. UPPER FLOOR (2ND STORY):
    // Upper wall paneling
    ctx.fillStyle = mall.panel;
    ctx.fillRect(left + 9, top + 66, width - 18, 38);
 
    // Upper Floor Division Label
    ctx.fillStyle = mall.accent;
    ctx.font = 'bold 6px "Courier New"';
    ctx.fillText('UPPER DECK • ELITE WING', left + 14, surfaceGroundY - 75);
 
    // Upper Window 1: Elite Pickaxe Showcase
    ctx.fillStyle = '#07131b';
    ctx.fillRect(left + 16, surfaceGroundY - 105, 56, 30);
    ctx.strokeStyle = mall.accent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left + 16, surfaceGroundY - 105, 56, 30);
    // Showcase Pedestal & Elite Pickaxe icon
    ctx.fillStyle = '#1a2744';
    ctx.fillRect(left + 38, surfaceGroundY - 84, 12, 9);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(left + 42, surfaceGroundY - 96, 4, 12);
    ctx.fillRect(left + 36, surfaceGroundY - 99, 16, 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px "Courier New"';
    ctx.fillText('ELITE PICKS', left + 19, surfaceGroundY - 108);
 
    // Upper Window 2: Elite Bag Showcase
    ctx.fillStyle = '#07131b';
    ctx.fillRect(left + 82, surfaceGroundY - 105, 56, 30);
    ctx.strokeStyle = theme.logoColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left + 82, surfaceGroundY - 105, 56, 30);
    // Showcase Pedestal & Cyber Bag icon
    ctx.fillStyle = '#1a2744';
    ctx.fillRect(left + 104, surfaceGroundY - 84, 12, 9);
    ctx.fillStyle = '#ff66cc';
    ctx.fillRect(left + 100, surfaceGroundY - 98, 20, 14);
    ctx.fillStyle = '#85efff';
    ctx.fillRect(left + 104, surfaceGroundY - 95, 12, 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px "Courier New"';
    ctx.fillText('ELITE BAGS', left + 86, surfaceGroundY - 108);
 
    // Upper Window 3: Skyview Lounge Observation Bay
    ctx.fillStyle = '#07131b';
    ctx.fillRect(left + 150, surfaceGroundY - 105, 84, 30);
    ctx.strokeStyle = mall.trim;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(left + 150, surfaceGroundY - 105, 84, 30);
    // Cyber patrons / glowing interior silhouettes
    ctx.fillStyle = 'rgba(0,255,255,0.2)';
    ctx.fillRect(left + 154, surfaceGroundY - 101, 76, 22);
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(left + 165, surfaceGroundY - 94, 6, 12);
    ctx.fillRect(left + 185, surfaceGroundY - 96, 6, 14);
    ctx.fillRect(left + 205, surfaceGroundY - 93, 6, 11);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px "Courier New"';
    ctx.fillText('OBSERVATORY', left + 160, surfaceGroundY - 108);
 
    // Gambler's Vent grating on Planet 1 Upper Floor
    if (theme.id === 1) {
      ctx.fillStyle = '#2b153b';
      ctx.fillRect(left + 6, surfaceGroundY - 106, 7, 32);
      ctx.strokeStyle = '#c87bff';
      ctx.lineWidth = 1;
      ctx.strokeRect(left + 6, surfaceGroundY - 106, 7, 32);
      for (let vy = surfaceGroundY - 102; vy < surfaceGroundY - 76; vy += 5) {
        ctx.fillStyle = '#d7a0ff';
        ctx.fillRect(left + 7, vy, 5, 2);
      }
    }
 
    // 4. GROUND FLOOR (1ST STORY):
    ctx.fillStyle = mall.panel;
    ctx.fillRect(left + 9, surfaceGroundY - 67, width - 18, 62);
 
    // Ground Floor Display Window 1
    ctx.fillStyle = '#07131b';
    ctx.fillRect(left + 18, surfaceGroundY - 44, 52, 38);
    ctx.strokeStyle = mall.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 18, surfaceGroundY - 44, 52, 38);
    // Glowing crystal display inside window
    drawPixelCrystal(ctx, left + 40, surfaceGroundY - 26, '#00ffff');
    drawPixelCrystal(ctx, left + 52, surfaceGroundY - 24, '#ffaa00');
 
    // Ground Floor Display Window 2
    ctx.fillStyle = '#07131b';
    ctx.fillRect(left + 80, surfaceGroundY - 44, 52, 38);
    ctx.strokeStyle = mall.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(left + 80, surfaceGroundY - 44, 52, 38);
    // Display item inside
    drawPixelCrystal(ctx, left + 102, surfaceGroundY - 26, '#ff0080');
    drawPixelCrystal(ctx, left + 114, surfaceGroundY - 24, '#00ff66');
 
    // Ground Floor Main Airlock Door (Just like before!)
    ctx.fillStyle = '#07111a';
    ctx.fillRect(left + 185, surfaceGroundY - 54, 34, 54);
    ctx.strokeStyle = theme.logoColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(left + 185, surfaceGroundY - 54, 34, 54);
 
    // Keypad panel & handle
    ctx.fillStyle = mall.accent;
    ctx.fillRect(left + 212, surfaceGroundY - 28, 3, 5);
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(left + 188, surfaceGroundY - 48, 4, 3);
    ctx.fillStyle = '#00ff66';
    ctx.fillRect(left + 194, surfaceGroundY - 48, 4, 3);
 
    // Glowing ENTRANCE prompt above door
    ctx.fillStyle = theme.logoColor;
    ctx.font = 'bold 7px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('ENTRANCE [E]', left + 202, surfaceGroundY - 58);
    ctx.textAlign = 'left';
  };
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
 
    const theme = planetThemes[currentPlanet] || planetThemes[1];
    const terrain = generatePlanetCaveTerrain(currentPlanet);
 
    // Active dimensions
    const isSurface = currentDimension === 'surface';
    const isCave = currentDimension === 'cave';
    const isMall = currentDimension === 'mall_interior';
    const isMallUpper = currentDimension === 'mall_upper';
    const isOffice = currentDimension === 'robit_office';
 
    const activeWorldWidth = isCave ? terrain.worldWidth : isSurface ? 2200 : 1600;
 
    // Camera calculations
    let camX = Math.max(0, Math.min(Math.max(0, activeWorldWidth - canvas.width), player.x - canvas.width / 2));
    let camY = 0;
    if (isCave) {
      camY = Math.max(-250, Math.min(180, player.y - BASE_H * 0.5));
    } else if (isSurface && (currentPlanet === 3 || currentPlanet === 4)) {
      camY = Math.max(-450, Math.min(0, player.y - BASE_H * 0.55));
    }
 
    // Extra vertical space (tall window) is split above and below the design view
    const offY = Math.round(Math.max(0, canvas.height - BASE_H) / 2);
 
    // Fill the whole canvas with the scene colour so no black bars show
    ctx.fillStyle = isSurface ? theme.sky : isCave ? theme.cave.background : '#080b12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-Math.floor(camX), -Math.floor(camY) + offY);
 
    if (isSurface) {
      // 1. Sky & Stars
      ctx.fillStyle = theme.sky;
      ctx.fillRect(0, -1200, activeWorldWidth, surfaceGroundY + 1200);
 
      for (let i = 0; i < 110; i++) {
        const sx = (i * 97) % activeWorldWidth;
        const sy = -500 + (i * 59) % 650;
        ctx.fillStyle = i % 4 === 0 ? '#fff3ad' : theme.star;
        ctx.fillRect(sx, sy, 2, 2);
      }
 
      // Distant celestial body
      if (currentPlanet > 1) {
        ctx.fillStyle = theme.distant;
        ctx.beginPath();
        ctx.arc(1750, 50, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.star;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(1750, 50, 62, 12, -0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
 
      // Background mountain layers
      theme.layers.forEach((layer) => {
        ctx.fillStyle = layer.color;
        for (let x = -50; x < activeWorldWidth + 120; x += 140) {
          ctx.beginPath();
          ctx.moveTo(x, surfaceGroundY);
          ctx.lineTo(x + 12, layer.y - layer.size);
          ctx.lineTo(x + 28, layer.y - layer.size + 10);
          ctx.lineTo(x + 40, layer.y - 12);
          ctx.lineTo(x + 60, layer.y - layer.size + 2);
          ctx.lineTo(x + 85, layer.y - 16);
          ctx.lineTo(x + 120, surfaceGroundY);
          ctx.closePath();
          ctx.fill();
        }
      });
 
      // 2-Story Mall Exterior (with Upper Floor)
      drawMallExterior(ctx, theme);
 
      // Speed Capsule Capsule Shop
      ctx.fillStyle = '#0a2616';
      ctx.fillRect(540, surfaceGroundY - 50, 35, 50);
      ctx.strokeStyle = '#00cc66';
      ctx.lineWidth = 2;
      ctx.strokeRect(540, surfaceGroundY - 50, 35, 50);
      ctx.fillStyle = '#00cc66';
      ctx.fillRect(545, surfaceGroundY - 40, 25, 35);
      ctx.fillStyle = '#ffffff';
      ctx.font = '7px "Courier New"';
      ctx.fillText('SPEED', 544, surfaceGroundY - 54);
 
      // Ground & Subterranean
      const [groundA, groundB, groundAccent, groundDetail, underground] = theme.ground;
      ctx.fillStyle = underground;
      ctx.fillRect(0, surfaceGroundY, activeWorldWidth, 1200);
 
      for (let x = 0; x < activeWorldWidth; x += 16) {
        ctx.fillStyle = (x / 16) % 2 === 0 ? groundA : groundB;
        ctx.fillRect(x, surfaceGroundY, 16, 18);
        ctx.fillStyle = groundAccent;
        ctx.fillRect(x, surfaceGroundY + 18, 16, 6);
        ctx.fillStyle = groundDetail;
        ctx.fillRect(x + 3, surfaceGroundY + 5, 3, 3);
        ctx.fillRect(x + 9, surfaceGroundY + 10, 3, 3);
      }
 
      // Cave Shaft Entrance
      ctx.strokeStyle = theme.cave.trim;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, surfaceGroundY);
      ctx.lineTo(caveShaftX - 16, surfaceGroundY);
      ctx.lineTo(caveShaftX - 16, surfaceGroundY + 50);
      ctx.lineTo(caveShaftX + 16, surfaceGroundY + 50);
      ctx.lineTo(caveShaftX + 16, surfaceGroundY);
      ctx.lineTo(activeWorldWidth, surfaceGroundY);
      ctx.stroke();
 
      ctx.fillStyle = '#00ffff';
      ctx.font = '8px "Courier New"';
      ctx.fillText('⬇ CAVE MINE', caveShaftX - 25, surfaceGroundY - 8);
 
      // Planet 3 Mountain
      if (currentPlanet === 3) {
        planet3MountainPlatforms.forEach((platform, idx) => {
          ctx.fillStyle = idx % 2 === 0 ? '#68454d' : '#513844';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          ctx.fillStyle = '#ffad70';
          ctx.fillRect(platform.x, platform.y, platform.width, 4);
        });
        ctx.fillStyle = '#fff0bd';
        ctx.font = 'bold 9px "Courier New"';
        ctx.fillText('SUMMIT MERCHANT', planet3Summit.x - 20, planet3Summit.y - 18);
        drawCashierRobot(ctx, planet3Summit.x + 20, planet3Summit.y - 38, '#7860a0', '#f0c878');
      }
 
      // Planet 4 Glacial Ridge Platforms
      if (currentPlanet === 4) {
        planet4IcePlatforms.forEach((platform, idx) => {
          ctx.fillStyle = idx % 2 === 0 ? '#1f536e' : '#174359';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          ctx.fillStyle = '#7bf5ff';
          ctx.fillRect(platform.x, platform.y, platform.width, 4);
        });
        ctx.fillStyle = '#c8fbff';
        ctx.font = 'bold 9px "Courier New"';
        ctx.fillText('CRYO HERMIT', planet4Summit.x - 10, planet4Summit.y - 18);
        drawCashierRobot(ctx, planet4Summit.x + 20, planet4Summit.y - 38, '#1e526e', '#7bf5ff');
      }
 
      // Planet 2 Visiting Merchant
      if (currentPlanet === 2 && planet2MerchantActive) {
        ctx.fillStyle = '#173c38';
        ctx.fillRect(1142, surfaceGroundY - 32, 82, 32);
        ctx.strokeStyle = '#73ffcf';
        ctx.lineWidth = 2;
        ctx.strokeRect(1142, surfaceGroundY - 32, 82, 32);
        drawCashierRobot(ctx, 1167, surfaceGroundY - 47, '#3cbd9a', '#d9f4a1');
        ctx.fillStyle = '#e8fff7';
        ctx.font = '8px "Courier New"';
        ctx.fillText('VISITING MERCHANT (25% OFF)', 1115, surfaceGroundY - 54);
      }
 
      // Planet 5: Alien Civilization to the right of cave entrance!
      if (currentPlanet === 5) {
        // Civilization banner
        ctx.fillStyle = '#ff6bf0';
        ctx.font = 'bold 11px "Courier New"';
        ctx.fillText('✦ ZEPHYRIAN ALIEN CIVILIZATION ✦', 990, surfaceGroundY - 110);
 
        // 4 Alien Shacks & Dwellings
        drawAlienShack(ctx, 990, surfaceGroundY, 90, 75, 'ELDER SANCTUM', '#f783ff');
        drawAlienShack(ctx, 1170, surfaceGroundY, 85, 70, 'BOTANICAL SHACK', '#66ffcc');
        drawAlienShack(ctx, 1350, surfaceGroundY, 90, 72, 'PLASMA FORGE', '#ff9966');
        drawAlienShack(ctx, 1530, surfaceGroundY, 80, 65, 'SCRAPPER DEN', '#ff66b2');
 
        // Draw Alien NPCs
        alienCivilizationNPCs.forEach((npc) => {
          drawAlienNPC(ctx, npc.x, npc.y, npc.color, npc.accent, npc.id === 'elder_xylar');
          ctx.fillStyle = '#ffffff';
          ctx.font = '7px "Courier New"';
          ctx.textAlign = 'center';
          ctx.fillText(npc.name, npc.x + 8, npc.y - 14);
          ctx.fillStyle = npc.accent;
          ctx.font = '6px "Courier New"';
          ctx.fillText(npc.title, npc.x + 8, npc.y - 7);
          ctx.textAlign = 'left';
        });
 
        // Secret Void Runner Merchant in sacred obelisk at x: 1720
        ctx.fillStyle = '#26063b';
        ctx.fillRect(1710, surfaceGroundY - 80, 40, 80);
        ctx.strokeStyle = '#f783ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1710, surfaceGroundY - 80, 40, 80);
        drawAlienNPC(ctx, 1722, surfaceGroundY - 30, '#da5df5', '#ffd6fa', true);
        ctx.fillStyle = '#ffbcfd';
        ctx.font = '7px "Courier New"';
        ctx.fillText('VOID RUNNER', 1705, surfaceGroundY - 86);
      }
 
      // Rocket Landmark
      // On Planet 5, this is the Master Warp Rocket that unlocks permanent planet travel!
      const rocketX = 82;
      const rocketY = surfaceGroundY - 44;
      ctx.save();
      ctx.translate(rocketX + 28, rocketY + 22);
      ctx.rotate(-0.25);
      ctx.fillStyle = currentPlanet === 5 ? '#8034a8' : '#65717d';
      ctx.fillRect(-24, -14, 48, 28);
      ctx.fillStyle = currentPlanet === 5 ? '#ffd700' : '#aeb8c2';
      ctx.fillRect(-19, -10, 38, 5);
      ctx.strokeStyle = currentPlanet === 5 ? '#ff40c6' : '#ff8b62';
      ctx.lineWidth = 3;
      ctx.strokeRect(-24, -14, 48, 28);
      ctx.restore();
 
      ctx.fillStyle = currentPlanet === 5 ? '#ffd700' : '#ffcc78';
      ctx.font = 'bold 8px "Courier New"';
      ctx.fillText(
        currentPlanet === 5 ? 'MASTER WARP ROCKET' : 'PLANETARY ROCKET',
        rocketX - 10,
        surfaceGroundY - 2
      );
 
      drawPlayer(ctx);
    } else if (isCave) {
      // 2. DYNAMIC CAVE TERRAIN WITH UPWARD & DOWNWARD SLOPES!
      const caveTheme = theme.cave;
      ctx.fillStyle = caveTheme.background;
      ctx.fillRect(0, -1200, terrain.worldWidth, 3000);
 
      // Background cavern pattern
      const viewTop = camY - offY;
      const patY0 = -200 + 24 * Math.floor((viewTop + 200) / 24);
      const patX0 = Math.max(0, Math.floor(camX / 24) * 24);
      for (let y = patY0; y < viewTop + canvas.height + 24; y += 24) {
        for (let x = patX0; x < Math.min(terrain.worldWidth, camX + canvas.width + 24); x += 24) {
          const shade = ((x + y) / 24) % 2 === 0 ? caveTheme.a : caveTheme.b;
          ctx.fillStyle = shade;
          ctx.fillRect(x, y, 24, 24);
          ctx.fillStyle = caveTheme.rock;
          ctx.fillRect(x + 3, y + 3, 5, 5);
        }
      }
 
      // Dynamic sloped cave ceiling & floor polygons
      // 1. Draw solid rock ceiling down to ceilY
      ctx.fillStyle = caveTheme.floor;
      ctx.beginPath();
      ctx.moveTo(terrain.segments[0].x1, -1200);
      for (const seg of terrain.segments) {
        ctx.lineTo(seg.x1, seg.ceilY1);
        ctx.lineTo(seg.x2, seg.ceilY2);
      }
      ctx.lineTo(terrain.worldWidth, -1200);
      ctx.closePath();
      ctx.fill();
 
      // Ceiling trim
      ctx.strokeStyle = caveTheme.trim;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < terrain.segments.length; i++) {
        const seg = terrain.segments[i];
        if (i === 0) ctx.moveTo(seg.x1, seg.ceilY1);
        ctx.lineTo(seg.x2, seg.ceilY2);
      }
      ctx.stroke();
 
      // 2. Draw solid rock floor from floorY down to bottom
      ctx.fillStyle = caveTheme.floor;
      ctx.beginPath();
      ctx.moveTo(terrain.segments[0].x1, 1800);
      for (const seg of terrain.segments) {
        ctx.lineTo(seg.x1, seg.floorY1);
        ctx.lineTo(seg.x2, seg.floorY2);
      }
      ctx.lineTo(terrain.worldWidth, 1800);
      ctx.closePath();
      ctx.fill();
 
      // Floor trim
      ctx.strokeStyle = caveTheme.trim;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < terrain.segments.length; i++) {
        const seg = terrain.segments[i];
        if (i === 0) ctx.moveTo(seg.x1, seg.floorY1);
        ctx.lineTo(seg.x2, seg.floorY2);
      }
      ctx.stroke();
 
      // Elevated rocky platforms inside cavern
      terrain.platforms.forEach((plat) => {
        ctx.fillStyle = plat.color || caveTheme.rock;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeStyle = caveTheme.trim;
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(plat.x + 4, plat.y + 2, plat.width - 8, 2);
      });
 
      // Shaft exit ladder / lift
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(caveShaftX - 16, -200);
      ctx.lineTo(caveShaftX - 16, 250);
      ctx.moveTo(caveShaftX + 16, -200);
      ctx.lineTo(caveShaftX + 16, 250);
      ctx.stroke();
      // Ladder rungs
      for (let ly = -200; ly < 250; ly += 14) {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(caveShaftX - 16, ly, 32, 2);
      }
 
      // Draw Ores
      caveOres.forEach((ore, index) => {
        drawPixelCrystalSprite(ctx, ore.x, ore.y, ore.type.color);
 
        if (ore.currentHp < ore.type.hp) {
          ctx.fillStyle = '#ffff00';
          const pWidth = (ore.currentHp / ore.type.hp) * 16;
          ctx.fillRect(ore.x - 8, ore.y - 12, pWidth, 2);
        }
 
        if (miningOreIndex === index) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fillRect(ore.x - 14, ore.y - 18, 28, 4);
          ctx.fillStyle = '#00ffff';
          ctx.fillRect(
            ore.x - 13,
            ore.y - 17,
            ((ore.type.hp - ore.currentHp) / ore.type.hp) * 26,
            2
          );
        }
      });
 
      drawPlayer(ctx);
    } else if (isMall || isMallUpper) {
      // 3. Mall Interior & Upper Deck
      const mall = theme.mall;
      ctx.fillStyle = '#080b12';
      ctx.fillRect(0, -600, 1600, 1400);
 
      ctx.fillStyle = mall.wall;
      ctx.fillRect(0, 20, 1600, 190);
      ctx.fillStyle = mall.floor;
      ctx.fillRect(0, indoorGroundY, 1600, 60);
 
      ctx.strokeStyle = mall.trim;
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 20, 1600, 190);
 
      // Upper floor stairs / portal
      ctx.fillStyle = mall.panel;
      ctx.fillRect(900, 145, 160, 14);
      ctx.fillStyle = mall.accent;
      ctx.fillRect(920, 158, 120, 8);
      ctx.fillStyle = '#f4fbff';
      ctx.font = 'bold 9px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText(
        isMallUpper ? 'STAIRS TO LOWER DECK' : 'STAIRS TO UPPER DECK',
        980,
        138
      );
      ctx.textAlign = 'left';
 
      if (isMall) {
        // Doors to shops
        const doors = [
          { name: `${mall.manager} HQ`, x: 120 },
          { name: mall.shops[1], x: 280 },
          { name: mall.shops[2], x: 470 },
          { name: mall.shops[3], x: 660 },
        ];
 
        doors.forEach((d, i) => {
          const [body, accent] = mall.keeperColors[i];
          ctx.fillStyle = mall.panel;
          ctx.fillRect(d.x - 46, 76, 92, 22);
          ctx.strokeStyle = theme.logoColor;
          ctx.strokeRect(d.x - 46, 76, 92, 22);
 
          ctx.fillStyle = '#f4fbff';
          ctx.font = 'bold 6px "Courier New"';
          ctx.textAlign = 'center';
          ctx.fillText(mall.shops[i], d.x, 90);
 
          ctx.fillStyle = mall.wall;
          ctx.fillRect(d.x - 26, 138, 60, 74);
          ctx.strokeStyle = mall.trim;
          ctx.strokeRect(d.x - 26, 138, 60, 74);
 
          ctx.fillStyle = mall.accent;
          ctx.font = '7px "Courier New"';
          ctx.fillText(mall.keepers[i], d.x, 130);
 
          drawCashierRobot(ctx, d.x - 10, 157, body, accent);
        });
 
        // Dresser Shop & Suit Boutique in all malls!
        const dresserX = 810;
        ctx.fillStyle = mall.panel;
        ctx.fillRect(dresserX - 46, 76, 92, 22);
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 2;
        ctx.strokeRect(dresserX - 46, 76, 92, 22);
 
        ctx.fillStyle = '#ffb3d9';
        ctx.font = 'bold 6px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('DRESSER & SUITS', dresserX, 90);
 
        ctx.fillStyle = mall.wall;
        ctx.fillRect(dresserX - 26, 138, 60, 74);
        ctx.strokeStyle = '#ff007f';
        ctx.strokeRect(dresserX - 26, 138, 60, 74);
 
        ctx.fillStyle = '#ff66b2';
        ctx.font = '7px "Courier New"';
        ctx.fillText('Tailor Stitch', dresserX, 130);
 
        // Dresser robot shopkeeper
        drawCashierRobot(ctx, dresserX - 10, 157, '#2b1b3d', '#ff007f');
 
        // Fashion mannequin display wearing a suit
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(dresserX + 18, 162, 10, 14);
        ctx.fillStyle = '#ffd0a0';
        ctx.fillRect(dresserX + 21, 156, 4, 6);
        ctx.fillStyle = '#e52521';
        ctx.fillRect(dresserX + 20, 154, 6, 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px "Courier New"';
        ctx.fillText('👔', dresserX + 20, 148);
      } else {
        // Upper floor with elite shops and Gambler Vent on Planet 1!
        if (currentPlanet === 1) {
          ctx.fillStyle = '#0b101c';
          ctx.fillRect(gamblerVentX - 38, 126, 76, 72);
          ctx.strokeStyle = '#c87bff';
          ctx.lineWidth = 2;
          ctx.strokeRect(gamblerVentX - 38, 126, 76, 72);
          for (let ventY = 135; ventY < 192; ventY += 9) {
            ctx.fillStyle = '#8656a7';
            ctx.fillRect(gamblerVentX - 29, ventY, 58, 3);
          }
          ctx.fillStyle = '#f1dcff';
          ctx.font = 'bold 8px "Courier New"';
          ctx.fillText("GAMBLER'S VENT", gamblerVentX - 35, 118);
        }
 
        // Elite shop doors
        ctx.fillStyle = '#0d1528';
        ctx.fillRect(240, 120, 76, 72);
        ctx.strokeStyle = mall.trim;
        ctx.strokeRect(240, 120, 76, 72);
        ctx.fillStyle = '#eafcff';
        ctx.font = '7px "Courier New"';
        ctx.fillText(`${mall.keepers[3]} ELITE`, 245, 112);
 
        ctx.fillStyle = '#0d1528';
        ctx.fillRect(610, 120, 96, 72);
        ctx.strokeStyle = theme.logoColor;
        ctx.strokeRect(610, 120, 96, 72);
        ctx.fillStyle = '#eafcff';
        ctx.font = '7px "Courier New"';
        ctx.fillText(`${mall.keepers[2]} ELITE`, 615, 112);
      }
 
      ctx.textAlign = 'left';
      drawPlayer(ctx);
    } else {
      // 4. Shop Interior Rooms (Office, Gem, Bag, Pickaxe, Gambler)
      const mall = theme.mall;
      ctx.fillStyle = '#080b12';
      ctx.fillRect(0, -600, 1600, 1400);
 
      ctx.fillStyle = mall.floor;
      ctx.fillRect(0, indoorGroundY, 1600, 60);
 
      ctx.fillStyle = mall.wall;
      ctx.fillRect(0, 20, 1600, indoorGroundY - 20);
      ctx.strokeStyle = mall.trim;
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 20, 1570, 190);
 
      const ax = 240;
      const ay = 155;
 
      if (currentDimension === 'gambler_interior') {
        ctx.fillStyle = '#251638';
        ctx.fillRect(70, 60, 250, 110);
        ctx.strokeStyle = '#c87bff';
        ctx.strokeRect(70, 60, 250, 110);
        ctx.fillStyle = '#f1dcff';
        ctx.font = '12px "Courier New"';
        ctx.fillText("DRUNK ALIEN'S VAULT", 105, 52);
 
        drawCashierRobot(ctx, ax + 3, ay - 8, '#738d5b', '#d5c27a');
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px "Courier New"';
        ctx.fillText('DRUNK ALIEN', ax - 10, ay - 14);
      } else if (currentDimension === 'robit_office') {
        drawCashierRobot(ctx, ax, ay - 8, mall.keeperColors[0][0], mall.keeperColors[0][1]);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px "Courier New"';
        ctx.fillText(mall.manager, ax - 10, ay - 14);
      } else {
        drawCashierRobot(ctx, ax, ay - 8, mall.keeperColors[1][0], mall.keeperColors[1][1]);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px "Courier New"';
        ctx.fillText('SHOPKEEPER', ax - 10, ay - 14);
      }
 
      drawPlayer(ctx);
    }
 
    ctx.restore();
  }, [
    player,
    currentDimension,
    currentPlanet,
    caveOres,
    miningOreIndex,
    miningAnimTimer,
    breathingTimer,
    planet2MerchantActive,
    cutsceneActive,
    cutsceneTimer,
    view.w,
    view.h,
  ]);
 
  // Click / touch to mine crystal in cave
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentDimension !== 'cave') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
 
    const rect = canvas.getBoundingClientRect();
    const terrain = generatePlanetCaveTerrain(currentPlanet);
    const camX = Math.max(0, Math.min(Math.max(0, terrain.worldWidth - canvas.width), player.x - canvas.width / 2));
    const camY = Math.max(-250, Math.min(180, player.y - BASE_H * 0.5));
    const offY = Math.round(Math.max(0, canvas.height - BASE_H) / 2);
 
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
 
    const clickX = (e.clientX - rect.left) * scaleX + camX;
    const clickY = (e.clientY - rect.top) * scaleY + camY - offY;
 
    let selected = -1;
    let bestDist = Infinity;
 
    caveOres.forEach((ore, index) => {
      const dist = Math.hypot(clickX - ore.x, clickY - ore.y);
      const playerDist = Math.hypot(player.x - ore.x, player.y - ore.y);
      if (dist < 26 && playerDist < 95 && dist < bestDist) {
        selected = index;
        bestDist = dist;
      }
    });
 
    if (selected >= 0) {
      onMineOre(selected);
    }
  };
 
  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={view.w}
        height={view.h}
        onClick={handleCanvasClick}
        style={view.cssW ? { width: view.cssW, height: view.cssH } : undefined}
        className="pixel-rendering cursor-crosshair select-none touch-none"
      />
    </div>
  );
};
 