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
            <span className="text-sm font-medium">Christmas Festive Season 2024</span>
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
            <Button asChild>
              <a href="https://wa.me/27677685025?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order%20from%20Allora%20Cafe" target="_blank" rel="noopener noreferrer">
              
              size="lg"
              className="bg-terracotta hover:bg-ochre text-cream font-semibold text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl group"
            >
              View Festive Menu
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild>
              <a href="https://wa.me/27677685025?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order%20from%20Allora%20Cafe" target="_blank" rel="noopener noreferrer">
              
              size="lg"
              variant="outline"
              className="border-2 border-cream/80 bg-transparent text-cream hover:bg-cream hover:text-deep-brown font-semibold text-lg px-8 py-6 transition-all duration-300"
            >
              <Truck className="mr-2 h-5 w-5" />
              Order Now
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-cream/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-cream bg-sand overflow-hidden">
                    <img
                      src={`/happy-south-african-customer-face-.jpg?height=32&width=32&query=happy South African customer face ${i}`}
                      alt={`Customer ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-cream/80 text-sm">500+ Happy Deliveries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-gold text-lg">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-cream/80 text-sm">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gold" />
              <span className="text-cream/80 text-sm">Delivery Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-cream/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
