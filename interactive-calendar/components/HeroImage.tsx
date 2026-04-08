// components/HeroImage.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

interface HeroImageProps {
  currentMonth: Date;
}

// Seasonal image mapping based on month
const seasonalImages: Record<number, { url: string; theme: string }> = {
  0: { url: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=400&fit=crop', theme: 'Winter Snow' },
  1: { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop', theme: 'Cozy Winter' },
  2: { url: 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?w=800&h=400&fit=crop', theme: 'Spring Blossoms' },
  3: { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=400&fit=crop', theme: 'Spring Garden' },
  4: { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=400&fit=crop', theme: 'May Flowers' },
  5: { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=400&fit=crop', theme: 'Summer Sun' },
  6: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop', theme: 'Beach Days' },
  7: { url: 'https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=800&h=400&fit=crop', theme: 'Summer Harvest' },
  8: { url: 'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?w=800&h=400&fit=crop', theme: 'Autumn Colors' },
  9: { url: 'https://images.unsplash.com/photo-1542838132-92c533f91ee2?w=800&h=400&fit=crop', theme: 'October Glory' },
  10: { url: 'https://images.unsplash.com/photo-1545167622-3a6d7568b5a5?w=800&h=400&fit=crop', theme: 'November Fog' },
  11: { url: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=400&fit=crop', theme: 'Holiday Magic' },
};

export default function HeroImage({ currentMonth }: HeroImageProps) {
  const monthIndex = currentMonth.getMonth();
  const { url, theme } = seasonalImages[monthIndex];
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-stone-100">
      <div className="relative aspect-[2/1] md:aspect-[3/1]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-200 animate-pulse">
            <span className="text-stone-400">Loading image...</span>
          </div>
        )}
        <Image
          src={url}
          alt={`${format(currentMonth, 'MMMM')} - ${theme}`}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={() => setImageLoaded(true)}
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Month overlay text */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm md:text-base font-medium drop-shadow-md">
            {theme} • {format(currentMonth, 'MMMM')}
          </p>
        </div>
      </div>
    </div>
  );
}
