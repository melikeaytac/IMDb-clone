import jwt from 'jsonwebtoken'


export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkilendirme gerekiyor (token eksik).' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded 
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token.' })
  }
}
