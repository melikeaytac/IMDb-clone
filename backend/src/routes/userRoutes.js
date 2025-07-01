import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    const user = result.rows[0]

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' })
    }

    delete user.password_hash
    res.json(user)
  } catch (err) {
    console.error('Kullanıcı bilgileri alınırken hata:', err)
    res.status(500).json({ error: 'Sunucu hatası' })
  }
})

export default router
