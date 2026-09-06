import React from 'react';

export const Interactive3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Soft Luminous Organic Ambient Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-emerald-400/12 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-amber-300/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-emerald-500/8 rounded-full blur-3xl" />

      {/* Subtle organic dotted grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default Interactive3DBackground;
