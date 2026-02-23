import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-black/50 backdrop-blur-xl border-b border-white/5 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO AND BRAND NEXT TO EACH OTHER */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform group-hover:scale-110" />
          <span className="text-xl font-black tracking-tighter text-white">
            Viralook <span className="text-blue-500">AI Studio</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xs font-bold text-zinc-400 hover:text-white transition uppercase tracking-widest">Dashboard</Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <button className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden" />
        </div>
      </div>
    </nav>
  );
}
