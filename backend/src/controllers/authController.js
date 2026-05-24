const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(400).json({ message: 'Wrong password' })
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET
  )

  res.json({ token, user })
}