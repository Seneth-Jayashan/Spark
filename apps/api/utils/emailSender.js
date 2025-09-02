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
 * Send Reset Password Email
 */
const sendResetPassword = async (to, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset for your SPARK account.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  return sendEmail(to, "Reset your SPARK VMS password", html);
};

/**
 * Send Email Verification Link
 */
const sendVerificationLink = async (to, verifyToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;

  const html = `
    <h2>Email Verification</h2>
    <p>Welcome to SPARK Volunteer Management System!</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
  `;

  return sendEmail(to, "Verify your SPARK VMS email", html);
};

module.exports = {
  sendResetPassword,
  sendVerificationLink,
};
