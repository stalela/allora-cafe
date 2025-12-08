import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug'
import type { ProductInsert, ProductUpdate } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10))
    }

    if (offset) {
      query = query.range(parseInt(offset, 10), parseInt(offset, 10) + (limit ? parseInt(limit, 10) - 1 : 0))
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, count: data?.length || 0 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductInsert = await request.json()

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    if (body.price < 0) {
      return NextResponse.json(
        { error: 'Price must be greater than or equal to 0' },
        { status: 400 }
      )
    }

    const baseSlug = generateSlug(body.name)
    if (!baseSlug) {
      return NextResponse.json(
        { error: 'Unable to generate slug from name' },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900).toString()
    const slugWithRandom = `${baseSlug}-${randomSuffix}`

    const { data: existing, error: existingError } = await supabase
      .from('products')
      .select('slug')
      .ilike('slug', `${slugWithRandom}%`)

    if (existingError) {
      console.error('Error checking existing slugs:', existingError)
      return NextResponse.json(
        { error: 'Failed to create product', details: existingError.message },
        { status: 500 }
      )
    }

    const uniqueSlug = generateUniqueSlug(
      slugWithRandom,
      (existing || []).map((p) => p.slug)
    )

    const attemptInsert = async (slugToUse: string) => {
      const { slug: _ignoreSlug, ...bodyWithoutSlug } = body
      return supabase
        .from('products')
        .insert({ ...bodyWithoutSlug, slug: slugToUse })
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .single()
    }

    let { data, error } = await attemptInsert(uniqueSlug)

    if (error && error.code === '23505') {
      const { data: existingAgain } = await supabase
        .from('products')
        .select('slug')
        .ilike('slug', `${slugWithRandom}%`)

      const retrySlug = generateUniqueSlug(
        slugWithRandom,
        (existingAgain || []).map((p) => p.slug)
      )
      const retry = await attemptInsert(retrySlug)
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

