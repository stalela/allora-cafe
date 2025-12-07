'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClientSupabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { generateSlug } from '@/lib/utils/slug'
import type { Product, Category } from '@/types/database'

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  compare_at_price: z.number().min(0).optional().nullable(),
  cost_price: z.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  stock_quantity: z.number().min(0).default(0),
  track_inventory: z.boolean().default(true),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0),
  weight: z.number().min(0).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product & { category: Category | null }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          compare_at_price: product.compare_at_price,
          cost_price: product.cost_price,
          sku: product.sku || '',
          barcode: product.barcode || '',
          category_id: product.category_id || '',
          image_url: product.image_url || '',
          stock_quantity: product.stock_quantity,
          track_inventory: product.track_inventory,
          is_active: product.is_active,
          is_featured: product.is_featured,
          display_order: product.display_order,
          weight: product.weight,
          tags: product.tags || [],
        }
      : {
          stock_quantity: 0,
          track_inventory: true,
          is_active: true,
          is_featured: false,
          display_order: 0,
        },
  })

  const nameValue = watch('name')

  useEffect(() => {
    // Auto-generate slug from name
    if (nameValue && !product) {
      const slug = generateSlug(nameValue)
      setValue('slug', slug)
    }
  }, [nameValue, product, setValue])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const supabase = createClientSupabase()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClientSupabase()
      
      // Create storage bucket if it doesn't exist (you'll need to do this in Supabase dashboard)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setValue('image_url', publicUrl)
      setImagePreview(publicUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      
      const productData = {
        ...data,
        compare_at_price: data.compare_at_price || null,
        cost_price: data.cost_price || null,
        category_id: data.category_id || null,
        image_url: data.image_url || null,
        weight: data.weight || null,
        tags: data.tags || null,
      }

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
        toast.success('Product updated successfully')
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
        toast.success('Product created successfully')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      toast.error(product ? 'Failed to update product' : 'Failed to create product', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                {...register('name')}
                className="mt-1"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Slug *</label>
              <Input
                {...register('slug')}
                className="mt-1"
                placeholder="product-slug"
              />
              {errors.slug && (
                <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                {...register('category_id')}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Price (R) *</label>
              <Input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Compare at Price (R)</label>
              <Input
                type="number"
                step="0.01"
                {...register('compare_at_price', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Cost Price (R)</label>
              <Input
                type="number"
                step="0.01"
                {...register('cost_price', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium">SKU</label>
              <Input
                {...register('sku')}
                className="mt-1"
                placeholder="SKU-123"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Barcode</label>
              <Input
                {...register('barcode')}
                className="mt-1"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock Quantity</label>
              <Input
                type="number"
                {...register('stock_quantity', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('track_inventory')}
                  className="rounded"
                />
                <span className="text-sm">Track Inventory</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagePreview && (
            <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Upload Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file)
                }
              }}
              disabled={uploading}
              className="mt-1"
            />
            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Or Image URL</label>
            <Input
              {...register('image_url')}
              className="mt-1"
              placeholder="https://example.com/image.jpg"
              onChange={(e) => setImagePreview(e.target.value || null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('is_active')}
                className="rounded"
              />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">Display Order</label>
            <Input
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              className="mt-1"
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Weight (kg)</label>
            <Input
              type="number"
              step="0.01"
              {...register('weight', { valueAsNumber: true })}
              className="mt-1"
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

