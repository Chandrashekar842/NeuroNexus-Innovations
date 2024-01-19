import { User } from "../models/user.js"
import bcrypt from 'bcryptjs'

export const getLogin = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message
    })
}

export const postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid Email')
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        req.session.isLoggedIn = true
                        req.session.user = user
                        return req.session.save((err) => {
                            console.log(err)
                            res.redirect('/')
                        })
                    } else {
                        req.flash('error', 'Invalid Password')
                        res.redirect('/login')
                    }
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))
}

export const postLogOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

export const getSignUp = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message
    })
}

export const postSignUp = (req, res, next) => {
    const { email, password, confirmpassword } = req.body
    User.findOne({ email: email })
        .then(userdoc => {
            if (userdoc) {
                req.flash('error', 'Email already registered!')
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(() => {
                    res.redirect('/login')
                })
        })

        .catch(err => console.log(err))
}