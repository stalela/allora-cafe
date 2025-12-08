"use client"

import { useState, useEffect } from "react"
import { Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import type { Product, Category } from "@/types/database"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image: string
  badge?: string
  slug: string
}

function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    console.debug('[Menu] handleAddToCart', item.name)
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    })
  }

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
          <span className="text-terracotta font-bold text-lg whitespace-nowrap">R{item.price.toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
        )}
        <Button
          className="w-full bg-forest-green hover:bg-forest-green/90 text-cream font-medium transition-all duration-300 hover:scale-[1.02] group/btn"
          onClick={handleAddToCart}
        >
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState<string>("")
  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      // Fetch active products with categories
      const productsRes = await fetch('/api/products?includeInactive=false')
      if (!productsRes.ok) {
        throw new Error('Failed to fetch products')
      }
      const productsData = await productsRes.json()
      const products: (Product & { category: Category | null })[] = productsData.data || []

      // Fetch active categories
      const categoriesRes = await fetch('/api/categories?includeInactive=false')
      if (!categoriesRes.ok) {
        throw new Error('Failed to fetch categories')
      }
      const categoriesData = await categoriesRes.json()
      const activeCategories: Category[] = categoriesData.data || []

      // Group products by category slug (or "all" if no category)
      const grouped: Record<string, MenuItem[]> = {}
      
      activeCategories.forEach((category) => {
        grouped[category.slug] = []
      })

      // Add products to their categories
      products.forEach((product) => {
        const menuItem: MenuItem = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image_url || "/placeholder.svg",
          slug: product.slug,
          badge: product.is_featured ? "Featured" : undefined,
        }

        if (product.category?.slug) {
          if (!grouped[product.category.slug]) {
            grouped[product.category.slug] = []
          }
          grouped[product.category.slug].push(menuItem)
        } else {
          // Products without category go to "all" or first category
          const firstCategorySlug = activeCategories[0]?.slug || "all"
          if (!grouped[firstCategorySlug]) {
            grouped[firstCategorySlug] = []
          }
          grouped[firstCategorySlug].push(menuItem)
        }
      })

      // Remove empty categories
      Object.keys(grouped).forEach((key) => {
        if (grouped[key].length === 0) {
          delete grouped[key]
        }
      })

      // Sort categories by product count (descending)
      const sortedCategories = activeCategories
        .filter((cat) => grouped[cat.slug] && grouped[cat.slug].length > 0)
        .sort((a, b) => {
          const countA = grouped[a.slug]?.length || 0
          const countB = grouped[b.slug]?.length || 0
          return countB - countA // Descending order
        })

      setMenuData(grouped)
      setCategories(sortedCategories)
      
      // Set first category (with most items) as active tab
      if (sortedCategories.length > 0 && !activeTab) {
        setActiveTab(sortedCategories[0].slug)
      }
    } catch (error) {
      console.error('Failed to load menu data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="christmas-menu" className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0 || Object.keys(menuData).length === 0) {
    return (
      <section id="christmas-menu" className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No menu items available at this time.</p>
          </div>
        </div>
      </section>
    )
  }

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
            {categories.slice(0, 3).map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.slug}
                className="data-[state=active]:bg-terracotta data-[state=active]:text-cream py-3 font-medium transition-all"
              >
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.slice(0, 3).map((category) => (
            <TabsContent key={category.id} value={category.slug} className="mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(menuData[category.slug] || []).map((item) => (
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
            asChild
          >
            <a href="/shop" rel="noopener noreferrer">
              <ShoppingBag className="mr-2 h-5 w-5" />
              View Full Menu
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
