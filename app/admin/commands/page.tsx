import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 0

export default async function AdminCommandsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // Redirect unauthenticated admins to login
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    } as never
  }

  const { data: commands, error } = await supabase
    .from('admin_command_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw new Error(`Failed to load command logs: ${error.message}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Command Logs</h1>
        <p className="text-muted-foreground mt-1">Admin command history and audit trail</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Admin Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Command</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Args</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Response</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Executed</th>
                </tr>
              </thead>
              <tbody>
                {(commands || []).map((cmd) => (
                  <tr key={cmd.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm">{cmd.admin_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-mono">
                        /{cmd.command}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {cmd.args && Object.keys(cmd.args).length > 0 ? (
                        <div className="text-sm text-muted-foreground font-mono">
                          {Object.entries(cmd.args)
                            .map(([key, value]) => `${key}=${value}`)
                            .join(', ')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={cmd.success ? "default" : "destructive"}
                        className={cmd.success ? "bg-green-100 text-green-800 border-0" : ""}
                      >
                        {cmd.success ? '✅ Success' : '❌ Failed'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-deep-brown truncate" title={cmd.response || undefined}>
                        {cmd.response || (
                          <span className="text-muted-foreground">No response</span>
                        )}
                      </div>
                      {cmd.error_message && (
                        <div className="text-sm text-red-600 mt-1 truncate" title={cmd.error_message}>
                          Error: {cmd.error_message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(cmd.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {(!commands || commands.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No command logs found yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Command logs will appear here when admins use WhatsApp commands.
          </p>
        </div>
      )}
    </div>
  )
}