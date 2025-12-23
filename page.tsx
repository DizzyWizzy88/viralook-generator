<header className="py-20 flex flex-col items-center bg-[#020617] border-b border-white/5 relative overflow-hidden">
  {/* Abstract Background Glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

  {/* Theme Toggle */}
  <div className="absolute top-8 right-8 z-50">
    <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
  </div>

  {/* LOGO (Using Option 1 logic above) */}
  <div className="relative z-10 mb-8">
    {/* PASTE OPTION 1 LOGO CODE HERE */}
  </div>

  <div className="text-center z-10 px-4">
    <h1 className="text-white text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
      Viralook <span className="text-blue-500">Studio</span>
    </h1>
    
    <div className="mt-8 inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
      <div className="flex h-2.5 w-2.5 relative">
        <div className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></div>
        <div className="relative h-2.5 w-2.5 rounded-full bg-blue-500"></div>
      </div>
      <p className="text-zinc-300 text-[11px] font-black uppercase tracking-[0.25em]">
        {credits} Credits Available
      </p>
    </div>
  </div>
</header>
