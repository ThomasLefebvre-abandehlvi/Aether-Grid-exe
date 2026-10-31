import React from 'react';
import { DialogueData } from '../types/game';

interface DialogueModalProps {
  dialogue: DialogueData | null;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ dialogue, onClose }) => {
  if (!dialogue) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[540px] rounded-lg border-2 border-cyan-400 bg-[#101026]/95 p-4 sm:p-5 font-mono shadow-[0_0_20px_rgba(0,255,255,0.4)] backdrop-blur-md select-none">
      <div className="flex items-center justify-between border-b border-cyan-900/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: dialogue.avatarColor || '#00ffcc' }}
          />
          <h3 className="font-bold text-sm text-[#00ffcc] tracking-wide">
            {dialogue.speaker}
          </h3>
          {dialogue.speakerRole && (
            <span className="text-[10px] text-gray-400">({dialogue.speakerRole})</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded border border-gray-700 hover:border-gray-500"
        >
          ESC
        </button>
      </div>

      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-4 whitespace-pre-line">
        {dialogue.text}
      </p>

      <div className="space-y-2">
        {dialogue.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={opt.action}
            className="w-full text-left rounded border border-cyan-500/60 bg-[#1a1a3a]/80 px-3 py-2 text-xs text-white hover:bg-cyan-400 hover:text-[#030308] active:scale-98 transition-all"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
};
