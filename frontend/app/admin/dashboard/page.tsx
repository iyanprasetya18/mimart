'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import api from '@/services/api'

type Order = {
  id: number
  orderCode: string
  customerName: string
  total: number
  orderStatus: string
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await api.get<Order[]>('/orders')
    setOrders(res.data)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Dashboard Owner
        </h1>

        <Link
          href="/admin/products"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Kelola Produk
        </Link>

        <Link
          href="/admin/categories"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          Kelola Kategori
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Order</h2>
          <p className="text-3xl font-bold mt-2">
            {orders.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Status</h2>
          <p className="text-xl font-bold mt-2 text-green-600">
            System Active
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Role</h2>
          <p className="text-xl font-bold mt-2">
            OWNER
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-2xl font-bold mb-5">
          Daftar Order
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {order.orderCode}
                  </h3>

                  <p>{order.customerName}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    Rp {order.total.toLocaleString()}
                  </p>

                  <p>{order.orderStatus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}