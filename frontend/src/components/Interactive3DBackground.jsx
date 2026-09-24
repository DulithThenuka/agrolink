import React from 'react';

/**
 * Calm, subtle background texture for public/landing views.
 * Free of glowing orbs or disorienting animations.
 */
export const Interactive3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-slate-50/60">
      {/* Subtle geometric dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025]" 
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default Interactive3DBackground;
