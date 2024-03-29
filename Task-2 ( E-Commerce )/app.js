import express from 'express'
import bodyParser from 'body-parser'
import adminrouter from './routes/admin.js'
import shoprouter from './routes/shop.js'
import authrouter from './routes/auth.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { error, pageNotFound } from './controllers/error.js'
import { User } from './models/user.js'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongoDbSession from 'connect-mongodb-session'
import csrf from 'csurf'
import flash from 'connect-flash'

const app = express()

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(dirname, 'public')))

const MongoDBStore = connectMongoDbSession(session)
const store = new MongoDBStore({
   uri: 'mongodb+srv://Chandu21:Chandu21@cluster0.0sbmxs4.mongodb.net/shop',
   collection: 'sessions'
})

app.use(session({secret: 'My secret', resave: false, saveUninitialized: false, store: store}))

app.use((req, res, next) => {
   if(!req.session.user) {
      return next()
   }
   User.findById(req.session.user._id)
      .then(user => {
         if(!user) {
            return next()
         }
         req.user = user
         next()
      })
      .catch(err => {
         throw new Error(err)
      })
})

app.use(flash())

app.use('/admin', adminrouter)
app.use(shoprouter)
app.use(authrouter)

app.get('/500', error)
app.use(pageNotFound)

mongoose.connect('mongodb+srv://Chandu21:Chandu21@cluster0.0sbmxs4.mongodb.net/shop?retryWrites=true&w=majority')
      .then(result => {
         app.listen(3000, () => {
            console.log('Connected to Database using Mongoose')
         })
      })
      .catch(err => console.log(err))





