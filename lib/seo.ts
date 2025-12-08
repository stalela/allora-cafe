import type { Metadata } from "next"

type BuildMetadataOptions = {
  title?: string
  description?: string
  url?: string
  images?: string[]
  keywords?: string[]
  noIndex?: boolean
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://allora-cafe.vercel.app"

const siteDefaults = {
  name: "Allora Cafe",
  description:
    "Authentic African cuisine and festive favorites delivered in Marshalltown, Johannesburg. Order your favorites or explore our seasonal specials.",
  keywords: [
    "Allora Cafe",
    "African cuisine",
    "Marshalltown restaurant",
    "Johannesburg food delivery",
    "festive meals",
    "South African food",
  ],
  locale: "en_ZA",
  socialImage: "/placeholder.jpg",
}

const toAbsoluteUrl = (path?: string) => {
  if (!path) return siteUrl
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const {
    title = siteDefaults.name,
    description = siteDefaults.description,
    url = "/",
    images,
    keywords = siteDefaults.keywords,
    noIndex = false,
  } = options

  const ogImages = (images && images.length > 0
    ? images
    : [siteDefaults.socialImage]
  ).map((img) => ({ url: toAbsoluteUrl(img) }))

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: toAbsoluteUrl(url),
    },
    openGraph: {
      title,
      description,
      url: toAbsoluteUrl(url),
      siteName: siteDefaults.name,
      locale: siteDefaults.locale,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  }
}

export const defaultMetadata = buildMetadata()
