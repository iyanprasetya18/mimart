const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true
    }
  })

  res.json(products)
}

exports.createProduct = async (req, res) => {
  const product = await prisma.product.create({
    data: req.body
  })

  res.json(product)
}

exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id)

  const exists = await prisma.product.findUnique({ where: { id } })
  if (!exists) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' })
  }

  const { id: _bodyId, ...raw } = req.body

  const product = await prisma.product.update({
    where: { id },
    data: {
      description: raw.description,
      price: Number(raw.price),
      stock: Number(raw.stock),
      image: raw.image,
      categoryId: Number(raw.categoryId)
    }
  })

  res.json(product)
}

exports.deleteProduct = async (req, res) => {
  await prisma.product.delete({
    where: {
      id: Number(req.params.id)
    }
  })

  res.json({ message: 'Deleted' })
}