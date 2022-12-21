const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {     // to allow Postman and other desktop apps to access the app
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200   // 204-success official code can cause some problems with the success callback in OLDER browsers
}

module.exports = corsOptions