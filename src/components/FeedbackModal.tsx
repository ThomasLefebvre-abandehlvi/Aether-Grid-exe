import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateCheat: () => void;
  onShowMessage: (msg: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onActivateCheat,
  onShowMessage,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [cheatTriggered, setCheatTriggered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = feedbackText.trim();

    if (!cleanText) {
      onShowMessage('Please type your feedback before sending.');
      return;
    }

    // Secret cheat code check: "termsnconaban" exactly!
    if (cleanText === 'termsnconaban') {
      setCheatTriggered(true);
      onActivateCheat();
      setTimeout(() => {
        setCheatTriggered(false);
        setFeedbackText('');
        onClose();
        onShowMessage('⚡ QUANTUM OVERRIDE GRANTED! Infinite Money & Dev Mode Activated! 💰');
      }, 1200);
      return;
    }

    // Standard feedback flow: Draft email to abandehlvi542@gmail.com
    const recipient = 'abandehlvi542@gmail.com';
    const subject = encodeURIComponent('Aether Grid: Neon Depths - Player Feedback');
    const body = encodeURIComponent(cleanText);
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      // In case iframe restricts mailto navigation
    }

    onShowMessage(`Thank you for your feedback! An email draft to ${recipient} has been prepared.`);
    setFeedbackText('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none"
    >
      <div className="w-full max-w-md rounded-xl border-2 border-cyan-400 bg-[#0d1020] p-6 text-white shadow-[0_0_25px_rgba(0,255,255,0.4)]">
        <div className="flex items-center justify-between border-b border-cyan-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h2 className="text-lg font-bold font-mono text-cyan-400">Player Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-mono text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-300 font-mono mb-3 leading-relaxed">
          Have an idea or bug report? Your message will be sent directly to the creator at{' '}
          <span className="text-cyan-300 font-bold">abandehlvi542@gmail.com</span>.
        </p>

        {cheatTriggered ? (
          <div className="p-4 rounded-lg bg-green-950 border border-green-400 text-center font-mono animate-bounce my-4">
            <p className="text-yellow-300 font-bold text-sm">⚡ CHEAT DETECTED: termsnconaban</p>
            <p className="text-green-300 text-xs mt-1">ACCESSING INFINITE CREDITS VAULT...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback, bug reports, or secrets here..."
              rows={4}
              className="w-full rounded border border-cyan-500/50 bg-[#151d35] p-3 font-mono text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all resize-none"
              autoFocus
            />

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded bg-cyan-400 py-2.5 font-mono text-xs font-bold text-[#050b16] shadow-md hover:bg-cyan-300 active:scale-95 transition-all"
              >
                SEND FEEDBACK
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-red-500/70 px-4 py-2.5 font-mono text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
