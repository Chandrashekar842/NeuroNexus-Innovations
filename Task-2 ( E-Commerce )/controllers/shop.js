import { Product } from '../models/product.js'
import { Order } from '../models/order.js'

export const displayProducts = (req, res, next) => {
    Product.find()
        .then(products => {
             res.render('shop/product-list', { 
                prods: products, 
                pageTitle: "Products", 
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
        })
    })
}

export const moreProducts = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', { 
            prods: products, 
            pageTitle: "Shop", 
            path: "/",
            isAuthenticated: req.session.isLoggedIn
        })
    })
}

export const getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail', { 
            prod: product, 
            pageTitle: product.title, 
            path: "/products",
            isAuthenticated: req.session.isLoggedIn
         })
        console.log(product)
    })
}

export const postCart = (req, res, next) => {
    const prodId = req.body.productId
    return Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

export const getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            let total = 0;
            products.map(product => {
                let cost = product.quantity * product.productId.price;
                total = total + cost;
            })
            res.render('shop/cart', { 
                path: '/cart', 
                pageTitle: 'Your Cart', 
                products: products, 
                total: total,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

export const postDeleteCartProduct = (req, res, next) => {
    const productId = req.body.productId
    
    req.user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

export const postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return {
                    product: { ...item.productId._doc },
                    quantity: item.quantity
                }
            })
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            return order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}

export const getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle:'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}