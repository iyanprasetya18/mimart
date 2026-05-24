'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/services/api'

type Category = {
  id: number
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const fetchCategories = async () => {
    const res = await api.get<Category[]>('/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      alert('Isi nama kategori')
      return
    }

    await api.post('/categories', { name: trimmed })
    alert('Kategori ditambahkan')
    setName('')
    fetchCategories()
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const saveEdit = async (id: number) => {
    const trimmed = editName.trim()
    if (!trimmed) {
      alert('Isi nama kategori')
      return
    }

    await api.put(`/categories/${id}`, { name: trimmed })
    alert('Kategori diperbarui')
    cancelEdit()
    fetchCategories()
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Hapus kategori ini?')) return

    try {
      await api.delete(`/categories/${id}`)
      alert('Kategori dihapus')
      fetchCategories()
    } catch {
      alert(
        'Gagal menghapus. Kategori mungkin masih dipakai oleh produk.'
      )
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Kelola Kategori
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
          Tambah Kategori
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nama kategori"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg flex-1"
          />

          <button
            type="button"
            onClick={createCategory}
            className="bg-black text-white px-5 py-3 rounded-lg shrink-0"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-2xl font-bold mb-5">
          Daftar Kategori
        </h2>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-gray-500">
              Belum ada kategori. Tambahkan di atas.
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-xl p-4"
              >
                {editingId === category.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-3 rounded-lg flex-1"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(category.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Simpan
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-200 px-4 py-2 rounded-lg"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-lg">
                      {category.name}
                    </p>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Ubah
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
