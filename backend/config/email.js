const nodemailer = require('nodemailer');
require('dotenv').config();

// Debug environment variables
console.log('Email Config:', {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD ? '****' : 'missing'
});

// Create Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true
});

// Function to send volunteer registration email
const sendVolunteerEmail = async (email, name, password, ngoName) => {
    try {
        // Verify transporter
        await transporter.verify();
        console.log('Transporter verified successfully');

        const mailOptions = {
            from: `"Pashurakshak" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Welcome to Pashurakshak - Volunteer Registration',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #28a745; text-align: center;">Welcome to Pashurakshak! 🎊</h1>
                    <h2 style="color: #333; text-align: center;">You've been registered as a Volunteer</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #333;">Dear <strong>${name}</strong>,</p>
                        <p style="color: #333;">You have been registered as a volunteer for <strong>${ngoName}</strong>.</p>
                    </div>
                    
                    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #2e7d32; text-align: center;">Your Login Credentials</h3>
                        <p style="color: #333; text-align: center;"><strong>Email:</strong> ${email}</p>
                        <p style="color: #333; text-align: center;"><strong>Password:</strong> ${password}</p>
                    </div>
                    
                    <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #e65100; margin: 0;"><strong>Important:</strong> Please change your password after your first login.</p>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; color: #666;">
                        <p>Best regards,<br><strong>Team ${ngoName}</strong></p>
                    </div>
                </div>
            `
        };

        console.log('Attempting to send email to:', email);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Detailed error sending email:', error);
        return false;
    }
};

module.exports = {
    sendVolunteerEmail
}; 