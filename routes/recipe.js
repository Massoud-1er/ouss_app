import express from 'express'
import { create } from '../src/recipe/create'
import * as validate from './middleware/validation'

const router = express.Router()

router.post('/', (req, res, next) => {
  req.body = {
    // name: 'test_middleware',
    ingredients: ['tomate', 'jus de couille'],
    data: {
      '1-2': { steps: ['trempé le jus de couille', 'chier'], doses: ['un peu', 'bcp'], duration: 12 },
      '4-6': { steps: ['trempé le jus de couille 4-6', 'chier partout'], doses: ['un peu', 'bcp'], duration: 24 },
      '+8': { steps: ['steps +8', 'caca'], doses: ['un peu', 'bcp'], duration: 32 }
    }
  }
  next()
}, validate.body, create)

export default router
