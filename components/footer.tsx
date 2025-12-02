import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Christmas Menu", href: "#christmas-menu" },
  { label: "African Classics", href: "#african-classics" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#about" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Delivery Policy", href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-deep-brown text-cream">
      {/* Newsletter Section */}
      <div className="border-b border-cream/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2">Stay in the Loop</h3>
              <p className="text-cream/70">Subscribe for exclusive offers and festive updates.</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50 focus:border-gold"
              />
              <Button className="bg-terracotta hover:bg-ochre text-cream font-semibold px-6 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-3xl font-bold text-gold">Allora Cafe</span>
            </Link>
            <p className="text-cream/70 mb-6 leading-relaxed">
              Authentic African cuisine and festive favorites, delivered with love from Marshalltown Joburg.
            </p>
            <div className="flex items-center gap-2 text-cream/70">
              <MapPin className="h-4 w-4 text-terracotta" />
              <span className="text-sm">Based in Marshalltown Joburg, SA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-cream/70 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-cream/70 hover:text-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Hours */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 bg-cream/10 rounded-full hover:bg-terracotta transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-cream/70 group-hover:text-cream transition-colors" />
                </Link>
              ))}
            </div>
            <div className="text-cream/70 text-sm space-y-1">
              <p className="font-medium text-cream">Festive Hours:</p>
              <p>Mon - Sun: 9:00 AM - 10:00 PM</p>
              <p className="text-gold">🎄 Open on Christmas Day!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/50 text-sm text-center md:text-left">© 2025 Allora Cafe. All rights reserved.</p>
            <p className="text-cream/50 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-terracotta fill-terracotta" /> in Marshalltown Joburg
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
