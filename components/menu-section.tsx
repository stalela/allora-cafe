"use client"

import { useState } from "react"
import { Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  badge?: string
}

const menuData: Record<string, MenuItem[]> = {
  festive: [
    {
      id: "f7",
      name: "Jollof Rice and Chicken",
      description: "Herb-marinated whole chicken roasted to golden perfection with seasonal vegetables.",
      price: 285,
      image: "/27ccdacc-eddc-48ea-bc5c-b2800b127950.jpg",
    },
    {
      id: "f1",
      name: "Roast Lamb with Herbs",
      description: "Slow-roasted leg of lamb with rosemary, garlic, and seasonal vegetables. A festive centerpiece.",
      price: 385,
      image: "/roasted-lamb-leg-with-herbs-and-vegetables-on-eleg.jpg",
      badge: "Christmas Special",
    },
    {
      id: "f2",
      name: "Honey-Glazed Gammon",
      description: "Traditional South African gammon glazed with honey, cloves, and pineapple. Serves 4-6.",
      price: 450,
      image: "/honey-glazed-gammon-ham-with-pineapple-and-cloves-.jpg",
      badge: "Popular",
    },
    {
      id: "f3",
      name: "Malva Pudding",
      description: "The classic Cape Dutch dessert - warm, spongy, and drenched in sweet cream sauce.",
      price: 85,
      image: "/malva-pudding-south-african-dessert-with-cream-sau.jpg",
    },
    {
      id: "f4",
      name: "Festive Turkey Platter",
      description: "Herb-roasted turkey with cranberry sauce, stuffing, and all the trimmings.",
      price: 520,
      image: "/roasted-turkey-platter-with-cranberry-sauce-and-st.jpg",
      badge: "Feeds 6",
    },
    {
      id: "f5",
      name: "Christmas Pudding",
      description: "Traditional fruit pudding with brandy sauce and festive spices.",
      price: 95,
      image: "/christmas-pudding-with-brandy-sauce-and-holly-deco.jpg",
    },
    {
      id: "f6",
      name: "Trifle Delight",
      description: "Layers of sponge, custard, jelly, fruit, and cream. A South African Christmas staple.",
      price: 75,
      image: "/traditional-trifle-dessert-layered-with-cream-and-.jpg",
    },
  ],
  african: [
    {
      id: "a7",
      name: "Macaroni & Cheese",
      description: "Slow-cooked beef in a rich, aromatic gravy with root vegetables and herbs.",
      price: 175,
      image: "/72b30ccb-a055-42f7-8f18-7815eda02ccf.jpg",
    },
    {
      id: "a8",
      name: "Noodles with vegetables",
      description: "Traditional South African dish of samp and sugar beans, slow-cooked to perfection.",
      price: 85,
      image: "/0428e26d-6c77-4916-9231-b890f76f7c9b.jpg",
      badge: "Comfort Food",
    },
    {
      id: "a1",
      name: "Mogodu (Tripe)",
      description: "Traditional slow-cooked tripe in a rich, spicy tomato-based sauce. A true taste of home.",
      price: 145,
      image: "/african-mogodu-tripe-stew-in-traditional-bowl.jpg",
      badge: "Heritage Dish",
    },
    {
      id: "a2",
      name: "Oxtail Potjie",
      description: "Tender oxtail braised for hours with root vegetables in traditional three-legged pot style.",
      price: 195,
      image: "/south-african-oxtail-potjie-stew-traditional-dish.jpg",
      badge: "Chef's Favorite",
    },
    {
      id: "a3",
      name: "Pap & Chakalaka",
      description: "Creamy maize meal porridge served with spicy vegetable relish. The heart of African cuisine.",
      price: 65,
      image: "/pap-and-chakalaka-south-african-traditional-dish.jpg",
    },
    {
      id: "a4",
      name: "Jollof Rice",
      description: "West African-inspired tomato rice with aromatic spices and your choice of protein.",
      price: 125,
      image: "/jollof-rice-west-african-dish-with-tomato-and-spic.jpg",
      badge: "Fusion",
    },
    {
      id: "a5",
      name: "Bobotie",
      description: "Cape Malay spiced minced meat bake with egg custard topping. Served with yellow rice.",
      price: 155,
      image: "/bobotie-south-african-cape-malay-dish-with-egg-top.jpg",
    },
    {
      id: "a6",
      name: "Shisa Nyama Platter",
      description: "Selection of grilled meats - boerewors, chicken, and steak with pap and relish.",
      price: 275,
      image: "/shisa-nyama-grilled-meat-platter-south-african-bra.jpg",
      badge: "Feeds 2",
    },
  ],
  cafe: [
    {
      id: "c7",
      name: "Honey wings",
      description: "Fresh mixed greens with grilled chicken, cherry tomatoes, feta, and balsamic vinaigrette.",
      price: 125,
      image: "/998aaec8-b2b9-457e-85a2-f7bf4e2cc6c7.jpg",
    },
    {
      id: "c8",
      name: "Honey drumsticks",
      description: "Selection of fresh grilled fish, prawns, and calamari with lemon butter sauce.",
      price: 295,
      image: "/035360fe-eec2-4294-8044-b48159b1253e.jpg",
      badge: "Premium",
    },
    {
      id: "c1",
      name: "Gourmet Wagyu Burger",
      description: "Premium wagyu beef patty with caramelized onions, aged cheddar, and house sauce.",
      price: 165,
      image: "/gourmet-wagyu-beef-burger-with-cheese-and-toppings.jpg",
      badge: "Best Seller",
    },
    {
      id: "c2",
      name: "Truffle Mushroom Pasta",
      description: "Fresh tagliatelle with wild mushrooms, truffle oil, and parmesan cream.",
      price: 145,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "c3",
      name: "Grilled Linefish",
      description: "Catch of the day, grilled to perfection with lemon butter and seasonal greens.",
      price: 185,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "c4",
      name: "Caesar Salad",
      description: "Crisp romaine, house-made dressing, croutons, and shaved parmesan. Add chicken R35.",
      price: 95,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "c5",
      name: "Ribeye Steak",
      description: "300g aged ribeye with your choice of sauce, chips, and garden salad.",
      price: 265,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Premium",
    },
    {
      id: "c6",
      name: "Vegetarian Buddha Bowl",
      description: "Quinoa, roasted vegetables, hummus, falafel, and tahini dressing.",
      price: 115,
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Card className="overflow-hidden bg-cream border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.badge && (
          <Badge className="absolute top-3 left-3 bg-terracotta text-cream border-0 font-medium">{item.badge}</Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-serif text-lg font-bold text-deep-brown leading-tight">{item.name}</h3>
          <span className="text-terracotta font-bold text-lg whitespace-nowrap">R{item.price}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
        <Button className="w-full bg-forest-green hover:bg-forest-green/90 text-cream font-medium transition-all duration-300 hover:scale-[1.02] group/btn">
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState("festive")

  return (
    <section id="christmas-menu" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-terracotta font-medium text-sm uppercase tracking-wider">Our Menu</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-brown mt-2 mb-4 text-balance">
            Feast on Flavours of Africa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From traditional African heritage dishes to festive holiday specials, discover the tastes that make every
            meal a celebration.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-10 bg-sand p-1 h-auto">
            <TabsTrigger
              value="festive"
              className="data-[state=active]:bg-terracotta data-[state=active]:text-cream py-3 font-medium transition-all"
            >
              <span className="hidden sm:inline">Festive Specials</span>
              <span className="sm:hidden">Festive</span>
            </TabsTrigger>
            <TabsTrigger
              value="african"
              id="african-classics"
              className="data-[state=active]:bg-terracotta data-[state=active]:text-cream py-3 font-medium transition-all"
            >
              <span className="hidden sm:inline">African Heritage</span>
              <span className="sm:hidden">African</span>
            </TabsTrigger>
            <TabsTrigger
              value="cafe"
              className="data-[state=active]:bg-terracotta data-[state=active]:text-cream py-3 font-medium transition-all"
            >
              <span className="hidden sm:inline">Cafe Favorites</span>
              <span className="sm:hidden">Cafe</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(menuData).map(([key, items]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* View Full Menu CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-cream font-semibold px-8 transition-all duration-300 bg-transparent"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  )
}
