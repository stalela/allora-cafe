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
import type { Category } from '@/types/database'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.number().default(0),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image_url: category.image_url || '',
          is_active: category.is_active,
          display_order: category.display_order,
        }
      : {
          is_active: true,
          display_order: 0,
        },
  })

  const nameValue = watch('name')

  useEffect(() => {
    // Auto-generate slug from name
    if (nameValue && !category) {
      const slug = generateSlug(nameValue)
      setValue('slug', slug)
    }
  }, [nameValue, category, setValue])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClientSupabase()
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `categories/${fileName}`

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

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      
      const categoryData = {
        ...data,
        description: data.description || null,
        image_url: data.image_url || null,
      }

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id)

        if (error) throw error
        toast.success('Category updated successfully')
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert(categoryData)

        if (error) throw error
        toast.success('Category created successfully')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      toast.error(category ? 'Failed to update category' : 'Failed to create category', {
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
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                {...register('name')}
                className="mt-1"
                placeholder="Enter category name"
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
                placeholder="category-slug"
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
                placeholder="Enter category description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <Input
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Image</CardTitle>
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

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
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

