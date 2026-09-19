"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddListingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Set numeric defaults to empty strings so the inputs are blank
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: 1, 
    bedrooms: "" as number | "",
    bathrooms: "" as number | "",
    floorAreaSqm: "" as number | "",
    streetAddress: "",
    barangay: "",
    city: "",
    province: "",
    monthlyRentPhp: "" as number | "",
    securityDepositPhp: "" as number | "",
    minimumLeaseMonths: "" as number | "",
    latitude: "" as number | "",
    longitude: "" as number | "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle empty strings gracefully for numbers, parse PropertyType dropdown as number
    const parsedValue = type === "number" 
      ? (value === "" ? "" : Number(value)) 
      : (name === "propertyType" ? Number(value) : value);
    
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("renta_token");
    if (!token) {
      setError("You must be logged in to create a listing.");
      setIsLoading(false);
      return;
    }

    // 2. Convert any blanks left by the user back to 0 for C# validation
    const payload = {
      ...formData,
      bedrooms: formData.bedrooms || 0,
      bathrooms: formData.bathrooms || 0,
      floorAreaSqm: formData.floorAreaSqm || 0,
      monthlyRentPhp: formData.monthlyRentPhp || 0,
      securityDepositPhp: formData.securityDepositPhp || 0,
      minimumLeaseMonths: formData.minimumLeaseMonths || 0,
      latitude: formData.latitude || 0,
      longitude: formData.longitude || 0,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create listing");
      }

      const newListing = await res.json();
      router.push(`/properties/${newListing.id}/upload`);
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-border/40 shadow-lg rounded-3xl bg-background">
          <CardHeader className="border-b pb-6 mb-6">
            <CardTitle className="text-3xl font-bold tracking-tight">Add New Property</CardTitle>
            <CardDescription className="text-base">List your property on the market.</CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 border border-red-100">
                {error}
              </div>
            )}

<form onSubmit={handleSubmit} className="space-y-8">
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Basic Details</h3>
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label>Listing Title</Label>
        <Input 
          name="title" 
          placeholder="e.g. Modern Minimalist 2-Story Home" 
          value={formData.title} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          name="description" 
          className="flex min-h-[100px] w-full rounded-xl border border-muted-foreground/30 bg-background hover:border-primary/50 transition-colors px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
          placeholder="Describe the layout, features, and vibe..." 
          value={formData.description} 
          onChange={handleChange} 
          required 
        />
      </div>
    </div>
  </div>

  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Metrics & Layout</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      <div className="space-y-2">
        <Label>Property Type</Label>
        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-muted-foreground/30 bg-background hover:border-primary/50 transition-colors px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          <option value={1}>Apartment</option>
          <option value={2}>Single Family House</option>
          <option value={3}>Townhouse</option>
          <option value={4}>Studio</option>
          <option value={5}>Boarding Room</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Number of Bedrooms</Label>
        <Input 
          name="bedrooms" 
          type="number" 
          value={formData.bedrooms} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Number of Bathrooms</Label>
        <Input 
          name="bathrooms" 
          type="number" 
          value={formData.bathrooms} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Floor Area (sqm)</Label>
        <Input 
          name="floorAreaSqm" 
          type="number" 
          placeholder="150" 
          value={formData.floorAreaSqm} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
    </div>
  </div>

  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Financials</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Monthly Rent (₱)</Label>
        <Input 
          name="monthlyRentPhp" 
          type="number" 
          value={formData.monthlyRentPhp} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Security Deposit (₱)</Label>
        <Input 
          name="securityDepositPhp" 
          type="number" 
          value={formData.securityDepositPhp} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Min. Lease (Months)</Label>
        <Input 
          name="minimumLeaseMonths" 
          type="number" 
          value={formData.minimumLeaseMonths} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
    </div>
  </div>

  <div className="space-y-4">
    <h3 className="font-semibold text-lg">Location</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label>Street Address</Label>
        <Input 
          name="streetAddress" 
          value={formData.streetAddress} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Barangay</Label>
        <Input 
          name="barangay" 
          value={formData.barangay} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>City</Label>
        <Input 
          name="city" 
          value={formData.city} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label>Province</Label>
        <Input 
          name="province" 
          value={formData.province} 
          onChange={handleChange} 
          required 
          className="bg-background border-muted-foreground/30 hover:border-primary/50 transition-colors"
        />
      </div>
    </div>
  </div>

  <Button type="submit" className="w-full rounded-xl py-6 text-base font-semibold shadow-sm transition-transform active:scale-95" disabled={isLoading}>
    {isLoading ? "Saving Listing..." : "Publish Property"}
  </Button>
</form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}