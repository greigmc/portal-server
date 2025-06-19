// contactController.js
import { sendContactEmails } from "../mailer/mailer.js";

export const handleContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await sendContactEmails({ name, email, phone, subject, message });
    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail" });
  }
};
