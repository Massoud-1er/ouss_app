import express from 'express'
import { register, login, logout } from '../src/account'

const router = express.Router()

router.get('/', (req, res) => { res.send('hello ouss') })

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

export default router
