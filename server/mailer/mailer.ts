import dotenv from "dotenv";
dotenv.config();

import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (
  to: string,
  name: string,
): Promise<void> => {
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
