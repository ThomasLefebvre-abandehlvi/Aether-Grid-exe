import React from 'react';
import { Dimension } from '../types/game';
import { planetThemes } from '../data/planets';

interface HUDProps {
  money: number;
  devMode: boolean;
  currentWeight: number;
  maxWeight: number;
  miningPower: number;
  speed: number;
  currentPlanet: number;
  currentDimension: Dimension;
  planetTravelUnlocked: boolean;
  mobileControlsActive: boolean;
  onToggleMobileControls: () => void;
  onOpenTravelModal: () => void;
  onToggleMenu: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  money,
  devMode,
  currentWeight,
  maxWeight,
  miningPower,
  speed,
  currentPlanet,
  currentDimension,
  planetTravelUnlocked,
  mobileControlsActive,
  onToggleMobileControls,
  onOpenTravelModal,
  onToggleMenu,
  audioMuted,
  onToggleAudio,
}) => {
  const theme = planetThemes[currentPlanet] || planetThemes[1];

  const getDimensionLabel = () => {
    switch (currentDimension) {
      case 'surface':
        return `Surface (${theme.name})`;
      case 'cave':
        return `Subterranean Mine`;
      case 'mall_interior':
        return theme.mallName;
      case 'mall_upper':
        return `${theme.mallName} Upper Deck`;
      case 'robit_office':
        return `${theme.mall.manager} HQ`;
      case 'gem_interior':
        return `${theme.mall.shops[1]}`;
      case 'bag_interior':
        return `${theme.mall.shops[2]}`;
      case 'pickaxe_interior':
        return `${theme.mall.shops[3]}`;
      case 'better_bag_interior':
        return `${theme.mall.shops[2]} Elite`;
      case 'better_pickaxe_interior':
        return `${theme.mall.shops[3]} Elite`;
      case 'gambler_interior':
        return `Drunk Alien's Vault`;
      case 'cryo_hermit_interior':
        return `Cryo Alchemist Shack`;
      default:
        return 'Unknown';
    }
  };

  const moneyLabel = devMode ? '∞' : `$${money.toLocaleString()}`;

  return (
    <header className="fixed top-2 left-0 right-0 z-30 flex items-center justify-between px-2 sm:px-4 pointer-events-none select-none">
      {/* Left side: Quick actions (Travel & Audio) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {planetTravelUnlocked && (
          <button
            onClick={onOpenTravelModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#101026]/90 border border-[#7effc4] text-[#7effc4] font-mono text-xs font-bold shadow-[0_0_10px_rgba(126,255,196,0.3)] hover:bg-[#7effc4] hover:text-[#0a0d1f] active:scale-95 transition-all"
            title="Warp Travel across planets"
          >
            <span>🚀</span>
            <span className="hidden sm:inline">WARP</span>
          </button>
        )}

        <button
          onClick={onToggleAudio}
          className="p-1.5 rounded bg-[#101026]/90 border border-cyan-500/60 text-cyan-300 font-mono text-xs hover:border-cyan-400 active:scale-95 transition-all"
          title={audioMuted ? 'Unmute BGM' : 'Mute BGM'}
        >
          {audioMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Center: Main Stat Bar HUD */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-[#0a0a19]/95 border-2 border-cyan-400 px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm text-yellow-300 shadow-[0_0_15px_rgba(0,255,255,0.4)] backdrop-blur-md">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-[10px] sm:text-xs">$$</span>
          <span className="font-bold text-yellow-400">{moneyLabel}</span>
        </div>

        <span className="text-cyan-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-[10px] sm:text-xs">BAG:</span>
          <span className={currentWeight >= maxWeight ? 'text-red-400 font-bold' : 'text-cyan-300'}>
            {currentWeight}/{maxWeight}
          </span>
        </div>

        <span className="text-cyan-700 hidden xs:inline">|</span>

        <div className="hidden xs:flex items-center gap-1">
          <span className="text-gray-400 text-[10px] sm:text-xs">PWR:</span>
          <span className="text-green-400 font-bold">{miningPower}</span>
        </div>

        <span className="text-cyan-700 hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-gray-400 text-[10px] sm:text-xs">SPD:</span>
          <span className="text-blue-300">{speed.toFixed(1)}</span>
        </div>

        <span className="text-cyan-700">|</span>

        {/* Mobile Controls Toggle Button on the Stat Bar */}
        <button
          onClick={onToggleMobileControls}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold transition-all border ${
            mobileControlsActive
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_8px_rgba(0,255,255,0.7)]'
              : 'bg-cyan-950/70 text-cyan-300 border-cyan-700 hover:border-cyan-400'
          }`}
          title="Toggle On-Screen Mobile Controls"
        >
          <span>📱</span>
          <span className="hidden sm:inline">CONTROLS</span>
        </button>
      </div>

      {/* Right side: Location badge & 3-dots Menu Button */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="hidden md:flex flex-col items-end px-2.5 py-1 rounded bg-[#0a0a19]/80 border border-cyan-900 text-right font-mono text-[11px]">
          <span className="text-cyan-400 font-bold">{theme.name}</span>
          <span className="text-gray-400 text-[9px]">{getDimensionLabel()}</span>
        </div>

        <button
          onClick={onToggleMenu}
          aria-label="Game Menu"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#0a0a19]/90 text-cyan-400 font-bold text-lg hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_12px_rgba(0,255,255,0.6)] active:scale-95 transition-all"
        >
          ⋯
        </button>
      </div>
    </header>
  );
};
