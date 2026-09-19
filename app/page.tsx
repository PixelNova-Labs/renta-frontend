import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Heart } from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  barangay: string;
  city: string;
  propertyType: number;
  bedrooms: number;
  bathrooms: number;
  monthlyRentPhp: number;
  status: number;
  primaryImageUrl: string | null;
  primaryThumbnailUrl: string | null;
}

async function getProperties(): Promise<Property[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/listings`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-muted/20 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">Available Properties</h1>
        
        {properties.length === 0 ? (
          <p className="text-muted-foreground">No properties found...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className="w-full overflow-hidden group border-border/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl flex flex-col bg-background"
              >
                {/* Hero Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={property.primaryImageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"} 
                    alt={property.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Actions & Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className="bg-white/95 text-black hover:bg-white backdrop-blur-md rounded-full px-3 py-1 shadow-sm font-medium">
                      {property.status === 1 ? "Available" : "Rented"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title & Location */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1.5">
                      <MapPin className="w-4 h-4 mr-1 text-primary/70 shrink-0" />
                      <span className="truncate">{property.barangay}, {property.city}</span>
                    </p>
                  </div>
                  
                  {/* Amenities (Beds/Baths) */}
                  <div className="flex items-center gap-5 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                      <Bed className="w-4 h-4 text-primary/80"/> 
                      <span className="font-medium">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                      <Bath className="w-4 h-4 text-primary/80"/> 
                      <span className="font-medium">{property.bathrooms} Baths</span>
                    </div>
                  </div>
                  
                  {/* Footer: Price & Action */}
                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xl leading-none text-foreground">
                        ₱{property.monthlyRentPhp?.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">
                        / month
                      </p>
                    </div>
                    
                    <Button asChild className="rounded-full px-6 font-semibold shadow-sm transition-transform active:scale-95">
                      <Link href={`/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}