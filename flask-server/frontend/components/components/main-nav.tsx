import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Button asChild variant="ghost">
        <Link href="/">
          <span className="font-bold text-xl">Car Recognition Tool</span>
        </Link>
      </Button>
    </nav>
  );
}