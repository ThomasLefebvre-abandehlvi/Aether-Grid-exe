import React from 'react';

interface SpeedModalProps {
  isOpen: boolean;
  cost: number;
  devMode: boolean;
  playerMoney: number;
  currentSpeed: number;
  onUpgrade: () => void;
  onClose: () => void;
}

export const SpeedModal: React.FC<SpeedModalProps> = ({
  isOpen,
  cost,
  devMode,
  playerMoney,
  currentSpeed,
  onUpgrade,
  onClose,
}) => {
  if (!isOpen) return null;

  const canAfford = devMode || playerMoney >= cost;
  const costLabel = devMode ? 'FREE' : `$${cost}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none"
    >
      <div className="w-full max-w-xs rounded-xl border-2 border-green-500 bg-[#101026] p-5 text-center font-mono shadow-[0_0_24px_rgba(0,204,102,0.5)]">
        <h2 className="font-bold text-sm text-green-400">⚡ SPEED CAPSULE</h2>
        <p className="text-xs text-gray-300 mt-2">
          Current Speed: <span className="text-cyan-300 font-bold">{currentSpeed.toFixed(1)}</span>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Cost: <span className="text-yellow-400 font-bold">{costLabel}</span> (+0.25 Speed)
        </p>

        <button
          onClick={onUpgrade}
          disabled={!canAfford}
          className={`mt-4 w-full rounded py-2.5 text-xs font-bold font-mono transition-all ${
            canAfford
              ? 'bg-green-500 hover:bg-green-400 text-black active:scale-95 shadow-md'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          UPGRADE SPEED
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded border border-red-500/70 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
        >
          EXIT
        </button>
      </div>
    </div>
  );
};
