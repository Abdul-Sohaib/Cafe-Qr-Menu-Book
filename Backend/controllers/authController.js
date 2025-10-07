const jwt = require('jsonwebtoken');

// Validate environment variables
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file');
  process.exit(1);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const login = async (req, res) => {
  const { email, password } = req.body;

  // Debug logs (remove after testing)
  console.log('Login attempt:');
  console.log('Received email:', email);
  console.log('Expected email:', ADMIN_EMAIL);
  console.log('Passwords match:', password === ADMIN_PASSWORD);

  // Check if email matches
  if (email !== ADMIN_EMAIL) {
    console.log('Email mismatch');
    return res.status(401).json({ message: 'Invalid email' });
  }

  // Compare provided password directly
  if (password !== ADMIN_PASSWORD) {
    console.log('Password mismatch');
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Login successful');
  res.json({ token });
};

module.exports = { login };