import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/test - Test Supabase connection and verify tables exist
export async function GET() {
  try {
    // Test categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    if (categoriesError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to connect to Supabase',
          details: categoriesError.message,
          tables: {
            categories: 'Error',
            products: 'Not tested'
          }
        },
        { status: 500 }
      )
    }

    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (productsError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Products table error',
          details: productsError.message,
          tables: {
            categories: 'OK',
            products: 'Error'
          }
        },
        { status: 500 }
      )
    }

    // Get actual counts
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      tables: {
        categories: {
          status: 'OK',
          count: categoriesCount || 0
        },
        products: {
          status: 'OK',
          count: productsCount || 0
        }
      },
      connection: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'
      }
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

