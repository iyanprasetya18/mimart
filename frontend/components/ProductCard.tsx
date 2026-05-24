'use client'

import toast from 'react-hot-toast'
import type { CartLine } from '@/store/cartStore'
import { ShoppingBag } from 'lucide-react'

type ProductCardProps = {
  product: Omit<CartLine, 'qty'>
  addToCart: (product: Omit<CartLine, 'qty'>, qty?: number) => void
}

export default function ProductCard({
  product,
  addToCart
}: ProductCardProps) {

  const handleAdd = () => {
    if (product.stock < 1) {
      toast.error('Stok habis')
      return
    }

    addToCart(product, 1)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  return (
    <div className="group">
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#f8f5ef]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover transition duration-500 group-hover:scale-105"
        />

        {/* STOCK BADGE */}
        {product.stock < 1 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium">
              Stok Habis
            </span>
          </div>
        )}

        {/* CATEGORY */}
        {product.category?.name && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs tracking-wide text-gray-700 shadow-sm">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="pt-5">
        {/* TITLE */}
        <h2 className="text-lg md:text-xl font-medium leading-7 line-clamp-2 min-h-[56px]">
          {product.name}
        </h2>

        {/* PRICE */}
        <div className="mt-3">
          <p className="text-xl font-semibold text-gray-900">
            Rp {product.price.toLocaleString()}
          </p>
        </div>

        {/* STOCK */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600">
              Stok tersedia
            </span>
          ) : (
            <span className="text-sm text-red-500">
              Produk habis
            </span>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock < 1}
          className={`
            mt-5 w-full h-12 rounded-full flex items-center justify-center gap-2
            transition-all duration-300 text-sm tracking-wide font-medium
            ${
              product.stock < 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-[#2b2b2b] hover:scale-[1.02]'
            }
          `}
        >
          <ShoppingBag size={18} />

          {product.stock < 1
            ? 'STOK HABIS'
            : 'TAMBAH KE KERANJANG'}
        </button>
      </div>
    </div>
  )
}