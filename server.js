const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes); // Public routes (e.g., login, register)
app.use('/api/protected', protectedRoutes); 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Server is running');
});
 
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log stack trace for debugging
  res.status(500).json({ message: 'Internal server error' });
});
