"use client";

import { Download, Trash2, ExternalLink } from 'lucide-react';

export default function ImageGallery({ images, setImages }: any) {
  
  const handleRemove = (id: string) => {
    setImages(images.filter((item: any) => item.id !== id));
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
        <p className="text-zinc-600 uppercase text-[10px] tracking-[0.3em] font-bold">Vault Empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((item: any) => (
        <div key={item.id} className="group relative bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5">
          <img 
            src={item.url} 
            alt="Viralook Artwork" 
            className="w-full aspect-square object-cover" 
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button onClick={() => handleRemove(item.id)} className="p-3 bg-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.open(item.url, '_blank')} className="flex-1 bg-white/10 p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <ExternalLink size={14} /> View
              </button>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-center">
                <Download size={14} /> Save
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
