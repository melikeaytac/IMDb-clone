import express from 'express'
import pool from '../db.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return null
  try {
    const decoded = jwt.verify(token, 'secretkey')
    return decoded.id
  } catch {
    return null
  }
}

// Token doğrulama
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token yok' })

  try {
    const decoded = jwt.verify(token, 'secretkey')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Geçersiz token' })
  }
}


// watchliste ekle
router.post('/', async (req, res) => {
  const userId = getUserIdFromToken(req)
  const { movie_id } = req.body

  if (!userId) return res.status(401).json({ error: 'Yetkisiz erişim' })

  try {
    const check = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 AND movie_id = $2',
      [userId, movie_id]
    )
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Bu film zaten watchlistte' })
    }

    const result = await pool.query(
      'INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [userId, movie_id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Veritabanı hatası' })
  }
})

// watchlist getir
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: 'Yetkisiz erişim' })

  try {
    const result = await pool.query(
      `SELECT movies.*
       FROM watchlist
       JOIN movies ON watchlist.movie_id = movies.id
       WHERE watchlist.user_id = $1
       ORDER BY watchlist.created_at DESC`,
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Watchlist verileri getirilemedi' })
  }
})


export default router
