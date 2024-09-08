"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/components/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      // Show error message to user
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In
    console.log("Google Sign-In not implemented yet");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
              />
            </div>
            <Button className="w-full" type="submit">Log In</Button>
          </form>
          <div className="mt-4">
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
              Sign in with Google
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/signup" className="text-blue-500 hover:underline">
              Dont have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
