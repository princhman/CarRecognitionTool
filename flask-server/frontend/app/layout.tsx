import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/components/theme-provider";

import { AuthProvider } from "../components/components/auth-context";
import Header from "@/components/components/header/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Recognition AI",
  description: "AI-powered car recognition tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <footer className="border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm">
                  © 2024 Car Recognition Tool. All rights reserved.
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}