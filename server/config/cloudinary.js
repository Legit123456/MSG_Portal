import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Force .env to load immediately
dotenv.config();

// Debug Check: Remove this line after it works
console.log("Cloudinary Config Loaded:", process.env.CLOUDINARY_CLOUD_NAME ? "YES" : "NO");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;