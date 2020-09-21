const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
// const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys')

// const MONGODB_URI = `mongodb+srv://Goodwin:WzC6KbiyKNiUemAa@cluster0.bylt1.mongodb.net/shop`
const app = express()


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars),
    helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})
// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     extname: 'hbs',
//     // handlebars: allowInsecurePrototypeAccess(Handlebars),
//     // helpers: require('./utils/hbs-helpers')
// })


// app.engine('handlebars', handlebars.engine, exphbs ({
//     handlebars: allowInsecurePrototypeAccess(Handlebars)
// }))

app.engine('hbs', hbs.engine)

app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('5f59fc3ae1ef551ba04e7ccd')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//     }
// })

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler)

//MongoDB password
// const password = 'WzC6KbiyKNiUemAa'
// const url = `mongodb+srv://Goodwin:WzC6KbiyKNiUemAa@cluster0.bylt1.mongodb.net/<dbname>?retryWrites=true&w=majority`

// app.get('/add', (req, res) => {
//     res.render('add', {
//         title: 'Добавить курс',
//         isAss: true
//     })
// })

// app.get('/courses', (req, res) => {
//     res.render('courses', {
//         title: 'Курсы',
//         isCourses: true
//     })
// })



const PORT = process.env.PORT || 3000

async function start() {
    try {
        // const url = `mongodb+srv://Goodwin:WzC6KbiyKNiUemAa@cluster0.bylt1.mongodb.net/shop`
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        // const candidate = await User.findOne()
        // if(!candidate) {
        //     const user = new User({
        //         email: 'username@gmail.com',
        //         name: 'Username',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}
start()

// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`)
// })