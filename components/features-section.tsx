import { Leaf, UtensilsCrossed, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Leaf,
    title: "Local & Fresh",
    description:
      "Sourced from SA farmers. We partner with local suppliers to bring you the freshest ingredients South Africa has to offer.",
  },
  {
    icon: UtensilsCrossed,
    title: "Festive Feasts",
    description:
      "Family-sized platters available. From intimate dinners to grand celebrations, we have the perfect portions for every gathering.",
  },
  {
    icon: Truck,
    title: "Joburg-wide Delivery",
    description:
      "Hot and fresh to your door. Our dedicated delivery team ensures your meal arrives perfectly prepared, anywhere in Johannesburg.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-terracotta font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-brown mt-2 text-balance">
            A Celebration of African Flavours
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-cream border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-green/10 mb-6 group-hover:bg-forest-green/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-forest-green" />
                </div>
                <h3 className="font-serif text-xl font-bold text-deep-brown mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
