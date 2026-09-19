"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Ruler } from "lucide-react";

interface LayoutViewerProps {
  floorAreaSqm: number;
}

export default function LayoutViewer({ floorAreaSqm }: LayoutViewerProps) {
  const [activeFloor, setActiveFloor] = useState<"ground" | "second">("ground");

  return (
    <div className="border border-border/50 rounded-3xl overflow-hidden bg-background shadow-sm">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex gap-2">
          <Button 
            variant={activeFloor === "ground" ? "default" : "outline"} 
            onClick={() => setActiveFloor("ground")}
            className="rounded-full rounded-r-none px-6 font-semibold shadow-none"
          >
            Ground Floor
          </Button>
          <Button 
            variant={activeFloor === "second" ? "default" : "outline"} 
            onClick={() => setActiveFloor("second")}
            className="rounded-full rounded-l-none px-6 font-semibold shadow-none border-l-0"
          >
            Second Floor
          </Button>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground font-medium pr-2">
          <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4" /> Est. Lot: 150 sqm</span>
          <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4" /> Floor: {floorAreaSqm} sqm</span>
        </div>
      </div>

      {/* Interactive Display Area */}
      <div className="relative aspect-video w-full bg-muted/10 p-6 flex items-center justify-center">
        {activeFloor === "ground" ? (
          <div className="w-full h-full relative group rounded-2xl overflow-hidden border border-border/50 bg-white">
            {/* Using a clean architectural blueprint placeholder */}
            <img 
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80" 
              alt="Ground Floor Blueprint"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
              <p className="font-bold text-xl text-foreground mb-2 tracking-tight">Ground Floor Layout</p>
              <p className="text-sm text-foreground/80 max-w-lg leading-relaxed">
                A modern, minimalist layout designed to maximize a 150-square-meter footprint. Features an open-concept living space that flows seamlessly into the dining area and outdoor patio.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative group rounded-2xl overflow-hidden border border-border/50 bg-white">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" 
              alt="Second Floor Blueprint"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
              <p className="font-bold text-xl text-foreground mb-2 tracking-tight">Second Floor Layout</p>
              <p className="text-sm text-foreground/80 max-w-lg leading-relaxed">
                Private quarters featuring a primary suite with structural efficiency. The smart use of space ensures uncluttered hallways and maximum natural light.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}