const handleDownload = async (imageUrl: string, id: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viralook-studio-${id}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed", error);
  }
};

// Inside your gallery map, add this overlay button:
<div className="group relative rounded-3xl overflow-hidden">
  <img src={img.url} className="w-full aspect-square object-cover" />
  
  {/* Hover Actions */}
  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    <button 
      onClick={() => handleDownload(img.url, img.id)}
      className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition"
    >
      Download
    </button>
  </div>
</div>
