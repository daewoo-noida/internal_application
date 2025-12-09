const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const fileRoutes = require("./routes/files");
const reimbursementRoutes = require('./routes/reimbursement');
const notificationRoutes = require('./routes/notificationRoutes');

const path = require('path');

const app = express();

// -------------------- CORS FIX --------------------
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));



// -------------------- BODY LIMIT FIX --------------------
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


// DB connection
connectDB();

// -------------------- STATIC ROUTES --------------------
app.use('/files', express.static(path.join(__dirname, 'uploads', 'files')));
// app.use('/pdfs', express.static(path.join(__dirname, 'uploads', 'franchisePdf')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- API ROUTES --------------------
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/files", fileRoutes);
app.use('/api/reimbursement', reimbursementRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));