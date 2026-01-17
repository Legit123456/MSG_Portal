import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import recruitRoutes from './routes/recruitRoutes.js'; 

dotenv.config();
const app = express();

// 1. ALLOW EVERYTHING (The Fix)
app.use(cors({
    origin: [
        "http://localhost:5176", 
        "http://localhost:5177",
        "https://msg-portal-delta.vercel.app/", // REPLACE WITH REAL VERCEL URL
        "https://msg-portal-3cqi.vercel.app/"   // REPLACE WITH REAL VERCEL URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// 2. PARSE JSON
app.use(express.json());

// 3. DEBUG LOGGER (The Tracer)
// This will print every request to the terminal
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Routes
// URL becomes: http://localhost:5000/api/recruit/register
app.use('/api/recruit', recruitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));