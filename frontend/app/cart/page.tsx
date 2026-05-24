'use client'

import Link from 'next/link'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useMemo } from 'react'

export default function CartPage() {
  const cart = useCartStore((s) => s.cart)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const updateQty = useCartStore((s) => s.updateQty)

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * item.price, 0),
    [cart]
  )

  const handleCheckout = async () => {
    if (cart.length === 0) return

    const payload = {
      customerName: 'Customer',
      customerPhone: '08123456789',
      customerAddress: 'Indonesia',
      items: cart,
    }

    const res = await api.post('/orders', payload)
    const order = res.data

    let message = `Halo Admin,%0A%0A`
    message += `ORDER ID: ${order.orderCode}%0A%0A`

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.qty} - Rp ${(item.qty * item.price).toLocaleString()}%0A`
    })

    message += `%0A*Total: Rp ${total.toLocaleString()}*%0A%0ATerima kasih`

    window.open(
      `https://wa.me/6285248480863?text=${message}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wide text-[#009688]">
              KAKAOSHOP
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#009688] flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Lanjut Belanja
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Keranjang Belanja
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Keranjang masih kosong
            </h2>
            <p className="text-gray-500 mb-6">
              Yuk, mulai belanja dan temukan produk favoritmu!
            </p>
            <Link
              href="/"
              className="inline-block bg-[#009688] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00796b] transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* CART ITEMS */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                >
                  {/* IMAGE */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Rp {item.price.toLocaleString()} / item
                    </p>

                    {/* QTY CONTROLS */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-medium text-sm">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item.id)
                          toast.success(`${item.name} dihapus dari keranjang`)
                        }}
                        className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#009688]">
                      Rp {(item.qty * item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Item</span>
                    <span>{cart.reduce((sum, item) => sum + item.qty, 0)} item</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-[#009688]">Gratis</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#009688]">Rp {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold
                    flex items-center justify-center gap-2 hover:bg-[#20bd5a] active:scale-[0.98] transition-all
                    disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pesan via WhatsApp
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Pesanan akan diproses via WhatsApp
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500">
          © 2024-2025 Kakaoshop. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  )
}