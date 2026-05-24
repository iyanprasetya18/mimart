const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' }
  })

  res.json(categories)
}

exports.getCategoryById = async (req, res) => {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  if (!category) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' })
  }

  res.json(category)
}

exports.createCategory = async (req, res) => {
  const category = await prisma.category.create({
    data: req.body
  })

  res.json(category)
}

exports.updateCategory = async (req, res) => {
  const id = Number(req.params.id)

  const exists = await prisma.category.findUnique({ where: { id } })
  if (!exists) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' })
  }

  const { id: _bodyId, ...data } = req.body

  const category = await prisma.category.update({
    where: { id },
    data
  })

  res.json(category)
}

exports.deleteCategory = async (req, res) => {
  const id = Number(req.params.id)

  const exists = await prisma.category.findUnique({ where: { id } })
  if (!exists) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan' })
  }

  await prisma.category.delete({
    where: { id }
  })

  res.json({ message: 'Deleted' })
}
