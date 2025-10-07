const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Validate environment variables
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file');
  process.exit(1);
}

// Hash the admin password from .env during server startup
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email matches
  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Invalid email' });
  }

  // Compare provided password with hashed password
  const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { login };