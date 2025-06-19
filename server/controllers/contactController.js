// contactController.js
import { sendContactEmails } from "../mailer/mailer.js";

export const handleContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await sendContactEmails({ name, email, phone, subject, message });
    res.status(200).json({ message: "Message sent!" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Error sending email" });
  }
};
