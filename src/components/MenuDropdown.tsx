import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedback: () => void;
  onOpenDresser?: () => void;
  onResetProgress: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
  onShowMessage: (msg: string) => void;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  isOpen,
  onClose,
  onOpenFeedback,
  onOpenDresser,
  onResetProgress,
  audioMuted,
  onToggleAudio,
  onShowMessage,
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="fixed right-3 top-14 z-50 min-w-[220px] rounded-lg border-2 border-cyan-400 bg-[#0a0a19]/95 p-1 font-mono text-xs shadow-[0_0_20px_rgba(0,255,255,0.4)] backdrop-blur-md select-none"
    >
      {/* Feedback button - prominently featured! */}
      <button
        onClick={() => {
          onClose();
          onOpenFeedback();
        }}
        className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-yellow-300 hover:bg-cyan-500/20 active:scale-98 transition-all"
      >
        <span>✉️</span>
        <span className="font-bold">Feedback</span>
      </button>

      {/* Wardrobe & Skins Dresser */}
      {onOpenDresser && (
        <button
          onClick={() => {
            onClose();
            onOpenDresser();
          }}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-pink-300 hover:bg-pink-500/20 active:scale-98 transition-all"
        >
          <span>👔</span>
          <span className="font-bold">Suit Wardrobe</span>
        </button>
      )}

      <div className="my-1 border-t border-cyan-950" />

      {/* PWA Install */}
      {isInstallable && (
        <button
          onClick={() => {
            onClose();
            install();
          }}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-green-300 hover:bg-green-500/20 active:scale-98 transition-all"
        >
          <span>📲</span>
          <span>Install Offline App</span>
        </button>
      )}

      {isIOS && !isInstalled && (
        <button
          onClick={() => {
            onClose();
            onShowMessage('To install on iOS: Tap Share ⎙ in Safari, then select "Add to Home Screen" ➕.');
          }}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-green-300 hover:bg-green-500/20 active:scale-98 transition-all"
        >
          <span>🍏</span>
          <span>Install on iOS</span>
        </button>
      )}

      {/* Audio Mute/Unmute */}
      <button
        onClick={() => {
          onToggleAudio();
        }}
        className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-cyan-200 hover:bg-cyan-500/20 active:scale-98 transition-all"
      >
        <span>{audioMuted ? '🔇' : '🔊'}</span>
        <span>{audioMuted ? 'Unmute Sound' : 'Mute Sound'}</span>
      </button>

      {/* Game Controls Guide */}
      <button
        onClick={() => {
          onClose();
          onShowMessage('Controls:\n• [A / D] or [Arrows] / On-Screen D-Pad: Move\n• [Space] or [JUMP Slice]: Jump\n• [E] or [INTERACT Slice]: Interact / Mine / Talk / Enter\n• [ESC] or [EXIT Slice]: Exit Cave / Leave Shop\n• [F] or [WARP Button]: Fast Travel across planets');
        }}
        className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-cyan-300 hover:bg-cyan-500/20 active:scale-98 transition-all"
      >
        <span>📖</span>
        <span>Controls Guide</span>
      </button>

      <div className="my-1 border-t border-cyan-950" />

      {/* Reset Progress */}
      <button
        onClick={() => {
          onClose();
          onResetProgress();
        }}
        className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 text-left text-red-400 hover:bg-red-500/20 active:scale-98 transition-all"
      >
        <span>⚠️</span>
        <span>Reset Progress</span>
      </button>
    </div>
  );
};
