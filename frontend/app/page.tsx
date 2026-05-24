'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import api from '@/services/api'
import ProductCard from '@/components/ProductCard'
import type { CartLine } from '@/store/cartStore'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Search } from 'lucide-react'

type Product = Omit<CartLine, 'qty'> & {
  category?: {
    id: number
    name: string
  }
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])

  const addToCart = useCartStore((s) => s.addToCart)
  const cart = useCartStore((s) => s.cart)

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.qty, 0),
    [cart]
  )

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await api.get<Product[]>('/products')
    setProducts(res.data)
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-full mx-auto px-5 h-20 flex items-center justify-between px-32">
          {/* LOGO */}
          <Link href="/">
            <span className="text-2xl font-semibold tracking-[0.2em]">
              MIMART
            </span>
          </Link>

          {/* MENU */}
          {/* <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="#">HOME</Link>
            <Link href="#">KOLEKSI</Link>
            <Link href="#">DRESS</Link>
            <Link href="#">OUTER</Link>
            <Link href="#">CONTACT</Link>
          </nav> */}

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button className="hover:opacity-70">
              <Search size={22} />
            </button>

            <Link href="/cart" className="relative">
              <ShoppingCart size={24} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-full mx-auto px-5 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-32">
          {/* LEFT */}
          <div>
            <span className="uppercase tracking-[0.3em] text-sm text-gray-500">
              New Collection 2026
            </span>

            <h1 className="text-5xl md:text-7xl font-light leading-tight mt-5">
              Fashion Muslimah
              <span className="block font-semibold">
                Elegant & Modern
              </span>
            </h1>

            <p className="mt-6 text-gray-600 leading-8 max-w-xl">
              Temukan koleksi fashion muslimah premium dengan desain modern,
              elegan, dan nyaman digunakan untuk aktivitas sehari-hari maupun
              acara spesial.
            </p>

            <div className="flex gap-4 mt-10">
              <Link
                href="#products"
                className="bg-black text-white px-8 py-4 rounded-full text-sm tracking-wide hover:bg-gray-800 transition"
              >
                LIHAT KOLEKSI
              </Link>

              <Link
                href="#"
                className="border border-gray-300 px-8 py-4 rounded-full text-sm hover:bg-white transition"
              >
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#efe7da] rounded-[40px] rotate-3"></div>

            <img
              src="/banner.jpg"
              alt="Banner"
              className="relative rounded-[40px] w-full h-[650px] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="bg-black text-white">
        <div className="max-w-full mx-auto px-5 py-4 flex justify-center items-center gap-3 text-sm tracking-wide">
          <span>🎉</span>
          <span>
            GRATIS ONGKIR UNTUK PEMBELIAN DI ATAS RP 500.000
          </span>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="max-w-full mx-auto px-5 py-20"
      >
        {/* TITLE */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14 px-32">
          <div>
            <span className="uppercase tracking-[0.3em] text-sm text-gray-500">
              Our Products
            </span>

            <h2 className="text-4xl md:text-5xl font-light mt-3">
              Koleksi Terbaru
            </h2>

            <p className="text-gray-600 mt-5 max-w-xl leading-7">
              Produk pilihan dengan kualitas premium dan desain eksklusif
              khusus untuk fashion muslimah modern.
            </p>
          </div>

          <Link
            href="#"
            className="text-sm tracking-wide underline underline-offset-4"
          >
            LIHAT SEMUA
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-10 md:px-20 lg:px-32">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >
              <ProductCard
                product={product}
                addToCart={addToCart}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-full mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-10 px-32">
          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>

            <h3 className="font-semibold text-lg">
              Gratis Ongkir
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              Gratis ongkir untuk minimum pembelian tertentu
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>

            <h3 className="font-semibold text-lg">
              Pembayaran Aman
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              Sistem pembayaran aman dan terpercaya
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>

            <h3 className="font-semibold text-lg">
              WhatsApp Support
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              Customer support fast response setiap hari
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">↩️</div>

            <h3 className="font-semibold text-lg">
              Garansi Produk
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-6">
              Garansi retur apabila produk bermasalah
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f4eee4] border-t border-gray-200">
        <div className="max-w-full mx-auto px-5 py-14 px-32">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div>
              <h2 className="text-2xl tracking-[0.2em] font-semibold">
                KAKAOSHOP
              </h2>

              <p className="text-gray-600 mt-5 max-w-md leading-7">
                Toko online fashion muslimah modern dengan kualitas premium
                dan desain elegan untuk wanita Indonesia.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                Metode Pembayaran
              </h3>

              <div className="flex gap-3 flex-wrap text-sm text-gray-600">
                <span>OVO</span>
                <span>•</span>
                <span>GoPay</span>
                <span>•</span>
                <span>DANA</span>
                <span>•</span>
                <span>Transfer Bank</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-10 pt-6 text-sm text-gray-500">
            © 2024-2026 KAKAOSHOP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}