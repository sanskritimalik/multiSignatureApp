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