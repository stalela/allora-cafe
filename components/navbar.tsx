"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#christmas-menu", label: "Christmas Menu" },
  { href: "#african-classics", label: "African Classics" },
  { href: "#about", label: "About" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount] = useState(3) // Demo cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-cream/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-serif text-2xl md:text-3xl font-bold tracking-tight transition-colors",
              isScrolled ? "text-terracotta" : "text-cream",
            )}
          >
            Allora Cafe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-terracotta relative group",
                isScrolled ? "text-deep-brown" : "text-cream",
              )}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative transition-colors",
              isScrolled
                ? "text-deep-brown hover:text-terracotta hover:bg-sand"
                : "text-cream hover:text-gold hover:bg-cream/10",
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-terracotta text-cream text-xs border-0">
                {cartCount}
              </Badge>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>

          {/* Order Delivery CTA */}
          <Button className="hidden sm:flex bg-terracotta hover:bg-ochre text-cream font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
            Order Delivery
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  isScrolled ? "text-deep-brown hover:bg-sand" : "text-cream hover:bg-cream/10",
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream border-sand w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-2xl font-bold text-terracotta">Allora Cafe</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-deep-brown hover:bg-sand">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-lg font-medium text-deep-brown hover:text-terracotta transition-colors py-2 border-b border-sand/50"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto pt-8">
                  <Button className="w-full bg-terracotta hover:bg-ochre text-cream font-semibold py-6 text-lg">
                    Order Delivery
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
