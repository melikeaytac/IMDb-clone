import express from 'express'
import pool from '../db.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' })
  }

  try {
    const decoded = jwt.verify(token, 'secretkey') 
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id])
    const user = result.rows[0]

    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' })

    delete user.password_hash 
    res.json(user)
  } catch (err) {
    console.error('Token çözümleme hatası:', err)
    res.status(401).json({ error: 'Geçersiz token' })
  }
})

export default router
