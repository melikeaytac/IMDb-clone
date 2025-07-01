import express from 'express'
import passport from 'passport'
import pkg from 'jsonwebtoken'
const { sign } = pkg

const router = express.Router()

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const user = req.user

    const token = sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        city: user.city,
        photo_url: user.photo_url,
      },
      'secretkey',
      { expiresIn: '1d' }
    )

    
    res.redirect(`http://localhost:5173/login?token=${token}`)
  }
)

export default router
