// module.exports = {
//     MONGODB_URI: 'mongodb+srv://Goodwin:WzC6KbiyKNiUemAa@cluster0.bylt1.mongodb.net/shop',
//     SESSION_SECRET: 'some secret value',
//     SENDGRID_API_KEY: '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',
//     EMAIL_FROM: 'redrickreed@gmail.com',
//     BASE_URL: 'http://localhost:3000'
// }

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}