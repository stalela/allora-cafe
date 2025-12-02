import { Gift, Users, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PromoBanner() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-forest-green" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold Border Frame */}
      <div className="container mx-auto px-4 relative">
        <div className="border-2 border-gold/60 rounded-2xl p-8 md:p-12 bg-forest-green/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gold/20 rounded-2xl blur-xl" />
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Family Christmas Platter"
                  className="relative rounded-xl w-full shadow-2xl border-2 border-gold/30"
                />
                <div className="absolute -top-4 -right-4 bg-terracotta text-cream font-bold py-2 px-4 rounded-full text-lg shadow-lg">
                  -20% OFF
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-1 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4 text-balance">
                Family Christmas Platter
              </h2>

              <p className="text-cream/80 text-lg mb-6 max-w-xl">
                The ultimate festive feast! Includes roast lamb, honey gammon, roasted vegetables, pap, chakalaka, and
                Malva pudding. Perfect for 6-8 guests.
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-cream/90">
                  <Users className="h-5 w-5 text-gold" />
                  <span className="text-sm">Feeds 6-8</span>
                </div>
                <div className="flex items-center gap-2 text-cream/90">
                  <Clock className="h-5 w-5 text-gold" />
                  <span className="text-sm">Pre-order 48hrs</span>
                </div>
                <div className="flex items-center gap-2 text-cream/90">
                  <Gift className="h-5 w-5 text-gold" />
                  <span className="text-sm">Free Delivery</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-baseline gap-2">
                  <span className="text-cream/60 line-through text-xl">R1,850</span>
                  <span className="text-gold font-bold text-4xl">R1,480</span>
                </div>
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-deep-brown font-bold text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl"
                  asChild
                >
                  <a href="https://wa.me/27677685025?text=Hi%2C%20I%20would%20like%20to%20order%20the%20Family%20Christmas%20Platter%20(R1%2C480)%20from%20Allora%20Cafe" target="_blank" rel="noopener noreferrer">
                    <Gift className="mr-2 h-5 w-5" />
                    Order Platter Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
