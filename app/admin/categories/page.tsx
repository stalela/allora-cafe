import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { CategoriesTable } from '@/components/admin/categories-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FolderTree } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoriesTable />
    </div>
  )
}





