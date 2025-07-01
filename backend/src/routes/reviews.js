import express from 'express'
const router = express.Router()
import db from '../db.js'
import authenticate from '../middleware/auth.js'

// Yorum ekle
router.post('/', authenticate, async (req, res) => {
  const { movie_id, rating, comment } = req.body
  const user_id = req.user?.id

  if (!movie_id || !rating || !user_id) {
    return res.status(400).json({ error: 'Eksik veri gönderildi' })
  }

  try {
    await db.query(
      `INSERT INTO movie_reviews (user_id, movie_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [user_id, movie_id, rating, comment]
    )

    res.status(201).json({ message: 'Yorum eklendi!' })
  } catch (err) {
    console.error('Yorum ekleme hatası:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

// Yorumları getir
router.get('/:movieId', async (req, res) => {
  const movie_id = parseInt(req.params.movieId)

  try {
    const result = await db.query(
      `SELECT r.*, u.name, u.country
       FROM movie_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.movie_id = $1
       ORDER BY r.created_at DESC`,
      [movie_id]
    )

    res.json(result.rows)
  } catch (err) {
    console.error('Yorum çekme hatası:', err)
    res.status(500).json({ error: 'Yorumlar getirilemedi' })
  }
})

export default router
