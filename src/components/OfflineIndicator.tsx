import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-lg border border-amber-500/80 bg-[#161208]/95 px-3 py-1.5 font-mono text-[11px] font-medium text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      <span>PWA Offline Mode — Local data active</span>
    </div>
  );
};
