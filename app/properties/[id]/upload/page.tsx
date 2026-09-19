"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, UploadCloud } from "lucide-react";

// In Next.js 15+, params is a Promise
export default function ImageUploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    
    // Generate immediate local previews for a premium UX
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
if (files.length === 0) return;
  setIsUploading(true);
  setError("");

  const token = localStorage.getItem("renta_token");
  if (!token) {
    setError("You must be logged in.");
    setIsUploading(false);
    return;
  }

  try {
    // Loop through and upload each file individually
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      
      // 1. Append the file
      formData.append("file", files[i]);
      
      // 2. Append the missing isPrimary flag (true for the first image, false for the rest)
      formData.append("isPrimary", i === 0 ? "true" : "false");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}/images`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // No Content-Type header here, let the browser handle it
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed for image ${i + 1}: ${errorText}`);
      }
    }

    // Success! Redirect to the listing details page
    router.push(`/properties/${id}`);
    router.refresh();
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsUploading(false);
  }
};

  return (
    <main className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/40 shadow-lg rounded-3xl bg-background">
          <CardHeader className="border-b pb-6 mb-6 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Upload Property Photos</CardTitle>
            <CardDescription className="text-base">Add high-quality images to attract more renters.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Custom File Upload Area */}
            <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <ImagePlus className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-lg mb-1">Click or drag images here</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, and WebP</p>
              </div>
            </div>

            {/* Image Previews Grid */}
            {previews.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Selected Images ({previews.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border group">
                      <img src={src} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                      <button 
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t flex justify-end gap-3">
              <Button variant="ghost" onClick={() => router.push(`/properties/${id}`)} className="rounded-xl">
                Skip for now
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="rounded-xl px-8 font-semibold shadow-sm">
                {isUploading ? (
                  <><UploadCloud className="w-4 h-4 mr-2 animate-bounce" /> Uploading...</>
                ) : (
                  "Upload Images"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}