import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { buildMetadata } from "@/lib/seo"

type ProductLayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const supabase = await createServerSupabaseClient()
    const { data: product } = await supabase
      .from("products")
      .select("name, description, image_url, slug, price")
      .eq("slug", slug)
      .single()

    if (!product) {
      return buildMetadata({
        title: "Product not found | Allora Cafe",
        description: "Browse our menu for available dishes and festive specials.",
        url: `/shop/${slug}`,
        noIndex: true,
      })
    }

    return buildMetadata({
      title: `${product.name} | Allora Cafe`,
      description: product.description
        ? product.description.slice(0, 180)
        : `Order ${product.name} from Allora Cafe.`,
      url: `/shop/${product.slug}`,
      images: product.image_url ? [product.image_url] : undefined,
    })
  } catch (error) {
    console.error("[SEO] Failed to build product metadata", error)
    return buildMetadata({
      title: "Product | Allora Cafe",
      description: "Explore our authentic African cuisine and festive menu.",
      url: `/shop/${slug}`,
      noIndex: true,
    })
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>
}
