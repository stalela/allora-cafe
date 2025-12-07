import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import MenuSection from "@/components/menu-section"
import PromoBanner from "@/components/promo-banner"
import AboutSection from "@/components/about-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
    
      <MenuSection />
      <PromoBanner />
      <Footer />
    </main>
  )
}
