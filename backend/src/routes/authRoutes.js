import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  }
})
const upload = multer({ storage })

// register
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    let { name, email, password, country, city } = req.body
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null

    // boş alan
    if (!email || !password || !name || !country || !city) {
      return res.status(400).json({ error: 'Tüm alanları doldurunuz' })
    }

    // e posta kontrol
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' })
    }

    // şifre kontrol
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Şifre en az 8 karakter, 1 rakam ve 1 özel karakter içermelidir.'
      })
    }

    // kayıtlı mı kontrol
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı' })
    }

    // hasing
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, country, city, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, hashedPassword, country, city, photo_url]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Kayıt hatası:', err)
    res.status(500).json({ error: 'Sunucu hatası oluştu' })
  }
})


// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' })

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) return res.status(401).json({ error: 'Şifre hatalı' })

    const token = jwt.sign({ id: user.id, name: user.name }, 'secretkey', { expiresIn: '1d' })

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' })
  }
})


router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token yok' })

  try {
    const decoded = jwt.verify(token, 'secretkey')
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id])
    const user = result.rows[0]
    delete user.password_hash
    res.json(user)
  } catch (err) {
    console.error('Token çözümleme hatası:', err)
    res.status(401).json({ error: 'Geçersiz token' })
  }
})

export default router
