import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

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

  async sendPasswordResetEmail(email, name, token, otp) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const mailOptions = {
        from: `"Khodiyar Enterprise" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Reset Your Password - Khodiyar Enterprise',
        html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                        <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
                        <p style="font-size: 16px; color: #34495e;">Hello ${name},</p>
                        <p style="font-size: 16px; color: #34495e;">We received a request to reset your password. Please use the button below to reset it. If you did not request this, please ignore this email.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #e74c3c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px; color: #7f8c8d;">Your Password Reset OTP</p>
                            <h1 style="margin: 10px 0; color: #2c3e50; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                            <p style="margin: 0; font-size: 12px; color: #95a5a6;">(This OTP is valid for 10 minutes)</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.5;">If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                        <p style="font-size: 12px; word-break: break-all; color: #3498db;">${resetUrl}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #bdc3c7; text-align: center;">This is an automated email, please do not reply. <br> &copy; 2026 Khodiyar Enterprise. All rights reserved.</p>
                    </div>
                `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Password reset email sent', {
        messageId: info.messageId,
        email,
      });
      return info;
    } catch (error) {
      logger.error('Failed to send password reset email', {
        error: error.message,
        stack: error.stack,
        email,
      });
    }
  }

  async sendOrderConfirmationEmail(email, name, order, orderItems) {
    try {
      const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const itemsHtml = orderItems.map(item => `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 12px; text-align: left;">${item.product?.name || 'Product'}</td>
          <td style="padding: 12px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
          <td style="padding: 12px; text-align: right;">₹${(Number(item.price) * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      const mailOptions = {
        from: `"Khodiyar Enterprise" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: `Order Confirmation - #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #1e3a5f; text-align: center;">Order Confirmation</h2>
            <p style="font-size: 16px; color: #34495e;">Hello ${name},</p>
            <p style="font-size: 16px; color: #34495e;">Thank you for your order! We've received your order and will process it shortly.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Order Date:</strong> ${orderDate}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Payment Type:</strong> ${order.payment_type.toUpperCase()}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> ${order.status}</p>
            </div>

            <h3 style="color: #1e3a5f; margin-top: 30px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8f9fa; font-weight: bold;">
                  <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                  <td style="padding: 12px; text-align: right;">₹${Number(order.total_amount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
              <h4 style="margin-top: 0; color: #1e3a5f;">Delivery Address</h4>
              <p style="margin: 5px 0; font-size: 14px;">${order.full_name}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.address}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.city}, ${order.state} - ${order.pincode}</p>
              <p style="margin: 5px 0; font-size: 14px;">Phone: ${order.phone}</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
            <p style="font-size: 12px; color: #bdc3c7; text-align: center;">This is an automated email, please do not reply. <br> &copy; 2026 Khodiyar Enterprise. All rights reserved.</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Order confirmation email sent', {
        messageId: info.messageId,
        email,
        orderId: order.id,
      });
      return info;
    } catch (error) {
      logger.error('Failed to send order confirmation email', {
        error: error.message,
        stack: error.stack,
        email,
        orderId: order.id,
      });
    }
  }

  async sendOrderCancellationEmail(email, name, order) {
    try {
      const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const mailOptions = {
        from: `"Khodiyar Enterprise" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: `Order Cancelled - #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #e74c3c; text-align: center;">Order Cancelled</h2>
            <p style="font-size: 16px; color: #34495e;">Hello ${name},</p>
            <p style="font-size: 16px; color: #34495e;">Your order has been cancelled as requested.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Order Date:</strong> ${orderDate}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Total Amount:</strong> ₹${Number(order.total_amount).toFixed(2)}</p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Cancelled</p>
            </div>

            <p style="font-size: 14px; color: #34495e; margin-top: 20px;">
              If you have any questions or need assistance, please contact our support team.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
            <p style="font-size: 12px; color: #bdc3c7; text-align: center;">This is an automated email, please do not reply. <br> &copy; 2026 Khodiyar Enterprise. All rights reserved.</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Order cancellation email sent', {
        messageId: info.messageId,
        email,
        orderId: order.id,
      });
      return info;
    } catch (error) {
      logger.error('Failed to send order cancellation email', {
        error: error.message,
        stack: error.stack,
        email,
        orderId: order.id,
      });
    }
  }
}

export default new EmailService();
