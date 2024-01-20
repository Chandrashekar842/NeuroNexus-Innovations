import express from 'express'

import { getLogin, postLogin, postLogOut, getSignUp, postSignUp, getReset, postReset, getNewPassword, postNewPassword } from '../controllers/auth.js'

const authrouter = express.Router()

authrouter.get('/login', getLogin)

authrouter.post('/login', postLogin)

authrouter.post('/logout', postLogOut)

authrouter.get('/signup', getSignUp)

authrouter.post('/signup', postSignUp)

authrouter.get('/reset', getReset)

authrouter.post('/reset', postReset)

authrouter.get('/reset/:token', getNewPassword)

authrouter.post('/new-password', postNewPassword)

export default authrouter