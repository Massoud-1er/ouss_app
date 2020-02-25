import * as Joi from '@hapi/joi'

export const body = Joi.object({
  name: Joi.string().max(64).min(4).required(),
  ingredients: Joi.array().items(Joi.string()),
  data: Joi.object({
    '1-2': Joi.object({
      steps: Joi.array().items(Joi.string().max(2048)),
      doses: Joi.array().items(Joi.string().max(2048)),
      duration: Joi.number()
    }),
    '4-6': Joi.object({
      steps: Joi.array().items(Joi.string().max(2048)),
      doses: Joi.array().items(Joi.string().max(2048)),
      duration: Joi.number()
    }),
    '6-8': Joi.object({
      steps: Joi.array().items(Joi.string().max(2048)),
      doses: Joi.array().items(Joi.string().max(2048)),
      duration: Joi.number()
    }),
    '+8': Joi.object({
      steps: Joi.array().items(Joi.string().max(2048)),
      doses: Joi.array().items(Joi.string().max(2048)),
      duration: Joi.number()
    })
  })
})
