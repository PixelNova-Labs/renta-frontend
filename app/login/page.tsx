"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const router = useRouter(); // 2. Initialize the router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // 3. Add error state

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear old errors

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Note: Check your C# backend. It might expect "Email" and "Password" (capitalized)
        body: JSON.stringify({ email, password }), 
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();
      
      // 4. Save the JWT token securely in the browser
      // Your C# backend likely returns an object like { token: "eyJhb..." }
      localStorage.setItem("renta_token", data.token); 
      
      // 5. Redirect to the homepage
      router.push("/");
      router.refresh(); // Forces Next.js to update the UI
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <Home className="w-4 h-4 mr-2" /> Back to Properties
        </Link>
        
        <Card className="border-border/40 shadow-lg rounded-3xl bg-background">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 border border-red-100">
                {error}
            </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  tabIndex={1}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="rounded-xl px-4 py-6"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground/80">Password</Label>
                  <Link href="#" tabIndex={4} className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  tabIndex={2}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="rounded-xl px-4 py-6"
                />
              </div>
              
              <Button type="submit" tabIndex={3} className="w-full rounded-xl py-6 text-base font-semibold mt-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-6 mt-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}