"use client"

import { notFound } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase-client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import Link from 'next/link'
import type { Product, Category } from '@/types/database'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [product, setProduct] = useState<(Product & { category: Category | null }) | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      const supabase = createClientSupabase()
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .single()

      if (error || !data || data.is_active === false) {
        notFound()
      }

      setProduct(data)
    } catch (error) {
      console.error('Failed to load product:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.svg',
      slug: product.slug,
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="relative bg-white">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full max-h-[520px] object-cover"
              />
            </div>
          </Card>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {product.category && (
                  <Badge variant="secondary" className="bg-terracotta/10 text-terracotta border-0">
                    {product.category.name}
                  </Badge>
                )}
                {product.is_featured && (
                  <Badge className="bg-forest-green text-cream border-0">Featured</Badge>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold text-deep-brown">{product.name}</h1>
              <p className="text-terracotta text-2xl font-semibold">R{product.price.toFixed(2)}</p>
            </div>

            {product.description && (
              <Card className="border-0 bg-white shadow-sm">
                <CardContent className="p-5">
                  <h2 className="font-serif text-xl font-semibold mb-3 text-deep-brown">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <div className="flex gap-3 items-center text-sm text-muted-foreground">
                <span className="inline-flex h-2 w-2 rounded-full bg-forest-green" />
                <span>{product.is_active ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="bg-forest-green hover:bg-forest-green/90 text-cream font-semibold shadow-sm transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md border border-terracotta px-6 py-3 text-terracotta font-semibold hover:bg-terracotta hover:text-cream transition-colors"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
