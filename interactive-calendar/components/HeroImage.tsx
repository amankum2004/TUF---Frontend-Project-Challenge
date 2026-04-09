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
  0: { url: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1600&q=80', theme: 'Winter Snow' },
  1: { url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80', theme: 'Cozy Winter' },
  2: { url: 'https://images.unsplash.com/photo-1456615074700-1dc12aa7364d?auto=format&fit=crop&w=1600&q=80', theme: 'Spring Blossoms' },
  3: { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80', theme: 'Spring Garden' },
  4: { url: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1600&q=80', theme: 'May Flowers' },
  5: { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', theme: 'Summer Sun' },
  6: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', theme: 'Beach Days' },
  7: { url: 'https://images.unsplash.com/photo-1500534314209-a26db0f5d9b4?auto=format&fit=crop&w=1600&q=80', theme: 'Summer Harvest' },
  8: { url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1600&q=80', theme: 'Autumn Colors' },
  9: { url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1600&q=80', theme: 'October Glow' },
  10: { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80', theme: 'November Fog' },
  11: { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80', theme: 'Holiday Magic' },
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
          unoptimized
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
