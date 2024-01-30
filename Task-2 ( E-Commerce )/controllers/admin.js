import { validationResult } from "express-validator"
import { Product } from '../models/product.js'

export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add-Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasErrors: false,
    errorMessage: null
  })
}

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add-Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      hasErrors: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      }
    })
  }
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products')
    })
    .catch(err => {
      res.redirect('/500')
    });
};

export const productsForAdmin = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
}

export const getEditProduct = (req, res, next) => {
  const edit = req.query.edit
  if (!edit) {
    res.redirect('admin/products')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        product: product,
        pageTitle: 'Edit product',
        path: '/admin/products',
        editing: true,
        isAuthenticated: req.session.isLoggedIn,
        hasErrors: false,
        errorMessage: null 
      })
    })
}

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit-Product',
      path: '/admin/edit-product',
      editing: true,
      isAuthenticated: req.session.isLoggedIn,
      hasErrors: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      }
    })
  }
  Product.findById(prodId).then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/admin/products')
    }
    product.title = updatedTitle,
      product.imageUrl = updatedImageUrl,
      product.price = updatedPrice,
      product.description = updatedDescription
    return product.save()
      .then(result => {
        console.log('Updated Product')
        res.redirect('/admin/products')
      })
  })
    .catch(err => console.log(err))
}

export const deleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}



