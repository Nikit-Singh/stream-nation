if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://stream:asdfg123@ds115613.mlab.com:15613/stream-nation' }

} else {
    module.exports = { mongoURI: 'mongodb://localhost/stream-nation' }
}