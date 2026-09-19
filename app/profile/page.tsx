"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Loader2, Edit, Home, ExternalLink } from "lucide-react";
import Link from "next/link";

interface LessorProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  bio: string;
  profilePhotoUrl: string | null;
  joinDate: string;
}

// 1. Add the interface for the dashboard properties
interface Property {
  id: string;
  title: string;
  city: string;
  barangay: string;
  monthlyRentPhp: number;
  status: number;
  primaryImageUrl: string | null;
  lessorId: string;
}

export default function LessorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LessorProfile | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]); // New state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("renta_token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch Profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessors/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!profileRes.ok) throw new Error("Failed to load profile data.");
        
        const profileData = await profileRes.json();
        setProfile(profileData);

        // 2. Fetch Listings and filter by the Lessor's ID
        const listingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`);
        if (listingsRes.ok) {
          const allListings: Property[] = await listingsRes.json();
          const filteredListings = allListings.filter(
            (listing) => listing.lessorId === profileData.id
          );
          setMyProperties(filteredListings);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 max-w-md w-full">
          <p className="font-semibold mb-2">Error Loading Profile</p>
          <p className="text-sm">{error || "Could not retrieve your data."}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <Card className="border-border/40 shadow-sm rounded-3xl overflow-hidden bg-background">
              <div className="h-32 bg-primary/10 relative"></div>
              
              <div className="px-6 pb-6 pt-0 text-center relative -mt-16">
                <div className="inline-block p-1 bg-background rounded-full mb-4">
                  <div className="w-28 h-28 bg-muted rounded-full overflow-hidden border-2 border-border flex items-center justify-center">
                    {profile.profilePhotoUrl ? (
                      <img src={profile.profilePhotoUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                <p className="text-muted-foreground text-sm flex items-center justify-center mt-1">
                  <Mail className="w-3.5 h-3.5 mr-1" /> {profile.email}
                </p>

                <div className="mt-6 space-y-3 text-sm text-left">
                  {profile.phoneNumber && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-3 shrink-0" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-3 shrink-0" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t flex flex-col gap-3">
                  <Button variant="outline" className="w-full rounded-xl">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                  <Button asChild className="w-full rounded-xl font-semibold">
                    <Link href="/add-listing">Add New Listing</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Active Properties */}
          <div className="w-full md:w-2/3">
             <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">My Properties</h2>
                  <p className="text-muted-foreground text-sm">Manage your active listings and view applications.</p>
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
                  {myProperties.length} Total
                </Badge>
             </div>
             
             {myProperties.length === 0 ? (
               <Card className="border-border/40 shadow-sm rounded-3xl bg-background p-12 text-center flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No properties yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    You haven't listed any properties yet. Click the button below to get started.
                  </p>
                  <Button asChild className="rounded-full shadow-sm font-semibold">
                     <Link href="/add-listing">Add Your First Property</Link>
                  </Button>
               </Card>
             ) : (
               <div className="space-y-4">
                 {/* 3. Render Dashboard Cards */}
                 {myProperties.map((property) => (
                   <Card key={property.id} className="flex flex-col sm:flex-row overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow bg-background rounded-2xl">
                     <div className="sm:w-48 h-40 bg-muted relative shrink-0">
                       <img 
                         src={property.primaryImageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"} 
                         alt={property.title}
                         className="w-full h-full object-cover"
                       />
                       <Badge className="absolute top-2 left-2 bg-white/95 text-black backdrop-blur-md rounded-full shadow-sm font-semibold">
                         {property.status === 1 ? "Active" : "Rented"}
                       </Badge>
                     </div>
                     <div className="p-5 flex flex-col flex-grow justify-between">
                       <div>
                         <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1">{property.title}</h3>
                         <p className="text-sm text-muted-foreground flex items-center mb-3">
                           <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                           <span className="truncate">{property.barangay}, {property.city}</span>
                         </p>
                       </div>
                       <div className="flex items-center justify-between border-t pt-3 mt-auto">
                         <p className="font-bold text-primary">₱{property.monthlyRentPhp.toLocaleString()} <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">/ mo</span></p>
                         <Button asChild variant="outline" size="sm" className="rounded-full shadow-none">
                           <Link href={`/properties/${property.id}`}><ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Live</Link>
                         </Button>
                       </div>
                     </div>
                   </Card>
                 ))}
               </div>
             )}
          </div>

        </div>
      </div>
    </main>
  );
}