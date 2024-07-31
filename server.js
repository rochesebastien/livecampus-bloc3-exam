const express = require('express')
const bodyParser = require('body-parser')
const booksrouter = require('./router/books')
const usersRouter = require('./router/users')
const empruntsRouter = require('./router/emprunts')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 3000
const db = require('./services/database')
const helmet = require('helmet')

const JWT_SECRET = "HelloThereImObiWan"
function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (!token) return res.sendStatus(401)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}

const app = express()

// middleware
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(cookieParser())

// rooter
app.use('/api/books',booksrouter)
app.use('/api/users',usersRouter)
app.use('/api/emprunts', empruntsRouter)

// helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "script-src": ["'self'", "http://localhost:5173"],
            },
        },
    }),
);

app.post('/api/logout', (req, res) => {
    req.session.destroy()
    res.json({ message: 'Déconnexion réussie' })
});

app.get('/api/session', authenticateToken,(req, res) => {
    if (req?.user) {
        res.json({ user: req.user })
    } else {
        res.status(401).json({ message: 'Non authentifié' })
    }
})
app.get('/api/statistics', (req, res) => {
    const totalBooksQuery = 'SELECT COUNT(*) AS total_books FROM livres'
    const totalUsersQuery = 'SELECT COUNT(*) AS total_users FROM utilisateurs'

    db.query(totalBooksQuery, (err, booksResult) => {
        if (err) throw err
        db.query(totalUsersQuery, (err, usersResult) => {
            if (err) throw err
            res.json({
                total_books: booksResult[0].total_books,
                total_users: usersResult[0].total_users
            })
        })
    })
})

// app.use(express.static(path.join(__dirname, "./webpub")))
// .get("*", (_, res) => {
//     res.sendFile(
//       path.join(__dirname, "./webpub/index.html")
//     )
// })

app.listen(PORT, () => {
    console.info(`Serveur démarré sur le port ${PORT}`)
})

module.exports = app;