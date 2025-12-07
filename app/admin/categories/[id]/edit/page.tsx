import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { CategoryForm } from '@/components/admin/category-form'

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch the category
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !category) {
    redirect('/admin/categories')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground mt-1">
          Update category information
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}

