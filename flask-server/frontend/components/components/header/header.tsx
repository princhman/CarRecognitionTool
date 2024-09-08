"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/components/auth-context";
import { UserDropDownMenu } from "@/components/components/header/userDropDownMenu";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b">
      <div className="container max-w-full px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between py-4">
        <nav className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-grow flex-shrink-0 basis-full sm:basis-auto mb-4 sm:mb-0">
          <Button asChild variant="ghost" className="px-2 sm:px-4">
            <Link href="/">
              <span className="font-bold text-base sm:text-lg lg:text-xl whitespace-nowrap">Car Recognition Tool</span>
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4 flex-grow flex-shrink-0 basis-full sm:basis-auto justify-end">
          {user ? (
            <>
               <Button asChild variant="ghost" className="px-2 sm:px-4 text-sm lg:text-base">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserDropDownMenu />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="px-2 sm:px-4 text-sm lg:text-base">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild variant="outline" className="px-2 sm:px-4 text-sm lg:text-base">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}