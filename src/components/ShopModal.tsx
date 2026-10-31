import React from 'react';

export interface ShopCardItem {
  id?: string;
  name: string;
  subtitle: string;
  cost: number;
  originalCost?: number;
  discountTag?: string;
  badge?: string;
  onBuy: () => void;
}

interface ShopModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  items: ShopCardItem[];
  playerMoney: number;
  devMode: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  title,
  subtitle,
  items,
  playerMoney,
  devMode,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none"
    >
      <div className="w-full max-w-lg rounded-xl border-2 border-orange-500 bg-[#101026] p-5 font-mono shadow-[0_0_24px_rgba(255,102,0,0.5)]">
        <div className="flex items-center justify-between border-b border-orange-900 pb-3 mb-3">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-orange-400">{title}</h2>
            {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded border border-gray-700"
          >
            CLOSE [ESC]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
          {items.map((item, idx) => {
            const canAfford = devMode || playerMoney >= item.cost;
            return (
              <div
                key={idx}
                onClick={() => {
                  item.onBuy();
                }}
                className={`group relative rounded-lg border-2 p-3 text-left transition-all cursor-pointer ${
                  canAfford
                    ? 'border-orange-500/70 bg-[#1a1a3a]/80 hover:bg-orange-500 hover:text-black hover:border-orange-300 active:scale-98'
                    : 'border-gray-700/60 bg-[#131326]/60 opacity-60'
                }`}
              >
                {item.discountTag && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/40">
                    {item.discountTag}
                  </span>
                )}

                <div className="font-bold text-xs sm:text-sm group-hover:text-black">
                  {item.name}
                </div>
                <div className="text-[11px] text-gray-300 group-hover:text-black/80 mt-1">
                  {item.subtitle}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs font-bold">
                  {item.originalCost ? (
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-gray-500 text-[10px]">
                        ${item.originalCost.toLocaleString()}
                      </span>
                      <span className="text-green-400 group-hover:text-black">
                        ${item.cost.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-yellow-400 group-hover:text-black">
                      ${item.cost.toLocaleString()}
                    </span>
                  )}

                  <span className="text-[10px] text-gray-400 group-hover:text-black font-normal">
                    {canAfford ? 'CLICK TO BUY' : 'NEED FUNDS'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-orange-950 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-red-500 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
          >
            EXIT SHOP
          </button>
        </div>
      </div>
    </div>
  );
};
