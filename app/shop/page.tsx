"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Navbar from '@/components/navbar'
import type { Product } from '@/types/database'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackTimer, setFeedbackTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const supabase = createClientSupabase()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load products:', error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    console.debug('[Shop] handleAddToCart', product.name)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.svg',
      slug: product.slug,
    })

    // Show brief feedback
    setFeedback(`Added "${product.name}" to cart`)
    if (feedbackTimer) {
      clearTimeout(feedbackTimer)
    }
    const timer = setTimeout(() => setFeedback(null), 2400)
    setFeedbackTimer(timer)
  }

  if (loading) {
    return (
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Navbar />
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-terracotta text-cream border-0">Shop</Badge>
            <h1 className="font-serif text-4xl font-bold text-deep-brown">All Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our full catalog and view product details.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <Link href={`/shop/${product.slug}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-deep-brown leading-tight">
                        {product.name}
                      </h3>
                      <span className="text-terracotta font-bold text-lg whitespace-nowrap">
                        R{product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                    )}
                    {product.is_featured && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="bg-terracotta/10 text-terracotta border-0">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Link>
                <div className="p-5 pt-0">
                  <Button
                    className="w-full bg-forest-green hover:bg-forest-green/90 text-cream font-medium transition-all duration-300 hover:scale-[1.02] group/btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {feedback && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-forest-green text-cream px-4 py-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}
    </>
  )
}
