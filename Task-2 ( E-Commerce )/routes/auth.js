import express from 'express'

import { getLogin, postLogin, postLogOut, getSignUp, postSignUp } from '../controllers/auth.js'

const authrouter = express.Router()

authrouter.get('/login', getLogin)

authrouter.post('/login', postLogin)

authrouter.post('/logout', postLogOut)

authrouter.get('/signup', getSignUp)

authrouter.post('/signup', postSignUp)

export default authrouter