// config.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const nodemailer = require('nodemailer');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
const signatureRequired = 5;

// PostgreSQL configuration
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'multisig_db',
  password: '9457035873aA@',
  port: 5432,
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  // port: 587,
  service: 'gmail',
  auth: {
    user: 'mailmultisig@gmail.com',
    pass: 'hbzbohyrgolmxnyl',
  },
});

const fromEmail = 'mailmultisig@gmail.com';

// Secret key for JWT
const jwtSecret = 'your_jwt_secret';

module.exports = {
  bodyParser,
  app,
  port,
  signatureRequired,
  fromEmail,
  pool,
  transporter,
  jwtSecret,
  jwt,
};

