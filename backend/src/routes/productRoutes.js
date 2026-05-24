const router = require('express').Router()

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

router.get('/', getProducts)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router