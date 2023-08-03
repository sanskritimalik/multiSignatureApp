// controllers/authController.js

const { pool, jwtSecret} = require('../config.js');
const { compare, hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate and send JWT token
    const token = sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

const register = async (req, res) => {
  const { name, email, password, walletAddress } = req.body;
  try {
    // Check if the email is already taken
    const client = await pool.connect();
    const emailExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rowCount > 0) {
      client.release();
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // Insert the user into the database
    const insertQuery =
      'INSERT INTO users (name, email, password_hash, wallet_address) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, email, hashedPassword, walletAddress];

    const result = await client.query(insertQuery, values);
    client.release();

    const newUser = result.rows[0];

    // Generate and send JWT token
    const token = sign({ userId: newUser.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = {
  login,
  register,
};
