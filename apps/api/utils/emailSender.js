const axios = require("axios");
require("dotenv").config();

let accessToken = process.env.ZOHO_ACCESS_TOKEN;

/**
 * Refresh Zoho Access Token using Refresh Token
 */
async function refreshAccessToken() {
  try {
    const res = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );
    accessToken = res.data.access_token;
    console.log("Zoho access token refreshed");
  } catch (err) {
    console.error(
      "Error refreshing Zoho access token:",
      err.response?.data || err.message
    );
    throw err;
  }
}

/**
 * Send email using Zoho Mail API
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Optional plain text content (not used if html is present)
 * @param {string} [options.html] - Optional HTML content
 */
async function sendEmail({ to, subject, text, html }) {
  // Ensure we have a valid token before trying
  if (!accessToken) {
    try {
      await refreshAccessToken();
    } catch (refreshErr) {
      console.error("Failed to refresh token before sending email.");
      throw refreshErr; // Stop if we can't get a token
    }
  }

  try {
    const data = {
      // Updated from 'Rural Link' to 'SPARK VMS'
      fromAddress: `SPARK VMS <${process.env.ZOHO_EMAIL}>`,
      toAddress: to,
      subject,
      content: html || text, // Prefers HTML, falls back to text
      askReceipt: "no",
    };

    const res = await axios.post(
      `https://mail.zoho.com/api/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`,
      data,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully via Zoho:", res.data);
    return res.data; // Return success data
  } catch (err) {
    // Refresh token if access token expired
    if (err.response && (err.response.status === 401 || err.response.data?.data?.errorCode === "INVALID_OAUTHTOKEN")) {
      console.log("Access token expired or invalid, refreshing token...");
      await refreshAccessToken();
      // Retry sending the email once after refreshing
      return sendEmail({ to, subject, text, html });
    }
    console.error("Error sending email:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Send Reset Password Email (Updated Template)
 */
const sendResetPassword = async (to, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // Ensure CLIENT_URL is set in your .env

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 30px;">
      
      <h1 style="color: #1a3b6d; font-size: 24px; margin-top: 10px;">Password Reset Request</h1>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
    <p style="font-size: 16px; line-height: 1.6;">You requested a password reset for your <strong>SPARK VMS</strong> account.</p>
    <p style="font-size: 16px; line-height: 1.6;">Click the button below to set a new password:</p>
    <p style="text-align: center; margin: 35px 0;">
      <a href="${resetUrl}" style="
        background-color: #eab308; 
        color: #1a3b6d; /* Dark blue text on gold button */
        text-decoration: none; 
        padding: 14px 28px; 
        border-radius: 8px;
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        border: none;
        cursor: pointer;
      ">Reset Your Password</a>
    </p>
    <p style="font-size: 16px; line-height: 1.6;">This password reset link will expire in 1 hour.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 13px; color: #777; text-align: center;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
  </div>
  `;

  // Updated call to use object
  return sendEmail({
    to,
    subject: "Reset your SPARK VMS password",
    html,
  });
};

/**
 * Send Email Verification Link (Updated Template)
 */
const sendVerificationLink = async (to, verifyToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`; // Ensure CLIENT_URL is set

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 30px;">
      
      <h1 style="color: #1a3b6d; font-size: 24px; margin-top: 10px;">Welcome to SPARK VMS!</h1>
    </div>
    <p style="font-size: 16px; line-height: 1.6;">Thanks for signing up!</p>
    <p style="font-size: 16px; line-height: 1.6;">Please verify your email address by clicking the button below:</p>
    <p style="text-align: center; margin: 35px 0;">
      <a href="${verifyUrl}" style="
        background-color: #eab308; 
        color: #1a3b6d; /* Dark blue text on gold button */
        text-decoration: none; 
        padding: 14px 28px; 
        border-radius: 8px;
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        border: none;
        cursor: pointer;
      ">Verify Your Email</a>
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 13px; color: #777; text-align: center;">If you did not create an account with SPARK VMS, you can safely ignore this email.</p>
  </div>
  `;

  // Updated call to use object
  return sendEmail({
    to,
    subject: "Verify your SPARK VMS email address",
    html,
  });
};

/**
 * Send Organization Welcome Email (NEW TEMPLATE)
 */
const sendOrgWelcomeEmail = async (to, owner_name, org_name) => {
  const dashboard_url = `${process.env.CLIENT_URL}/dashboard`; // Adjust path as needed
  const help_url = `${process.env.CLIENT_URL}/help`; // Adjust path as needed

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
    <div style="padding: 30px 20px 20px 20px; background-color: #1a3b6d; color: #ffffff; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Welcome to SPARK VMS!</h1>
    </div>
    
    <div style="padding: 40px 30px 30px 30px; line-height: 1.7;">
      <h2 style="font-size: 22px; margin-top: 0; color: #1a3b6d;">Hi ${owner_name},</h2>
      
      <p style="font-size: 16px; margin-bottom: 25px;">
        Congratulations! Your organization, <strong>${org_name}</strong>, has been successfully created on <strong>SPARK VMS</strong>. We're thrilled to have you on board.
      </p>
      
      <p style="font-size: 16px; margin-bottom: 30px;">
        To get started, log in to your dashboard to complete your profile, manage users, and explore all the features.
      </p>
      
      <p style="text-align: center; margin: 35px 0;">
        <a href="${dashboard_url}" target="_blank" style="
          display: inline-block; 
          padding: 14px 28px; 
          font-size: 16px; 
          font-weight: bold; 
          color: #1a3b6d; 
          background-color: #eab308; 
          text-decoration: none; 
          border-radius: 8px;
          border: none;
          cursor: pointer;
        ">
          Go to Your Dashboard
        </a>
      </p>
    </div>
    
    <div style="padding: 30px 30px 40px 30px; background-color: #f9f9f9; text-align: center; color: #777777;">
      <p style="font-size: 14px; margin: 0 0 10px 0;">
        If you have any questions, just reply to this email or visit our <a href="${help_url}" style="color: #1a3b6d;">Help Center</a>.
      </p>
      <p style="font-size: 12px; margin: 0;">
        &copy; ${new Date().getFullYear()} SPARK VMS. All rights reserved.
      </p>
    </div>
  </div>
  `;

  // Updated call to use object
  return sendEmail({
    to,
    subject: `Welcome to SPARK VMS, ${org_name}!`,
    html,
  });
};

// Exports remain the same, making this a drop-in replacement
module.exports = {
  sendResetPassword,
  sendVerificationLink,
  sendOrgWelcomeEmail,
  refreshAccessToken, // Exporting this in case you want to initialize the token on app start
  sendEmail, // Exporting the base function in case you need it elsewhere
};