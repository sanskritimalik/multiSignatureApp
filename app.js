const { bodyParser, app, port } = require('./config.js');
const processesRoutes = require('./routes/process.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.use('/processes', processesRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// const nodemailer = require('nodemailer');

// const testTLSVersion = async (tlsVersion) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.example.com',
//     port: 587,
//     secure: false, // If you need SSL/TLS, set it to true
//     requireTLS: true,
//     tls: {
//       ciphers: tlsVersion,
//     },
//     auth: {
//       user: 'your_email@example.com',
//       pass: 'your_email_password',
//     },
//   });

//   try {
//     const info = await transporter.sendMail({
//       from: 'your_email@example.com',
//       to: 'recipient@example.com',
//       subject: 'Test Email',
//       text: 'This is a test email.',
//     });

//     console.log('Email sent:', info.response);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// // Test different TLS versions
// testTLSVersion('TLSv1.2');
// testTLSVersion('TLSv1.1');
// testTLSVersion('TLSv1.0');

// Secret key for JWT
// const jwtSecret = 'your_jwt_secret';

// Middleware to authenticate requests
// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ error: 'Authentication token not found' });
//   }

//   // Check if the token starts with 'Bearer '
//   if (!token.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Invalid token format' });
//   }

//   const accessToken = token.substring(7); // Remove 'Bearer ' prefix

//   jwt.verify(accessToken, jwtSecret, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }

//     req.user = user;
//     next();
//   });
// }

// //Login API
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//     client.release();

//     if (result.rowCount === 0) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const user = result.rows[0];

//     const passwordMatch = await bcrypt.compare(password, user.password_hash);

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Generate and send JWT token
//     const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'An unexpected error occurred' });
//   }
// });


// app.post('/register', async (req, res) => {
//     const { name, email, password, walletAddress } = req.body;
//     try {
//       // Check if the email is already taken
//       const client = await pool.connect();
//       const emailExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//       if (emailExists.rowCount > 0) {
//         client.release();
//         return res.status(400).json({ error: 'Email already in use' });
//       }
  
//       // Hash the password
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
  
//       // Insert the user into the database
//       const insertQuery =
//         'INSERT INTO users (name, email, password_hash, wallet_address) VALUES ($1, $2, $3, $4) RETURNING *';
//       const values = [name, email, hashedPassword, walletAddress];
  
//       const result = await client.query(insertQuery, values);
//       client.release();
  
//       const newUser = result.rows[0];
  
//       // Generate and send JWT token
//       const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '1h' });
//       res.json({ token });
//     } catch (error) {
//       console.error('Error during registration:', error);
//       res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   });

// // Backend API to fetch a list of users
// app.get('/users', authenticateToken, async (req, res) => {
//     try {
//       const client = await pool.connect();
  
//       const usersResult = await client.query('SELECT id, name FROM users');
//       const users = usersResult.rows;
  
//       client.release();
  
//       res.json(users);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   });
  

// // Backend API for creating a new process 
// app.post('/processes', authenticateToken, async (req, res) => {
//     const { title, signatories, commentsVisibleTo} = req.body;
//     console.log("body",req.body);
//     console.log("userId", req.user.userId);
//     // Ensure the creator is one of the signatories
//     if (signatories.includes(req.user.userId)) {
//       return res.status(400).json({ error: 'Process creator must not be one of the signatories' });
//     }
  
//     try {
//       const client = await pool.connect();
  
//       // Insert the new process into the database
//       const insertProcessQuery = 'INSERT INTO processes (title, creator_id, signatories, comments_visible_to) VALUES ($1, $2, $3, $4) RETURNING *';
//       const processValues = [title, req.user.userId, signatories, commentsVisibleTo];
//       const processResult = await client.query(insertProcessQuery, processValues);
//       const newProcess = processResult.rows[0];
  
//       client.release();
  
//       res.status(201).json({ message: 'Process created successfully', process: newProcess });
//       for (signatory in signatories) {
//       sendEmailNotification(req.user.email, signatory, "New process created", "A new process has been created which requires your sign off" );
//       }
//     } catch (error) {
//       console.error('Error creating process:', error);
//       res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   });

//   // Backend API for signing off on a process
// app.post('/processes/:processId/sign-off', authenticateToken, async (req, res) => {
//     const { processId } = req.params;
//     const { comment, picture } = req.body;
//     try {
//       const client = await pool.connect();
  
//       // Check if the user is a signatory of the process
//       const processResult = await client.query('SELECT * FROM processes WHERE id = $1 AND $2 = ANY(signatories)', [processId, req.user.userId]);
//       if (processResult.rowCount === 0) {
//         client.release();
//         return res.status(403).json({ error: 'You are not authorized to sign-off on this process' });
//       }
//       const signatories = processResult.rows[0].signatories

//       // Check if the user has already signed the process
//       const preSignedUser = await client.query('SELECT id from process_signatures where process_id = $1 AND user_id = $2', [processId, req.user.userId]);
//       if (preSignedUser.rowCount != 0) {
//         client.release();
//         return res.status(409).json({error: 'You have already signed off this process'});
//       }

//       // Save the uploaded picture if provided
//       let picturePath = null;
//       if (picture) {
//         const storage = multer.diskStorage({
//           destination: (req, file, cb) => {
//             cb(null, 'uploads/');
//           },
//           filename: (req, file, cb) => {
//             const fileName = Date.now() + '-' + file.originalname;
//             cb(null, fileName);
//           },
//         });
  
//         const upload = multer({ storage }).single('picture');
  
//         upload(req, res, (err) => {
//           if (err) {
//             console.error('Error uploading picture:', err);
//             return res.status(500).json({ error: 'An error occurred while uploading the picture' });
//           }
  
//           if (req.file) {
//             picturePath = req.file.path;
//           }
//         });
//       }
  
//       // Insert the signature into the database
//       const insertSignatureQuery = 'INSERT INTO process_signatures (process_id, user_id, comment, picture_path) VALUES ($1, $2, $3, $4) RETURNING *';
//       const signatureValues = [processId, req.user.userId, comment, picturePath];
//       const signatureResult = await client.query(insertSignatureQuery, signatureValues);
//       const newSignature = signatureResult.rows[0];
     
//       // Notify creator on each successful sign-off
//       const process = processResult.rows[0];
//       processCreatorId = process.creator_id;
//       getProcessCreatorDetails = await client.query('SELECT email from users where user_id = $1',[process.creator_id]);
//       processCreatorEmail = getProcessCreatorDetails.rows[0];

//       sendEmailNotification(req.user.email, processCreatorEmail, 'User x has signed for process p1', '');

//       // In case all the signatories have signed off, notify all users involved via mail
//       const processSignatures = await client.query('SELECT id from process_signatures where process_id = $1', [processId])
//       if (processSignatures.rowCount === signatureRequired){
//         sendBulkEmailNotifications(req.user.email, [signatories, processCreatorEmail], 'All users have signed process p1', '');
//       }

//       client.release();
//       res.status(201).json({ message: 'Sign-off successful', signature: newSignature });

//     } catch (error) {
//       console.error('Error signing off:', error);
//       res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   });
  
//   // Backend API to get process details with signatures
// app.get('/processes/:processId', authenticateToken, async (req, res) => {
//     const { processId } = req.params;
//     try {
//       const client = await pool.connect();
  
//       // Get the process details
//       const processResult = await client.query('SELECT * FROM processes WHERE id = $1', [processId]);
//       if (processResult.rowCount === 0) {
//         client.release();
//         return res.status(404).json({ error: 'Process not found' });
//       }
  
//       const process = processResult.rows[0];
     
//       // Check if the user is authorized to view the comments
//       if (process.comments_visible_to != null || !process.comments_visible_to.includes(req.user.userId)) {
//         return res.status(403).json({ error: 'You are not authorized to view the comments for this process' });
//       }
  
//       // Get the signatures for the process
//       const signaturesResult = await client.query('SELECT * FROM process_signatures WHERE process_id = $1', [processId]);
//       const signatures = signaturesResult.rows;
  
//       client.release();
  
//       res.json({ process, signatures });
//     } catch (error) {
//       console.error('Error getting process details:', error);
//       res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   });

// Function to send email notification
// function sendEmailNotification(fromEmail, toEmail, subject, content) {
//     const mailOptions = {
//       from: fromEmail,
//       to: toEmail,
//       subject: subject,
//       text: content,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email notification:', error);
//       } else {
//         console.log('Email notification sent:', info.response);
//       }
//     });
//   }

//   function sendBulkEmailNotifications(fromEmail, toEmails, subject, content) {
//     for(let toEmail in toEmails){
//         sendEmailNotification(fromEmail, toEmail, subject, content);
//     }
//   }
  
  