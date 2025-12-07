import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ProductInsert, ProductUpdate } from '@/types/database'

// GET /api/products - Get all products
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

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: ProductInsert = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || body.price === undefined) {
      return NextResponse.json(
        { error: 'Name, slug, and price are required' },
        { status: 400 }
      )
    }

    // Validate price
    if (body.price < 0) {
      return NextResponse.json(
        { error: 'Price must be greater than or equal to 0' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

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

