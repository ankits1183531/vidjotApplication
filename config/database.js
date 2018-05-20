if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://username:password@ds047911.mlab.com:47911/vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}