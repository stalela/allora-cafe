"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

interface CheckoutForm {
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

export default function CartPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required'

    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateWhatsAppMessage = (): string => {
    let message = `Hi Allora Cafe! I'd like to place an order:\n\n`

    items.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - R${(item.price * item.quantity).toFixed(2)}\n`
    })

    message += `\nTotal: R${totalPrice.toFixed(2)}\n\n`
    message += `Delivery Details:\n`
    message += `Name: ${formData.name}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.email) message += `Email: ${formData.email}\n`
    message += `Address: ${formData.address}\n`
    if (formData.notes) message += `Notes: ${formData.notes}\n`

    return encodeURIComponent(message)
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    let orderSaved = false

    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_address: formData.address,
        special_instructions: formData.notes,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          product_image_url: item.image,
          product_slug: item.slug
        })),
        total_amount: totalPrice
      }

      // Save order to database (best-effort). If RLS blocks, still proceed to WhatsApp.
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.warn('Order save failed (continuing to WhatsApp):', errorData)
      } else {
        orderSaved = true
        const result = await response.json()
        console.log('Order saved successfully:', result)
      }

    } catch (error) {
      console.warn('Order save errored (continuing to WhatsApp):', error)
    } finally {
      // Generate WhatsApp message and redirect regardless of DB save
      const whatsappUrl = `https://wa.me/27689592478?text=${generateWhatsAppMessage()}`
      window.open(whatsappUrl, '_blank')

      // Clear cart and redirect after action
      clearCart()
      router.push(orderSaved ? '/?order=success' : '/?order=wa-initiated')
    }
  }

  if (items.length === 0) {
    return (
      <section className="py-16 bg-cream min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
              <h1 className="font-serif text-3xl font-bold text-deep-brown">Your cart is empty</h1>
              <p className="text-muted-foreground">Add some delicious items to get started!</p>
            </div>
            <Button asChild className="bg-terracotta hover:bg-ochre text-cream">
              <Link href="/#christmas-menu">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Menu
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-cream min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-terracotta">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Menu
              </Link>
            </Button>
            <div>
              <h1 className="font-serif text-3xl font-bold text-deep-brown">Your Cart</h1>
              <Badge variant="secondary" className="mt-2 bg-terracotta/10 text-terracotta border-0">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-deep-brown">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-sand/30 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium text-deep-brown leading-tight">{item.name}</h4>
                      <p className="text-terracotta font-semibold">R{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 border-terracotta text-terracotta hover:bg-terracotta hover:text-cream"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 border-terracotta text-terracotta hover:bg-terracotta hover:text-cream"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-deep-brown">
                        R{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-sand">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-terracotta">R{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-deep-brown">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-deep-brown">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-deep-brown">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-deep-brown">
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-deep-brown">
                    Delivery Address *
                  </label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={errors.address ? 'border-red-500' : ''}
                    placeholder="Enter your delivery address"
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-deep-brown">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests or dietary requirements"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-forest-green hover:bg-forest-green/90 text-cream font-semibold py-6 text-lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Place Order via WhatsApp
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing your order, you'll be redirected to WhatsApp to confirm with our team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}