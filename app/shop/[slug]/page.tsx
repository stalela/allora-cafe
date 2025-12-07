import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const revalidate = 0

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !product || product.is_active === false) {
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
              {product.compare_at_price && (
                <p className="text-muted-foreground line-through">
                  R{product.compare_at_price.toFixed(2)}
                </p>
              )}
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
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-deep-brown">Inventory:</span>
                <span>
                  {product.track_inventory ? product.stock_quantity : 'Made to order / not tracked'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`https://wa.me/27689592478?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(
                  product.name
                )}%20(R${product.price})%20from%20Allora%20Cafe`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-forest-green px-6 py-3 text-cream font-semibold shadow-sm hover:bg-forest-green/90 transition-colors"
              >
                Order on WhatsApp
              </Link>
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
