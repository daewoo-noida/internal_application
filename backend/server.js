const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
// const pdfRoutes = require('./routes/pdf')
const path = require('path');
const fileRoutes = require("./routes/files");

const app = express();

// app.use('/pdfs', express.static('./uploads/franchisePdf'));


app.use(cors());
app.use(express.json());



// DB Connect
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/files', express.static(path.join(__dirname, 'uploads', 'files')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes);

// app.use('/api/pdf', pdfRoutes)

app.use("/api/files", fileRoutes);


app.use(
    '/pdfs',
    express.static(path.join(__dirname, 'uploads', 'franchisePdf'))
);

app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
