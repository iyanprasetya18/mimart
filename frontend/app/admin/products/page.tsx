'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/services/api'

type Category = {
  id: number
  name: string
}

type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  categoryId?: number
  category?: Category
}

type FormState = {
  name: string
  description: string
  price: string
  stock: string
  image: string
  categoryId: number | ''
}

const emptyForm = (defaultCategoryId: number | '' = ''): FormState => ({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: '',
  categoryId: defaultCategoryId
})

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<FormState>(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<FormState>(emptyForm())

  const fetchProducts = async () => {
    const res = await api.get<Product[]>('/products')
    setProducts(res.data)
  }

  const fetchCategories = async () => {
    const res = await api.get<Category[]>('/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    const load = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Category[]>('/categories')
      ])

      setProducts(productsRes.data)
      const cats = categoriesRes.data
      setCategories(cats)

      setForm((prev) => {
        if (prev.categoryId !== '') return prev
        const firstId = cats[0]?.id
        return firstId !== undefined ? { ...prev, categoryId: firstId } : prev
      })
    }

    load()
  }, [])

  const createProduct = async () => {
    if (form.categoryId === '') {
      alert('Pilih kategori terlebih dahulu')
      return
    }

    await api.post('/products', {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId)
    })

    alert('Produk berhasil ditambahkan')

    const defaultCat = categories[0]?.id ?? ''
    setForm(emptyForm(defaultCat))

    fetchProducts()
  }

  const deleteProduct = async (id: number) => {
    await api.delete(`/products/${id}`)

    alert('Produk dihapus')

    if (editingId === id) {
      setEditingId(null)
    }

    fetchProducts()
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      categoryId:
        product.categoryId ??
        product.category?.id ??
        (categories[0]?.id ?? '')
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async () => {
    if (editingId === null) return

    if (editForm.categoryId === '') {
      alert('Pilih kategori terlebih dahulu')
      return
    }

    await api.put(`/products/${editingId}`, {
      description: editForm.description,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
      image: editForm.image,
      categoryId: Number(editForm.categoryId)
    })

    alert('Produk diperbarui')
    setEditingId(null)
    fetchProducts()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Kelola Produk
        </h1>

        <Link
          href="/admin/dashboard"
          className="bg-gray-700 text-white px-5 py-3 rounded-lg"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          Tambah Produk
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama produk"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Harga"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <select
            value={form.categoryId === '' ? '' : String(form.categoryId)}
            onChange={(e) => {
              const v = e.target.value
              setForm({
                ...form,
                categoryId: v === '' ? '' : Number(v)
              })
            }}
            className="border p-3 rounded-lg"
          >
            <option value="">
              Pilih Kategori
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-3 rounded-lg w-full mt-4"
        />

        <button
          onClick={createProduct}
          className="bg-black text-white px-5 py-3 rounded-lg mt-4"
        >
          Tambah Produk
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-4"
          >
            {editingId === product.id ? (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">
                  Ubah produk
                </h3>

                

                <input
                  type="text"
                  readOnly
                  aria-readonly="true"
                  value={editForm.name}
                  className="border p-3 rounded-lg w-full text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />

                <input
                  type="text"
                  placeholder="Harga"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="border p-3 rounded-lg w-full text-sm"
                />

                <input
                  type="text"
                  placeholder="Stok"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: e.target.value })
                  }
                  className="border p-3 rounded-lg w-full text-sm"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                  className="border p-3 rounded-lg w-full text-sm"
                />

                <select
                  value={
                    editForm.categoryId === ''
                      ? ''
                      : String(editForm.categoryId)
                  }
                  onChange={(e) => {
                    const v = e.target.value
                    setEditForm({
                      ...editForm,
                      categoryId: v === '' ? '' : Number(v)
                    })
                  }}
                  className="border p-3 rounded-lg w-full text-sm"
                >
                  <option value="">
                    Pilih Kategori
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Deskripsi"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value
                    })
                  }
                  className="border p-3 rounded-lg w-full text-sm min-h-[80px]"
                />

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Simpan
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-200 py-2 rounded-lg text-sm font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={product.image}
                  className="w-full h-52 object-cover rounded-lg"
                  alt=""
                />

                <h2 className="font-bold text-lg mt-3">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold text-gray-800">
                    Kategori:
                  </span>{' '}
                  {product.category?.name ?? '—'}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-semibold text-gray-700">
                    Deskripsi:
                  </span>{' '}
                  {product.description}
                </p>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <span className="font-semibold text-gray-800">
                      Harga:
                    </span>{' '}
                    <span className="font-bold text-green-600">
                      Rp {product.price.toLocaleString()}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-gray-800">
                      Stok:
                    </span>{' '}
                    {product.stock}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Ubah
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
