"use client";

import { MainNav } from "../components/components/main-nav";
import { Button } from "@/components/ui/button";
import { useAuth } from "../components/components/auth-context";
import Link from "next/link";

export default function Header() {
    const { user } = useAuth();
  
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline">Welcome, {user.name}</span>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }