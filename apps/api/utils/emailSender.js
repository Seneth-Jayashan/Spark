const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendEmail = async (to, subject, html) => {
  const fromEmail = process.env.FROM_EMAIL || "no-reply@sjaywebsolutions.lk";

  const mailOptions = {
    from: `"SPARK VMS" <${fromEmail}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send Reset Password Email (Interactive)
 */
const sendResetPassword = async (to, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #ff4965; text-align: center;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested a password reset for your <strong>SPARK VMS</strong> account.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="
        background-color: #ff4965; 
        color: white; 
        text-decoration: none; 
        padding: 12px 24px; 
        border-radius: 6px;
        display: inline-block;
        font-weight: bold;
      ">Reset Password</a>
    </p>
    <p>This link will expire in 1 hour.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #999;">If you did not request this, you can safely ignore this email.</p>
  </div>
  `;

  return sendEmail(to, "Reset your SPARK VMS password", html);
};

/**
 * Send Email Verification Link (Interactive)
 */
const sendVerificationLink = async (to, verifyToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;

  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #ff4965; text-align: center;">Verify Your Email</h2>
    <p>Welcome to <strong>SPARK Volunteer Management System</strong>!</p>
    <p>Please verify your email by clicking the button below:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="
        background-color: #ff4965; 
        color: white; 
        text-decoration: none; 
        padding: 12px 24px; 
        border-radius: 6px;
        display: inline-block;
        font-weight: bold;
      ">Verify Email</a>
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #999;">If you did not create an account, you can safely ignore this email.</p>
  </div>
  `;

  return sendEmail(to, "Verify your SPARK VMS email", html);
};


module.exports = {
  sendResetPassword,
  sendVerificationLink,
};
