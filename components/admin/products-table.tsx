'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { Product, Category } from '@/types/database'

export function ProductsTable() {
  const [products, setProducts] = useState<(Product & { category: Category | null })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?includeInactive=true')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to fetch products')
      }
      const body = await res.json()
      setProducts(body.data || [])
    } catch (error) {
      toast.error('Failed to load products', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to delete product')
      }
      toast.success('Product deleted successfully')
      loadProducts()
    } catch (error) {
      toast.error('Failed to delete product', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to update product')
      }
      toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'}`)
      loadProducts()
    } catch (error) {
      toast.error('Failed to update product', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Link href="/admin/products/new">
            <Button>Add Your First Product</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Image</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="px-6 py-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    {product.sku && (
                      <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.category ? (
                      <span className="text-sm">{product.category.name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No category</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">R{product.price.toFixed(2)}</div>
                    {product.compare_at_price && (
                      <div className="text-sm text-muted-foreground line-through">
                        R{product.compare_at_price.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {product.track_inventory ? product.stock_quantity : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(product)}
                        title={product.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {product.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}



