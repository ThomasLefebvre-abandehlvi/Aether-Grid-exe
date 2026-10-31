import React, { useState } from 'react';
import { GearReward, MysteryBoxTier } from '../types/game';

interface BoxModalProps {
  isOpen: boolean;
  mysteryBoxes: Record<string, MysteryBoxTier>;
  playerMoney: number;
  devMode: boolean;
  onOpenBox: (tierKey: string) => GearReward | null;
  onClose: () => void;
}

export const BoxModal: React.FC<BoxModalProps> = ({
  isOpen,
  mysteryBoxes,
  playerMoney,
  devMode,
  onOpenBox,
  onClose,
}) => {
  const [opening, setOpening] = useState(false);
  const [revealedReward, setRevealedReward] = useState<GearReward | null>(null);
  const [revealIcon, setRevealIcon] = useState('◇');
  const [revealStatus, setRevealStatus] = useState('Opening...');

  if (!isOpen) return null;

  const handlePickTier = (tierKey: string) => {
    if (opening) return;
    const reward = onOpenBox(tierKey);
    if (!reward) return;

    setOpening(true);
    setRevealedReward(reward);
    setRevealStatus('SEAL CRACKING...');

    let ticks = 0;
    const icons = ['◇', '◆', '✦', '✧', '⚒', '◈'];
    const timer = setInterval(() => {
      ticks++;
      setRevealIcon(icons[ticks % icons.length]);
      if (ticks >= 8) {
        clearInterval(timer);
        setOpening(false);
        setRevealStatus('GEAR UNLOCKED & EQUIPPED');
      }
    }, 120);
  };

  const handleResetPicker = () => {
    setRevealedReward(null);
  };

  const balanceLabel = devMode ? '∞' : `$${playerMoney.toLocaleString()}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none"
    >
      <div className="w-full max-w-lg rounded-xl border-2 border-purple-500 bg-[#101026] p-5 font-mono shadow-[0_0_24px_rgba(200,123,255,0.4)]">
        <div className="flex items-center justify-between border-b border-purple-900 pb-3 mb-3">
          <div>
            <h2 className="font-bold text-base text-purple-300">DRUNK ALIEN'S GEAR VAULT</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Balance: <span className="text-yellow-400 font-bold">{balanceLabel}</span> | Every box rewards gear!
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={opening}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-700"
          >
            CLOSE
          </button>
        </div>

        {revealedReward ? (
          <div className="py-6 text-center">
            <div className={`text-5xl my-3 ${opening ? 'animate-spin' : 'animate-bounce'}`}>
              {revealIcon}
            </div>
            <div className="text-xs text-purple-300 font-bold tracking-widest">{revealStatus}</div>
            {!opening && (
              <div className="mt-4 p-4 rounded-lg bg-[#1a1733] border border-purple-400">
                <h3 className="text-base font-bold text-yellow-300">{revealedReward.name}</h3>
                <p className="text-xs text-cyan-300 mt-1">
                  [{revealedReward.tier} {revealedReward.slot.toUpperCase()}] {revealedReward.detail}
                </p>
                <button
                  onClick={handleResetPicker}
                  className="mt-4 rounded bg-purple-500 hover:bg-purple-400 text-black px-4 py-2 text-xs font-bold transition-all"
                >
                  OPEN ANOTHER BOX
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            {Object.entries(mysteryBoxes).map(([key, box]) => {
              const canAfford = devMode || playerMoney >= box.cost;
              return (
                <button
                  key={key}
                  onClick={() => handlePickTier(key)}
                  disabled={!canAfford || opening}
                  className={`rounded-lg border-2 p-3 text-center transition-all ${
                    canAfford
                      ? 'bg-[#17172f] hover:bg-[#252345] active:scale-95'
                      : 'bg-[#101020] opacity-50 cursor-not-allowed'
                  }`}
                  style={{ borderColor: box.color }}
                >
                  <strong className="block text-sm" style={{ color: box.color }}>
                    {box.label} BOX
                  </strong>
                  <div className="text-xs text-yellow-300 my-1 font-bold">
                    ${box.cost.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400">Guaranteed Gear</div>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-purple-950 flex justify-end">
          <button
            onClick={onClose}
            disabled={opening}
            className="rounded border border-red-500 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
          >
            EXIT VAULT
          </button>
        </div>
      </div>
    </div>
  );
};
