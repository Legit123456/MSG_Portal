import Recruit from '../models/Recruit.js';
import cloudinary from '../config/cloudinary.js';
import nodemailer from 'nodemailer';

// 1. Configure Email (The Working Config)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- REGISTER CONTROLLER ---
export const registerRecruit = async (req, res) => {
    try {
        const { fullName, email, faculty, level, course, whatsapp, reason, gender, signature } = req.body;

        console.log(`[NEW APP] Processing: ${fullName}`);

        // 1. Duplicate Check
        const existingRecruit = await Recruit.findOne({ 
            $or: [{ email: email }, { fullName: fullName }] 
        });
        if (existingRecruit) {
            console.log(`[BLOCK] Duplicate found for ${email}`);
            return res.status(400).json({ success: false, message: "Application already exists." });
        }

        // 2. Upload Signature
        const sigUpload = await cloudinary.uploader.upload(signature, { folder: 'msg_signatures' });
        
        // 3. Handle Passport
        let passportUrl = "https://placehold.co/400"; // Fallback
        if(req.file) passportUrl = req.file.path;

        // 4. DATABASE SAVE
        const newRecruit = await Recruit.create({
            fullName, email, faculty, level, course, whatsapp, reason, gender,
            passportUrl: passportUrl,
            signatureUrl: sigUpload.secure_url
        });
        console.log(`[DB SUCCESS] Saved Recruit ID: ${newRecruit._id}`);

        // 5. EMAIL SEND (Now Active)
        try {
            console.log(`[EMAIL] Attempting to send to ${email}...`);
            await transporter.sendMail({
                from: `"MSG Command" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Recruitment Application Received',
                html: `
                  <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; border-top: 5px solid #166534;">
                      <h2 style="color: #166534; margin-top: 0;">Application Acknowledged</h2>
                      <p>Dear <strong>${fullName}</strong>,</p>
                      <p>Your application to join the <strong>Muslim Students' Guard</strong> has been securely logged in on our database.</p>
                      <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; color: #14532d;"><strong>Reference ID:</strong> ${newRecruit._id}</p>
                        <p style="margin: 5px 0 0; color: #14532d;"><strong>Status:</strong> Pending Review</p>
                      </div>
                      <p>We will review your details and contact you via WhatsApp if you are shortlisted.</p>
                      <br/>
                      <p style="font-size: 12px; color: #666;">MSG Recruitment Command</p>
                    </div>
                  </div>
                `
            });
            console.log(`[EMAIL SUCCESS] Sent to ${email}`);
        } catch (emailError) {
            // Log error but do not crash response
            console.error(`[EMAIL ERROR] Failed to send: ${emailError.message}`);
        }

        // 6. Final Response
        res.status(201).json({ success: true, message: 'Application submitted successfully.' });

    } catch (error) {
        console.error(`[SERVER ERROR] ${error.message}`);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// --- ADMIN CONTROLLER ---
export const getAllRecruits = async (req, res) => {
  try {
    const recruits = await Recruit.find().sort({ appliedAt: -1 });
    res.status(200).json(recruits);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};