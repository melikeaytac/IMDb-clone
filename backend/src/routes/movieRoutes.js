import express from 'express'
import pool from '../db.js'

const router = express.Router()

//slider
router.get('/slider', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM movies
      ORDER BY created_at DESC
      LIMIT 10
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Slider film verileri alınamadı:', err)
    res.status(500).json({ error: 'Film verileri alınamadı' })
  }
})

router.get('/popular', async (req, res) => {
  try {
    const result = await pool.query(`
SELECT m.*, 
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id) AS comment_count,
  ROUND((
    (COALESCE(AVG(r.rating), 0) * 40) +
    (m.imdb_score * 40) +
    (COUNT(r.id) * 20)
  ), 2) AS popularity_score
FROM movies m
LEFT JOIN movie_reviews r ON m.id = r.movie_id
GROUP BY m.id
ORDER BY popularity_score DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Popüler filmler getirilemedi:', err)
    res.status(500).json({ error: 'Popüler filmler getirilemedi' })
  }
})


// listeleme
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Veritabanı hatası' })
  }
})

// id route
router.get('/:id', async (req, res) => {
  const movieId = parseInt(req.params.id) 
  if (isNaN(movieId)) return res.status(400).json({ error: 'Geçersiz ID' })

  try {
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Film bulunamadı' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Veritabanı hatası:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


router.get('/:id/actors', async (req, res) => {
  const movieId = parseInt(req.params.id)
  if (isNaN(movieId)) return res.status(400).json({ error: 'Geçersiz film ID' })

  try {
    
    const movieCheck = await pool.query('SELECT 1 FROM movies WHERE id = $1', [movieId])
    if (movieCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Film bulunamadı' })
    }

    
    const result = await pool.query(`
      SELECT a.id, a.name
      FROM movie_actors ma
      JOIN actors a ON ma.actor_id = a.id
      WHERE ma.movie_id = $1
    `, [movieId])

    res.json(result.rows)
  } catch (err) {
    console.error('Oyuncular getirilemedi:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})


export default router
