import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import pool from '../db.js'

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const name = profile.displayName
        const photo_url = profile.photos[0].value

        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if (user.rows.length === 0) {
          const newUser = await pool.query(
            `INSERT INTO users (name, email, photo_url)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, email, photo_url]
          )
          return done(null, newUser.rows[0])
        } else {
          return done(null, user.rows[0])
        }
      } catch (err) {
        return done(err, false)
      }
    }
  )
)
