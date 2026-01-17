import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import recruitRoutes from './routes/recruitRoutes.js'; 

dotenv.config();
const app = express();

// 1. INCREASE DATA LIMITS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. UNIVERSAL CORS (The Fix)
// We remove the strict list. This allows Vercel, Localhost, Mobile, anything.
app.use(cors({
    origin: function (origin, callback) {
        // Return "true" for everyone. 
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// 3. LOGGING
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Routes
app.use('/api/recruit', recruitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));