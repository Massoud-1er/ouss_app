import express from 'express'
import account from './account'
import recipe from './recipe'
const router = express.Router()

router.get('/', (req, res) => { res.render('chat', { message: 'hello ouss' }) })

router.use('/account', account)
router.use('/recipe', recipe)

export default router
