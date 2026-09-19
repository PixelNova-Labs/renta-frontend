"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
  status: number;
}

export default function PropertyGallery({ images, title, status }: PropertyGalleryProps) {
  // 1. Find the starting index (primary image, or 0 if none is marked)
  const initialIndex = images?.findIndex((img) => img.isPrimary);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  // Fallback if the listing has zero images
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video md:aspect-[21/9] bg-muted rounded-3xl overflow-hidden relative mb-4 shadow-sm border">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" 
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const activeImage = images[currentIndex];

  // 2. Navigation handlers with wrapping logic
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mb-8">
      {/* Main Hero Image */}
      <div className="w-full aspect-video md:aspect-[21/9] bg-muted rounded-3xl overflow-hidden relative mb-4 shadow-sm border group">
        <img 
          src={activeImage.url} 
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
        />
        
        <Badge className="absolute top-4 left-4 bg-white/95 text-black backdrop-blur-md rounded-full px-4 py-1.5 text-sm shadow-sm font-semibold z-10">
          {status === 1 ? "Available" : "Rented"}
        </Badge>

        {/* 3. Navigation Arrows (Only appear on hover, and only if multiple images exist) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x px-1">
          {images.map((img, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button 
                key={img.id} 
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-32 h-24 md:w-48 md:h-32 shrink-0 rounded-xl overflow-hidden snap-start transition-all duration-200 ${
                  isActive ? "ring-2 ring-primary ring-offset-2 opacity-100" : "border opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={img.thumbnailUrl || img.url} 
                  alt="Gallery thumbnail" 
                  className="w-full h-full object-cover" 
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}