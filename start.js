require('@babel/register')({
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 Chrome versions']
      }
    }]
  ]
})

try {
  module.exports = require('./app.js')
} catch (e) {
  console.log(e)
}
