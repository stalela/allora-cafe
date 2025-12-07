import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 0

export default async function ShopPage() {
  const supabase = await createServerSupabaseClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load products: ${error.message}`)
  }

  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-terracotta text-cream border-0">Shop</Badge>
          <h1 className="font-serif text-4xl font-bold text-deep-brown">All Products</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our full catalog and view product details.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
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
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {product.is_featured && (
                      <Badge variant="secondary" className="bg-terracotta/10 text-terracotta border-0">
                        Featured
                      </Badge>
                    )}
                    {product.track_inventory === false && <span>Made to order</span>}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
