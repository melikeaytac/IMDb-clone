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
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
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
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`)
  }
)

router.get('/test', (req, res) => {
  res.send('Google Auth route çalışıyor 🎉')
})


export default router
