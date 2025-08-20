const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;  // đảm bảo có trong .env

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // gắn user info từ token vào request
    next();
  } catch (err) {
    console.error('Invalid Token:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
