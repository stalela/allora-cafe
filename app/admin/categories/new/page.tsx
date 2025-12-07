import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { CategoryForm } from '@/components/admin/category-form'

export default async function NewCategoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <p className="text-muted-foreground mt-1">
          Create a new category for your products
        </p>
      </div>

      <CategoryForm />
    </div>
  )
}



