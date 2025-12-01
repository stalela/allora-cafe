import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Allora Cafe | Authentic African Cuisine & Festive Delivery in Johannesburg",
  description:
    "Experience the taste of home this Christmas with Allora Cafe. Authentic African cuisine and holiday favorites delivered straight to your door in Johannesburg, South Africa.",
  keywords: [
    "African cuisine",
    "Johannesburg restaurant",
    "food delivery",
    "Christmas dinner",
    "festive meals",
    "South African food",
  ],
  openGraph: {
    title: "Allora Cafe | The Taste of Home this Christmas in Joburg",
    description: "Authentic African cuisine and holiday favorites delivered straight to your door.",
    type: "website",
    locale: "en_ZA",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#c45a3a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
