import { User } from "../models/user.js"
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "info.easybuycart@gmail.com",
      pass: "xtsy rsax aoln ywfp"
    },
  });

//   async function main() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: 'info.easybuycart.com', // sender address
//       to: "email", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });

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
                    return transporter.sendMail({
                              from: 'info.easybuycart@gmail.com', // sender address
                              to: email, // list of receivers
                              subject: "SignUp Confirmation ✔", // Subject line
                              html: "<b>You Successfully signed In. Happy Shopping</b>", // html body
                            });
                })
                .catch(err => console.log(err))

        })

        .catch(err => console.log(err))
}