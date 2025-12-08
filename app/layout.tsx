import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Allora Cafe | Authentic African Cuisine & Festive Delivery in Marshalltown Joburg",
  description:
    "Experience the taste of home this Christmas with Allora Cafe. Authentic African cuisine and holiday favorites delivered straight to your door in Marshalltown Joburg, South Africa.",
  keywords: [
    "African cuisine",
    "Marshalltown restaurant",
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
    <html
      lang="en"
      className={`${playfair.variable} light`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
