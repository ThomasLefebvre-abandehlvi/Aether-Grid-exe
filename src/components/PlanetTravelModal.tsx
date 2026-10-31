import React from 'react';
import { planetThemes } from '../data/planets';

interface PlanetTravelModalProps {
  isOpen: boolean;
  currentPlanet: number;
  highestUnlockedPlanet: number;
  devMode: boolean;
  onSelectPlanet: (planet: number) => void;
  onClose: () => void;
}

export const PlanetTravelModal: React.FC<PlanetTravelModalProps> = ({
  isOpen,
  currentPlanet,
  highestUnlockedPlanet,
  devMode,
  onSelectPlanet,
  onClose,
}) => {
  if (!isOpen) return null;

  const maxPlanet = devMode ? 5 : highestUnlockedPlanet;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none"
    >
      <div className="w-full max-w-md rounded-xl border-2 border-[#7effc4] bg-[#101026] p-5 text-center font-mono shadow-[0_0_24px_rgba(126,255,196,0.35)]">
        <h2 className="font-bold text-sm sm:text-base text-[#7effc4]">PLANETARY WARP MATRIX</h2>
        <p className="text-xs text-gray-300 mt-1">
          Current Station: <span className="text-yellow-400 font-bold">{planetThemes[currentPlanet]?.name}</span>
        </p>

        <div className="grid gap-2.5 my-4">
          {[1, 2, 3, 4, 5].map((planet) => {
            const theme = planetThemes[planet];
            const isCurrent = planet === currentPlanet;
            const isUnlocked = planet <= maxPlanet;

            return (
              <button
                key={planet}
                onClick={() => {
                  if (isUnlocked && !isCurrent) onSelectPlanet(planet);
                }}
                disabled={!isUnlocked || isCurrent}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 opacity-90 cursor-default'
                    : isUnlocked
                    ? 'border-[#7effc4]/60 bg-[#17172f] hover:bg-[#7effc4] hover:text-black hover:border-[#7effc4] active:scale-98 cursor-pointer'
                    : 'border-gray-800 bg-[#0d0d18] text-gray-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm">
                    Planet {planet}: {theme.name}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {theme.mallName} • {theme.tagline}
                  </div>
                </div>

                <span className="text-xs font-bold">
                  {isCurrent ? 'HERE' : isUnlocked ? 'WARP 🚀' : 'LOCKED 🔒'}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="rounded border border-red-500/70 px-4 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
