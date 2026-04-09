// components/HeroImage.tsx
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

interface HeroImageProps {
  currentMonth: Date;
}

// Seasonal image mapping based on month
const seasonalImages: Record<number, { url: string; theme: string }> = {
  0: { url: '/images/hero/jan-winter-snow.jpg', theme: 'Winter Snow' },
  1: { url: '/images/hero/feb-cozy-winter.jpg', theme: 'Cozy Winter' },
  2: { url: '/images/hero/mar-spring-blossoms.jpg', theme: 'Spring Blossoms' },
  3: { url: '/images/hero/apr-spring-garden.jpg', theme: 'Spring Garden' },
  4: { url: '/images/hero/may-flowers.jpg', theme: 'May Flowers' },
  5: { url: '/images/hero/jun-summer-sun.jpg', theme: 'Summer Sun' },
  6: { url: '/images/hero/jul-beach-days.jpg', theme: 'Beach Days' },
  7: { url: '/images/hero/aug-summer-harvest.jpg', theme: 'Summer Harvest' },
  8: { url: '/images/hero/sep-autumn-colors.jpg', theme: 'Autumn Colors' },
  9: { url: '/images/hero/oct-october-glow.jpg', theme: 'October Glow' },
  10: { url: '/images/hero/nov-fog.jpg', theme: 'November Fog' },
  11: { url: '/images/hero/dec-holiday-magic.jpg', theme: 'Holiday Magic' },
};

export default function HeroImage({ currentMonth }: HeroImageProps) {
  const monthIndex = currentMonth.getMonth();
  const { url, theme } = seasonalImages[monthIndex];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setIsFlipping(true);
    const timeout = setTimeout(() => setIsFlipping(false), 600);
    return () => clearTimeout(timeout);
  }, [monthIndex]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200/70 ${isFlipping ? 'animate-page-flip' : ''}`}>
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
          <p className="text-white text-sm md:text-base font-semibold tracking-wide drop-shadow-md">
            {theme} • {format(currentMonth, 'MMMM')}
          </p>
        </div>
      </div>
    </div>
  );
}
