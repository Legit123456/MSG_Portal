import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { registerRecruit, getAllRecruits } from '../controllers/recruitController.js';

const router = express.Router();

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'msg_passports',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage: storage });

// Routes
router.post('/register', upload.single('passport'), registerRecruit);
router.get('/all', getAllRecruits);

export default router;