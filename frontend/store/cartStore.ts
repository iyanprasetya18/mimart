import { create } from 'zustand'

export type CartLine = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  categoryId?: number
  category?: unknown
  qty: number
}

export const useCartStore = create<{
  cart: CartLine[]
  addToCart: (product: Omit<CartLine, 'qty'>, qtyToAdd?: number) => void
  removeFromCart: (id: number) => void
  updateQty: (id: number, qty: number) => void
}>((set, get) => ({
  cart: [],

  addToCart: (product, qtyToAdd = 1) => {
    const requested = Math.max(1, Math.floor(Number(qtyToAdd)) || 1)
    const maxStock = Math.max(0, product.stock)
    const add = Math.min(requested, maxStock)
    if (add < 1) return

    const cart = get().cart
    const idx = cart.findIndex((x) => x.id === product.id)

    if (idx >= 0) {
      const next = [...cart]
      const line = next[idx]
      const newQty = Math.min(line.qty + add, maxStock)
      next[idx] = { ...line, qty: newQty }
      set({ cart: next })
    } else {
      set({
        cart: [...cart, { ...product, qty: add }],
      })
    }
  },

  removeFromCart: (id) => {
    set({
      cart: get().cart.filter((x) => x.id !== id),
    })
  },

  updateQty: (id, qty) => {
    const cart = get().cart
    const idx = cart.findIndex((x) => x.id === id)
    if (idx < 0) return

    const line = cart[idx]
    const newQty = Math.max(1, Math.min(qty, line.stock))

    const next = [...cart]
    next[idx] = { ...line, qty: newQty }
    set({ cart: next })
  },
}))
