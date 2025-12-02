import { Phone, Mail, Clock, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-sand">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Content */}
          <div>
            <span className="text-terracotta font-medium text-sm uppercase tracking-wider">About Us</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-brown mt-2 mb-6 text-balance">
              Bringing the Heart of Joburg to Your Dinner Table
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Born in the vibrant streets of Marshalltown Joburg, Allora Cafe is more than a kitchen — it's a celebration of
                African culinary heritage. Our chefs blend traditional recipes passed down through generations with
                modern techniques to create dishes that tell stories.
              </p>
              <p>
                This festive season, we're bringing the warmth of a Joburg Christmas straight to your home. Whether
                you're craving the comfort of Mogodu, the richness of slow-cooked Oxtail, or the festive joy of
                honey-glazed Gammon, every dish is prepared with love and the freshest local ingredients — and delivered
                hot to your door across Johannesburg.
              </p>
              <p className="font-medium text-deep-brown">
                From our kitchen to your table — Allora! (Here's to good food!)
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <Card className="bg-cream border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 bg-forest-green/10 rounded-lg">
                    <Clock className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">Delivery Hours</h4>
                    <p className="text-muted-foreground text-sm">Mon-Sun: 9AM - 10PM</p>
                    <p className="text-terracotta text-xs font-medium">Extended festive hours!</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cream border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 bg-forest-green/10 rounded-lg">
                    <Phone className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">Order by Phone</h4>
                    <p className="text-muted-foreground text-sm">+27677685025</p>
                    <p className="text-muted-foreground text-xs">WhatsApp available</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cream border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 bg-forest-green/10 rounded-lg">
                    <Mail className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">Email</h4>
                    <p className="text-muted-foreground text-sm">hello@alloracafe.co.za</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-cream border-0 shadow-md">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 bg-forest-green/10 rounded-lg">
                    <Truck className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-brown text-sm">Delivery Area</h4>
                    <p className="text-muted-foreground text-sm">All of Johannesburg</p>
                    <p className="text-muted-foreground text-xs">Sandton, Rosebank, Soweto & more</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-terracotta/20 rounded-3xl blur-2xl" />
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="relative h-[400px] lg:h-[500px] bg-muted">
                  <img
                    src="/johannesburg-city-delivery-zone-map-illustration.jpg"
                    alt="Allora Cafe Delivery Zone - All of Johannesburg"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 to-transparent" />

                  {/* Delivery Zone Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-terracotta/30 rounded-full animate-ping" />
                      <div className="relative bg-terracotta p-3 rounded-full shadow-xl">
                        <Truck className="h-6 w-6 text-cream" />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-cream/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <h4 className="font-serif font-bold text-deep-brown mb-1">We Deliver Joburg-Wide</h4>
                      <p className="text-muted-foreground text-sm">
                        Sandton, Rosebank, Soweto, Randburg, Midrand, and all surrounding areas
                      </p>
                      <p className="text-terracotta text-sm font-medium mt-2">Free delivery on orders over R500</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
