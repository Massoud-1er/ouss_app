import { body as JoiBody } from '../../src/joi/body'

// cleanBody function to clean request from iOS

function cleanBody (body) {
  for (const i in body) {
    if (body[i] === 'nil' || body[i] === '') {
      delete body[i]
    }
  }
}

function getPathWithoutParams (req) {
  for (const k in req.params) {
    if (req.params[k] === undefined) {
      delete req.params[k]
    }
  }
  const ret = req.originalUrl
  if (Object.entries(req.params).length > 0) {
    return ret.split(req.params[Object.keys(req.params)[0]])[0].slice(0, -1)
  } else {
    return ret[ret.length - 1] === '/' ? ret.slice(0, -1) : ret
  }
}

// export async function params (req, res, next) {
//   if (Object.entries(req.params).length === 0 && req.params.constructor === Object) {
//     return res.status(400).send({ error: 'empty params' })
//   }
//   const route = req.originalUrl.replace(req.path, '').split('?')[0]
//   try {
//     await JoiParams[route].validateAsync(req.params)
//     next()
//   } catch (e) {
//     res.status(400).send({ type: 'Wrong params', name: e.name, error: e.message })
//   }
// }

export async function body (req, res, next) {
  if (res.locals.fields && Object.entries(res.locals.fields).length > 0) {
    req.body = res.locals.fields
  }
  if (Object.entries(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).send({ error: 'empty body' })
  }
  cleanBody(req.body)
  const route = getPathWithoutParams(req)
  try {
    await JoiBody[route].validateAsync(req.body, { $context: { type: req.method } })
    next()
  } catch (e) {
    return res.status(400).send({ type: 'Wrong body', name: e.name, error: e.message })
  }
}

// export async function query (req, res, next) {
//   if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
//     return res.status(400).send({ error: 'empty query' })
//   }
//   try {
//     await JoiQuery[req.originalUrl].validateAsync(req.query)
//     next()
//   } catch (e) {
//     return res.status(400).send({ type: 'Wrong query', name: e.name, error: e.message })
//   }
// }
