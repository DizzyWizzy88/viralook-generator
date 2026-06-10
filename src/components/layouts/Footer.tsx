import { Link } from 'react-router-dom';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t bg-white py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo and Name Grouped */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
             {/* Replace this div with an <Image /> tag if you have a logo file */}
             <span className="text-[10px] text-white font-bold">V</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Viralook
          </span>
        </div>

        {/* Thinner Links */}
        <div className="flex gap-8 text-sm font-semibold text-slate-500">
          <Link to="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
          <Link to="/terms" className="hover:text-blue-600 transition">Terms</Link>
          <Link to="mailto:support@viralook.com" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Small Copyright */}
        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          © 2026 Viralook
        </div>
      </div>
    </footer>
  );
}
