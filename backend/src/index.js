import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'

dotenv.config()

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

app.use(
  session({
    secret: 'some-secret-key',
    resave: false,
    saveUninitialized: false
  })
)

import './config/passport.js'
app.use(passport.initialize())
app.use(passport.session()) 

import authRoutes from './routes/authRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import userRoutes from './routes/userRoutes.js'
import googleAuthRoutes from './routes/googleAuthRoutes.js'
import movieSearchRoutes from './routes/movieSearchRoutes.js'
import watchlistRoutes from './routes/watchlistRoutes.js'
import reviewRoutes from './routes/reviews.js'


app.use('/api/watchlist', watchlistRoutes)
app.use('/api/movies/search', movieSearchRoutes) 
app.use('/api/auth', authRoutes)
app.use('/api/auth', googleAuthRoutes) 
app.use('/api/movies', movieRoutes)
app.use('/api/users', userRoutes)

app.use('/uploads', express.static('uploads'))
app.use('/api/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running...')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
