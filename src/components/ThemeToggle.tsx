"use client";

import React from 'react';

export default function ThemeToggle({ isDark, toggle }: { isDark: boolean, toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="p-3 rounded-2xl transition-all duration-300 bg-white/10 border border-white/20 hover:bg-white/20"
      title="Toggle Appearance"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
