const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.createOrder = async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    items
  } = req.body

  let subtotal = 0

  items.forEach((item) => {
    subtotal += item.price * item.qty
  })

  const order = await prisma.order.create({
    data: {
      orderCode: `INV-${Date.now()}`,
      customerName,
      customerPhone,
      customerAddress,
      subtotal,
      total: subtotal,
      items: {
        create: items.map((item) => ({
          productId: item.id,
          qty: item.qty,
          price: item.price
        }))
      }
    },
    include: {
      items: true
    }
  })

  res.json(order)
}

exports.getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  res.json(orders)
}