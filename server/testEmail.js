import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// 1. Load Environment Variables
dotenv.config();

console.log("--- EMAIL DIAGNOSTIC TOOL ---");
console.log("1. Checking Credentials...");
console.log("   - User:", process.env.EMAIL_USER || "MISSING");
console.log("   - Pass:", process.env.EMAIL_PASS ? "**** (Exists)" : "MISSING");

// 2. Configure Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 3. Attempt to Send
async function runTest() {
    try {
        console.log("2. Attempting to send email to yourself...");
        
        const info = await transporter.sendMail({
            from: `"MSG Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to yourself
            subject: 'MSG System Test',
            text: 'If you are reading this, the email system is FULLY OPERATIONAL.'
        });

        console.log("3. ✅ SUCCESS!");
        console.log("   - Message ID:", info.messageId);
        console.log("   - Check your inbox (and spam) now.");

    } catch (error) {
        console.log("3. ❌ FAILURE");
        console.error("   - Error Code:", error.code);
        console.error("   - Error Message:", error.message);
        
        if (error.response) {
             console.error("   - Google Response:", error.response);
        }
    }
}

runTest();