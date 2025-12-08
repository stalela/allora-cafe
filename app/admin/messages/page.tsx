import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 0

export default async function AdminMessagesPage() {
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

  const { data: messages, error } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw new Error(`Failed to load messages: ${error.message}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Messages</h1>
        <p className="text-muted-foreground mt-1">Latest inbound WhatsApp events</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">From</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">To</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Text</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {(messages || []).map((msg) => (
                  <tr key={msg.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{msg.wa_from || 'Unknown'}</div>
                      {msg.profile_name && (
                        <div className="text-sm text-muted-foreground">{msg.profile_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {msg.wa_to || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-terracotta/10 text-terracotta border-0">
                        {msg.message_type || 'unknown'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-deep-brown">
                      {msg.message_text || (
                        <span className="text-muted-foreground">No text payload</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


