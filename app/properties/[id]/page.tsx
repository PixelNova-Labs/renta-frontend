import { Button } from "@/components/ui/button";
import { Bed, Bath, MapPin, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import LayoutViewer from "@/components/LayoutViewer";
// 1. Import the new component
import PropertyGallery from "@/components/PropertyGallery"; 

interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface Property {
  id: string;
  title: string;
  description: string;
  barangay: string;
  city: string;
  propertyType: number;
  bedrooms: number;
  bathrooms: number;
  floorAreaSqm: number;
  monthlyRentPhp: number;
  securityDepositPhp: number;
  minimumLeaseMonths: number;
  status: number;
  images: PropertyImage[]; 
}

async function getProperty(id: string): Promise<Property | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20">
        <h1 className="text-2xl font-bold mb-4">Property not found</h1>
        <Button asChild><Link href="/">Back to Listings</Link></Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Button asChild variant="ghost" className="mb-6 -ml-4 rounded-full">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings</Link>
        </Button>

        {/* 2. Inject the Interactive Gallery */}
        <PropertyGallery 
          images={property.images} 
          title={property.title} 
          status={property.status} 
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">{property.title}</h1>
            <p className="text-muted-foreground flex items-center text-lg mb-8">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              {property.barangay}, {property.city}
            </p>

            <div className="flex flex-wrap gap-8 py-6 border-y mb-8">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">Bedrooms</span>
                <span className="font-semibold text-lg flex items-center mt-1"><Bed className="w-5 h-5 mr-2 text-primary"/>{property.bedrooms}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">Bathrooms</span>
                <span className="font-semibold text-lg flex items-center mt-1"><Bath className="w-5 h-5 mr-2 text-primary"/>{property.bathrooms}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm font-medium">Floor Area</span>
                <span className="font-semibold text-lg flex items-center mt-1 text-foreground/80">{property.floorAreaSqm} sqm</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 tracking-tight">About this property</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
               {property.description}
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2 tracking-tight">
              <Layers className="w-6 h-6 text-primary" /> Layout & Floor Plan
            </h2>
            <LayoutViewer floorAreaSqm={property.floorAreaSqm} />
          </div>

          {/* Floating Action Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-24 p-6 rounded-3xl border shadow-sm bg-card">
              <p className="text-3xl font-bold text-primary mb-1">₱{property.monthlyRentPhp?.toLocaleString()}</p>
              <p className="text-muted-foreground mb-6 uppercase tracking-wider text-[11px] font-bold">/ month</p>
              
              <div className="space-y-3 mb-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span className="font-semibold">₱{property.securityDepositPhp?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Lease</span>
                  <span className="font-semibold">{property.minimumLeaseMonths} months</span>
                </div>
              </div>

              <Button className="w-full rounded-full font-semibold shadow-sm transition-transform active:scale-95" size="lg">
                Contact Landlord
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}