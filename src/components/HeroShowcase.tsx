"use client";

import React from 'react';

// Placeholder images - in a real app, these would come from your best generations!
const images = [
  'https://framerusercontent.com/images/kM0O9eMvR2uH9yX6x8m07d1z0.jpg',
  'https://framerusercontent.com/images/bLdD3g0mB7fX6n5e4r3q2o1p.jpg',
  'https://framerusercontent.com/images/aXyZ2w1vU3tS4r5q6p7o8n9m.jpg',
  'https://framerusercontent.com/images/cEdF1gH2iJ3kL4m5nO6pQ7rS.jpg',
  'https://framerusercontent.com/images/dYxW1zV2uT3sR4q5p6o7n8m9.jpg',
  'https://framerusercontent.com/images/eFgH1iJ2kL3mN4o5P6qR7sT8.jpg',
  'https://framerusercontent.com/images/fGhI1jK2lM3nO4p5Q6rS7tU8.jpg',
  'https://framerusercontent.com/images/gHiJ1kL2mN3oP4q5R6sT7uV8.jpg',
  'https://framerusercontent.com/images/hIjK1lM2nO3pQ4r5S6tU7vW8.jpg',
];

export default function HeroShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#020617] to-indigo-950 overflow-hidden relative">
      <div className="text-center mb-16 px-4">
        <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter leading-tight italic">
          Turn your <span className="text-blue-500">ideas</span> into <br />
          <span className="text-blue-400">viral</span> looks.
        </h2>
        <p className="mt-6 text-xl text-zinc-300 max-w-2xl mx-auto">
          Unleash the power of AI to create stunning visuals for your brand,
          social media, or personal projects in seconds.
        </p>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {images.concat(images).map((img, index) => ( // Duplicate to create seamless loop
            <img 
              key={index}
              src={img} 
              alt={`Viralook showcase ${index}`} 
              className="w-80 h-auto aspect-[3/4] object-cover rounded-3xl mx-4 shadow-xl border border-zinc-700"
            />
          ))}
        </div>
      </div>
      <div className="relative w-full overflow-hidden py-4 mt-8">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {images.concat(images).reverse().map((img, index) => ( // Duplicate & Reverse
            <img 
              key={index}
              src={img} 
              alt={`Viralook showcase reverse ${index}`} 
              className="w-80 h-auto aspect-[3/4] object-cover rounded-3xl mx-4 shadow-xl border border-zinc-700"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
