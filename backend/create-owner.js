const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      name: 'Owner',
      email: 'admin@gmail.com',
      password,
      role: 'OWNER'
    }
  })

  console.log('Owner created')
}

main()