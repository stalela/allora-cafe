import { Button } from "@/components/ui/button"
import { ChevronRight, Truck } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/elegant-festive-african-dinner-table-setting-with-.jpg"
          alt="Festive dinner setting at Allora Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-brown/80 via-deep-brown/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/70 via-transparent to-deep-brown/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Festive Tag */}
          <div className="inline-flex items-center gap-2 bg-forest-green/90 text-cream px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-gold">✦</span>
            <span className="text-sm font-medium">Christmas Festive Season 2025</span>
            <span className="text-gold">✦</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6 text-balance">
            The Taste of Home this <span className="text-gold">Christmas</span> in Joburg
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-cream/90 mb-8 max-w-2xl leading-relaxed text-pretty">
            Authentic African cuisine and holiday favorites delivered straight to your door. Celebrate the season
            without the stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-terracotta hover:bg-ochre text-cream font-semibold text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl group">
              <a href="/shop">
                View Festive Menu
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
           
          </div>

        </div>
      </div>


    </section>
  )
}
