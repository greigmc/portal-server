import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Create the reusable transporter once
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📧 Welcome Email
export const sendConfirmationEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Greig McMahon Web Development" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to Our App!",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for signing up. We're excited to have you onboard!</p>
      `,
    });
    console.log("✅ Confirmation email sent.");
  } catch (err) {
    console.error("❌ Email sending error:", err);
  }
};

// 🔐 Password Reset Email
export const sendResetPasswordEmail = async (to, token, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Greig McMahon Web Development" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
    <a href="${resetUrl}" style="
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 5px;
    font-family: sans-serif;
  ">
  Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent.");
  } catch (err) {
    console.error("❌ Password reset email error:", err);
  }
};
