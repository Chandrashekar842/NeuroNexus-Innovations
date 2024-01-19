import express from 'express'
import { displayProducts, moreProducts, getProduct, postCart, getCart, postDeleteCartProduct, postOrder, getOrders } from '../controllers/shop.js'
import { protectRoute } from '../middleware/is-Auth.js';

const shoprouter = express.Router();

shoprouter.get('/', moreProducts)

shoprouter.get('/products', displayProducts)

shoprouter.get('/products/:productId', getProduct)

shoprouter.get('/cart', protectRoute, getCart)

shoprouter.post('/cart', protectRoute, postCart)

shoprouter.post('/delete-cart-item', protectRoute, postDeleteCartProduct)

shoprouter.post('/create-order', protectRoute, postOrder)

shoprouter.get('/orders', protectRoute, getOrders)

// shoprouter.get('/checkout', checkoutProducts)

export default shoprouter