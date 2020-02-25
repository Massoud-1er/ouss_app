import bcrypt from 'bcryptjs'
import passport from 'passport'
import { User } from './schema/user'

const LocalStrategy = require('passport-local').Strategy

const strategy = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}

export function authenticate (passport) {
  passport.use('local-login',
    new LocalStrategy(strategy, async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email }).select('-created -__v').lean()
        if (!user) return done(null, false, { error: 'this email does not exist, register first' })
        else if (!user.enabled) return done(null, false, { error: 'please confirm your email first' })
        else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              delete user.password
              delete user.enabled
              req.session.user = user
              return done(null, user)
            } else if (err || !res) {
              return done(null, false, { error: 'email and password do not match' })
            }
          })
        }
      } catch (e) { return done(null, false, { error: e.message }) }
    })
  )

  passport.use('local-signup',
    new LocalStrategy(strategy, (req, email, password, done) => {
      if (req.body.confirmation !== password) {
        return done(null, false, { error: 'the passwords do not match' })
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) return done(null, false, { error: 'error crypting the password: ' + err.message })
        else {
          req.body.password = hash
          try {
            const user = await new User(req.body).save()
            return done(null, user)
          } catch (e) {
            if (e.code === 11000 || e.code === 11001) {
              return done(null, false, { error: 'this email is already used' })
            } else {
              return done(null, false, { error: e.message })
            }
          }
        }
      })
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}

export function register (req, res, next) {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) res.status(400).send({ error: 'passport error: ' + err.message })
    else if (user) res.status(200).send({ user: user })
    else res.status(200).send({ error: info.error })
  })(req, res, next)
}

export function login (req, res, next) {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) res.status(400).send({ error: 'passport error: ' + err.message })
    else if (user) res.status(200).send({ message: 'success', user: user })
    else res.status(200).send({ error: info.error })
  })(req, res, next)
}

export function logout (req, res) {
  if (req.isAuthenticated() && req.session) {
    req.session.destroy()
    res.status(200).send({ message: 'bye bye' })
  } else {
    res.status(200).send({ message: 'no session for this user' })
  }
}
