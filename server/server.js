import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import recruitRoutes from './routes/recruitRoutes.js'; 

dotenv.config();
const app = express();

// 1. INCREASE DATA LIMITS (Fixes 400 Bad Request)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. BULLETPROOF CORS (Fixes CORS Block)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://msg-portal-delta.vercel.app/", 
  "https://msg-portal-3cqi.vercel.app/"  
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
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