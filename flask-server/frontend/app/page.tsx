import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to Car Recognition Tool</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Our AI-powered tool helps you identify cars from images with high accuracy. 
        Upload an image and get instant results!
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/recognise">Try It Now</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}