import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { q, type } = req.query
  const searchTerm = `%${q?.toLowerCase() || ''}%`

  try {
    let result

    if (type === 'title') {
      result = await pool.query(
        'SELECT *, \'title\' AS match_type FROM movies WHERE LOWER(title) LIKE $1',
        [searchTerm]
      )
    } else if (type === 'summary') {
      result = await pool.query(
        'SELECT *, \'summary\' AS match_type FROM movies WHERE LOWER(summary) LIKE $1',
        [searchTerm]
      )
    } else if (type === 'actor') {
      result = await pool.query(
        `
        SELECT DISTINCT m.*, 'actor' AS match_type
        FROM movies m
        JOIN movie_actors ma ON m.id = ma.movie_id
        JOIN actors a ON a.id = ma.actor_id
        WHERE LOWER(a.name) LIKE $1
        `,
        [searchTerm]
      )
    } else {
      result = await pool.query(
        `
        SELECT DISTINCT m.*,
          CASE
            WHEN LOWER(m.title) LIKE $1 THEN 'title'
            WHEN LOWER(m.summary) LIKE $1 THEN 'summary'
            WHEN LOWER(a.name) LIKE $1 THEN 'actor'
            ELSE 'unknown'
          END AS match_type
        FROM movies m
        LEFT JOIN movie_actors ma ON m.id = ma.movie_id
        LEFT JOIN actors a ON a.id = ma.actor_id
        WHERE LOWER(m.title) LIKE $1 
           OR LOWER(m.summary) LIKE $1 
           OR LOWER(a.name) LIKE $1
        `,
        [searchTerm]
      )
    }

    res.json(result.rows)
  } catch (err) {
    console.error('Veritabanı hatası:', err)
    res.status(500).json({ error: 'Veritabanı hatası' })
  }
})

export default router
