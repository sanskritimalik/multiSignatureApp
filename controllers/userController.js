const { pool } = require('../db');

const getUsers = async (req, res) => {
    try {
      const client = await pool.connect();
      const usersResult = await client.query('SELECT id, name FROM users');
      const users = usersResult.rows;
      client.release();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };

module.exports =  {
    getUsers,
};
