'use strict'

import http from 'http'
import express from 'express'
import path from 'path'
import session from 'express-session'
import morgan from 'morgan'
import methodOverride from 'method-override'
import errorHandler from 'errorhandler'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import config from './config/config.js'
import helmet from 'helmet'
import mongoose from 'mongoose'
import passport from 'passport'
import { authenticate } from './src/account'

// import ws from 'ws'

authenticate(passport)

var app = express()

app.use(helmet())
app.set('trust proxy', true)

// mongoose connection
const dbURI = encodeURI(config.database.mongodb.connect)

const options = {
  user: config.database.mongodb.user,
  pass: config.database.mongodb.pass,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}

mongoose.connect(dbURI, options)
mongoose.set('useCreateIndex', true)
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI)
})

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
})

// mongoose.set('debug', true)

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

var sessionParser = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2592000000 }
})
app.use(sessionParser)
global.sessionParser = sessionParser

app.use(compression())
// all environments

app.set('views', path.join(__dirname, 'views'))

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')

app.set('port', process.env.PORT || config.app.port)

app.use(morgan('dev'))
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler())
}

app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  return res.status(404).render('404')
})

const server = http.createServer(app)

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
// const wss = new ws.Server({ server: server })

// global.wss = wss

// require('./src/back/socket')

module.exports.app = app
