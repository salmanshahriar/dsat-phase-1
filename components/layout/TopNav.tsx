"use client";

import { useState, useEffect } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function TopNav() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      async function fetchUserData() {
        try {
          const sessionData = document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "";
          const res = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/getProfile", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionData}`,
            },
          });
          if (res.status === 401) {
            document.cookie.split(";").forEach((cookie) => {
              const [name] = cookie.split("=");
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
            
            router.push("/login");
            router.refresh();
            return;
          }

          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await res.json();
          setUser({
            name: data.full_name || "Unknown User",
            email: data.email || "No email",
            avatar: data.avatar || "/placeholder.svg?height=32&width=32", 
          });
        } catch (error) {
          console.error(error);
          setUser({
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "/placeholder.svg?height=32&width=32",
          }); // Fallback
        }
      }

      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Use fallback data if user data isn’t loaded yet
  const displayUser = user || {
    name: "Loading...",
    email: "Loading...",
    avatar: "/placeholder.svg?height=32&width=32",
  };

  return (
    <nav className="relative z-50 h-16 bg-background border-b border-border px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          DSAT SCHOOL
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {isAuthenticated && pathname !== "/login" && !isHomePage && (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 h-auto relative">
                <div className="flex items-center space-x-2 rounded-full py-1 px-3 bg-accent hover:bg-accent-foreground/10 transition-colors duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                    <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">{displayUser.name}</span>
                    <span className="text-xs text-muted-foreground">{displayUser.email}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}