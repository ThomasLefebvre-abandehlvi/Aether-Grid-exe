import React, { useState } from 'react';
import { PlayerSkin } from '../types/game';
import { playerSkins } from '../data/skins';

interface DresserModalProps {
  isOpen: boolean;
  playerMoney: number;
  devMode: boolean;
  unlockedSkins: string[];
  currentSkinId: string;
  onBuySkin: (skin: PlayerSkin) => void;
  onEquipSkin: (skinId: string) => void;
  onClose: () => void;
}

export const DresserModal: React.FC<DresserModalProps> = ({
  isOpen,
  playerMoney,
  devMode,
  unlockedSkins,
  currentSkinId,
  onBuySkin,
  onEquipSkin,
  onClose,
}) => {
  const [selectedSkinId, setSelectedSkinId] = useState<string>(currentSkinId || 'default');

  if (!isOpen) return null;

  const selectedSkin =
    playerSkins.find((s) => s.id === selectedSkinId) || playerSkins[0];
  const isUnlocked = unlockedSkins.includes(selectedSkin.id);
  const isEquipped = currentSkinId === selectedSkin.id;
  const canAfford = devMode || playerMoney >= selectedSkin.cost;

  // Mini preview renderer using SVG pixel blocks for the selected skin!
  const renderPixelPreview = (skin: PlayerSkin) => {
    const p = skin.palette;
    const isMario = p.hasMustache;

    return (
      <svg viewBox="0 0 32 40" className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
        {/* Shadow */}
        <ellipse cx="16" cy="38" rx="10" ry="2" fill="rgba(0,0,0,0.5)" />

        {/* Aura glow if available */}
        {p.auraColor && (
          <ellipse cx="16" cy="20" rx="14" ry="16" fill={p.auraColor} />
        )}

        {/* Backpack / Tank */}
        <rect x="5" y="14" width="5" height="13" fill={p.backpack} rx="1" />
        <rect x="6" y="16" width="3" height="7" fill={p.backpackTank} />

        {/* Legs & Overalls / Pants */}
        <rect x="11" y="24" width="4" height="9" fill={p.legs} />
        <rect x="17" y="24" width="4" height="9" fill={p.legs} />
        <rect x="11" y="27" width="4" height="5" fill={p.legsShade} />
        <rect x="17" y="27" width="4" height="5" fill={p.legsShade} />

        {/* Boots */}
        <rect x="9" y="32" width="6" height="4" fill={p.boots} rx="1" />
        <rect x="17" y="32" width="6" height="4" fill={p.boots} rx="1" />
        <rect x="9" y="35" width="6" height="1" fill={p.bootSoles} />
        <rect x="17" y="35" width="6" height="1" fill={p.bootSoles} />

        {/* Torso Suit / Shirt */}
        <rect x="10" y="13" width="12" height="12" fill={p.torso} rx="1" />
        <rect x="10" y="18" width="12" height="6" fill={p.torsoShade} />
        {/* Belt */}
        <rect x="10" y="22" width="12" height="2" fill={p.belt} />
        <rect x="15" y="22" width="2" height="2" fill={p.beltBuckle} />

        {/* Torso Detail (e.g. Mario overalls buttons or armor crest) */}
        {isMario ? (
          <>
            <rect x="11" y="17" width="2" height="6" fill={p.legs} />
            <rect x="19" y="17" width="2" height="6" fill={p.legs} />
            <rect x="11" y="17" width="2" height="2" fill={p.torsoDetail} />
            <rect x="19" y="17" width="2" height="2" fill={p.torsoDetail} />
          </>
        ) : (
          <rect x="15" y="15" width="2" height="4" fill={p.torsoDetail} />
        )}

        {/* Arms */}
        <rect x="7" y="14" width="3" height="8" fill={p.torso} rx="1" />
        <rect x="7" y="20" width="3" height="3" fill={p.gloves} />
        <rect x="22" y="14" width="3" height="8" fill={p.torso} rx="1" />
        <rect x="22" y="20" width="3" height="3" fill={p.gloves} />

        {/* Head / Helmet / Face */}
        {isMario ? (
          <>
            {/* Peach face */}
            <rect x="11" y="6" width="10" height="8" fill={p.skinTone || '#ffd0a0'} rx="1" />
            {/* Nose */}
            <rect x="19" y="9" width="3" height="3" fill="#ffa07a" rx="1" />
            {/* Eyes */}
            <rect x="17" y="7" width="2" height="3" fill="#000000" />
            {/* Mustache */}
            <rect x="15" y="11" width="7" height="3" fill={p.mustacheColor || '#2b1b17'} rx="1" />
            {/* Sideburns / Hair */}
            <rect x="10" y="7" width="2" height="5" fill="#2b1b17" />
            {/* Red Cap with visor brim */}
            <rect x="10" y="3" width="12" height="5" fill={p.helmet} rx="1" />
            <rect x="14" y="5" width="8" height="2" fill={p.helmet} />
            {/* Cap emblem */}
            <rect x="14" y="3" width="4" height="3" fill="#ffffff" rx="1" />
            <text x="16" y="5.5" fontSize="3" fontWeight="bold" fill="#e52521" textAnchor="middle" dominantBaseline="central">M</text>
          </>
        ) : (
          <>
            {/* Helmet base */}
            <rect x="10" y="4" width="12" height="10" fill={p.helmet} rx="2" />
            <rect x="10" y="10" width="12" height="4" fill={p.helmetShade} />
            <rect x="12" y="4" width="8" height="2" fill={p.helmetHighlight} />

            {/* Crown if crown type */}
            {p.hatType === 'crown' && (
              <>
                <polygon points="11,4 12,1 14,3 16,0 18,3 20,1 21,4" fill="#ffd700" stroke="#b39700" strokeWidth="0.5" />
                <circle cx="16" cy="1.5" r="0.75" fill="#ff0055" />
              </>
            )}

            {/* Visor */}
            <rect x="13" y="7" width="8" height="5" fill={p.visor} rx="1" />
            <rect x="14" y="8" width="3" height="1.5" fill={p.visorReflection} />
          </>
        )}
      </svg>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none"
    >
      <div className="w-full max-w-2xl rounded-2xl border-2 border-pink-500 bg-[#0f0b18] p-5 font-mono shadow-[0_0_30px_rgba(255,0,128,0.45)] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👔</span>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-pink-400">
                AETHER DRESSER & SUIT BOUTIQUE
              </h2>
              <p className="text-[11px] text-gray-400">
                Customize your pixel explorer appearance across all planets!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-yellow-300 font-bold px-2 py-1 rounded bg-black/60 border border-yellow-500/40">
              {devMode ? '∞' : `$${playerMoney.toLocaleString()}`}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
            >
              CLOSE [ESC]
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-y-auto pr-1">
          {/* Left / Top: Live Pixel Preview & Details */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-pink-500/40 bg-[#171026] text-center">
            <div className="p-3 rounded-xl bg-black/50 border border-pink-500/30 flex items-center justify-center mb-3">
              {renderPixelPreview(selectedSkin)}
            </div>

            <h3 className="font-bold text-sm text-yellow-300">{selectedSkin.name}</h3>
            <span className="text-[10px] text-pink-300 font-semibold px-2 py-0.5 rounded bg-pink-950 border border-pink-500/30 my-1">
              {selectedSkin.category} Series
            </span>

            <p className="text-[11px] text-gray-300 mt-2 leading-relaxed px-2">
              {selectedSkin.description}
            </p>

            <div className="mt-4 w-full">
              {isEquipped ? (
                <div className="w-full py-2 rounded bg-green-500/20 border border-green-400 text-green-300 font-bold text-xs">
                  ✓ CURRENTLY EQUIPPED
                </div>
              ) : isUnlocked ? (
                <button
                  onClick={() => onEquipSkin(selectedSkin.id)}
                  className="w-full py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  EQUIP SUIT
                </button>
              ) : (
                <button
                  onClick={() => onBuySkin(selectedSkin)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 rounded font-bold text-xs shadow-md active:scale-95 transition-all ${
                    canAfford
                      ? 'bg-pink-500 hover:bg-pink-400 text-black'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford
                    ? `BUY & EQUIP ($${selectedSkin.cost.toLocaleString()})`
                    : `NEED $${selectedSkin.cost.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          {/* Right: Skins Selection Grid */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[55vh]">
            {playerSkins.map((skin) => {
              const unlocked = unlockedSkins.includes(skin.id);
              const equipped = currentSkinId === skin.id;
              const isSelected = selectedSkinId === skin.id;

              return (
                <div
                  key={skin.id}
                  onClick={() => setSelectedSkinId(skin.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-yellow-400 bg-[#25173e] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                      : 'border-pink-900/60 bg-[#150e24] hover:border-pink-500 hover:bg-[#1f1334]'
                  }`}
                >
                  {equipped && (
                    <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded bg-green-500 text-black">
                      EQUIPPED
                    </span>
                  )}
                  {!equipped && unlocked && (
                    <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      OWNED
                    </span>
                  )}

                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: skin.palette.helmet }}
                    />
                    {skin.name}
                  </div>

                  <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                    {skin.description}
                  </div>

                  <div className="mt-2 text-[11px] font-bold">
                    {unlocked ? (
                      <span className="text-cyan-400">Unlocked</span>
                    ) : (
                      <span className="text-yellow-400">
                        ${skin.cost.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-pink-950 flex justify-between items-center text-xs text-gray-400">
          <span>Unlocked: {unlockedSkins.length}/{playerSkins.length} Suits</span>
          <button
            onClick={onClose}
            className="rounded border border-red-500/70 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
          >
            EXIT BOUTIQUE
          </button>
        </div>
      </div>
    </div>
  );
};
