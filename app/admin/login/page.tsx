'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error: signInError } = await signIn(email, password)

      if (signInError) {
        const errorMessage = signInError.message || 'Invalid email or password'
        setError(errorMessage)
        toast.error('Login failed', {
          description: errorMessage
        })
        setLoading(false)
        return
      }

      if (data?.user) {
        setSuccess(true)
        toast.success('Login successful!', {
          description: 'Redirecting to admin dashboard...'
        })
        
        // Wait a moment for cookies to be set, then redirect
        // Using window.location ensures a full page reload so server gets the session
        setTimeout(() => {
          window.location.href = '/admin/products'
        }, 600)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      toast.error('Login error', {
        description: errorMessage
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-center">Admin Login</h1>
            <p className="text-muted-foreground text-center mt-2">
              Sign in to manage products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Login successful!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Redirecting to admin dashboard...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !success && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Login failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null) // Clear error when user types
                }}
                required
                disabled={loading || success}
                className={error ? 'border-red-500 focus-visible:border-red-500' : ''}
                aria-invalid={error ? 'true' : 'false'}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null) // Clear error when user types
                }}
                required
                disabled={loading || success}
                className={error ? 'border-red-500 focus-visible:border-red-500' : ''}
                aria-invalid={error ? 'true' : 'false'}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Success! Redirecting...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}



