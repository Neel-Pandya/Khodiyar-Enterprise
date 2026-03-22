import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email, name, token, otp) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

      const mailOptions = {
        from: `"Khodiyar Enterprise" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Verify Your Email - Khodiyar Enterprise',
        html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                        <h2 style="color: #2c3e50; text-align: center;">Welcome to Khodiyar Enterprise!</h2>
                        <p style="font-size: 16px; color: #34495e;">Hello ${name},</p>
                        <p style="font-size: 16px; color: #34495e;">Thank you for registering. To complete your registration, please verify your email address using the button below and enter the OTP when prompted.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email</a>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px; color: #7f8c8d;">Your Verification OTP</p>
                            <h1 style="margin: 10px 0; color: #2c3e50; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                            <p style="margin: 0; font-size: 12px; color: #95a5a6;">(This OTP is valid for 10 minutes)</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.5;">If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                        <p style="font-size: 12px; word-break: break-all; color: #3498db;">${verificationUrl}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #bdc3c7; text-align: center;">This is an automated email, please do not reply. <br> &copy; 2026 Khodiyar Enterprise. All rights reserved.</p>
                    </div>
                `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Verification email sent', {
        messageId: info.messageId,
        email,
      });
      return info;
    } catch (error) {
      logger.error('Failed to send verification email', {
        error: error.message,
        stack: error.stack,
        email,
      });
      // throw new ApiError(500, "Failed to send verification email");
    }
  }
}

export default new EmailService();
