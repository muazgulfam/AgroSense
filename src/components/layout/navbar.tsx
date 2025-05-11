
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Bot, CloudSun, Users, Store, Phone } from "lucide-react";
import type { SVGProps } from "react";
import { LeafIcon } from "@/components/icons/LeafIcon"; // Assuming LeafIcon exists

const navLinks = [
  { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
  { href: "/#ai-diagnosis", label: "AI Diagnosis", icon: <Bot className="w-4 h-4" /> },
  { href: "/#weather-updates", label: "Weather", icon: <CloudSun className="w-4 h-4" /> },
  { href: "/#marketplace", label: "Marketplace", icon: <Store className="w-4 h-4" /> },
  { href: "/#community", label: "Community", icon: <Users className="w-4 h-4" /> },
  { href: "/#contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://picsum.photos/seed/agrosenselogo/80/80" 
            alt="AgroSense Logo"
            width={32}
            height={32}
            className="rounded-full"
            data-ai-hint="leaf logo"
          />
          <span className="font-bold text-primary text-xl">AgroSense</span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <Image
                            src="https://picsum.photos/seed/agrosenselogo/80/80" 
                            alt="AgroSense Logo"
                            width={28}
                            height={28}
                            className="rounded-full"
                            data-ai-hint="leaf logo"
                        />
                        <span className="font-bold text-primary text-lg">AgroSense</span>
                    </Link>
                </div>
              <nav className="flex flex-col space-y-1 px-4">
                {navLinks.map((link) => (
                  <SheetTrigger key={link.label} asChild>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
