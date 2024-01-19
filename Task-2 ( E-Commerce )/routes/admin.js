import express from 'express'
import { getAddProduct, postAddProduct, productsForAdmin, getEditProduct, postEditProduct, deleteProduct} from '../controllers/admin.js'
import { protectRoute } from '../middleware/is-Auth.js'

const adminrouter = express.Router()

adminrouter.get('/add-product',protectRoute, getAddProduct)

adminrouter.post('/add-product',protectRoute, postAddProduct)

adminrouter.get('/products', protectRoute, productsForAdmin)

adminrouter.get('/edit-product/:productId', protectRoute, getEditProduct)

adminrouter.post('/edit-product', protectRoute, postEditProduct)

adminrouter.post('/delete-product/:productId', protectRoute, deleteProduct)

export default adminrouter; 