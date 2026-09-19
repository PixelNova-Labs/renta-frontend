"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Prevents hydration errors
  const router = useRouter();
  const pathname = usePathname();

  // Check for the token whenever the route changes or page loads
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("renta_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("renta_token");
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  // Don't render the UI until the client has checked localStorage
  if (!isMounted) return null;

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Home className="w-5 h-5" />
          </div>
          Renta
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/profile"><User className="w-4 h-4 mr-2" /> Dashboard</Link>
              </Button>
              <Button variant="outline" className="rounded-full shadow-sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button className="rounded-full shadow-sm font-semibold" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}