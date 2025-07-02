import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Google'a yönlendir
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Callback geldiğinde buraya düşer
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false
  }),
  (req, res) => {
    const user = req.user

    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      photo_url: user.photo_url
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    // Query string ile frontend'e yönlendir
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`)
  }
)

export default router
