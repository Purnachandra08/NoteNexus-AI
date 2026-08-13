import emailTransporter from "../config/email.js";

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"NoteNexus AI" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await emailTransporter.sendMail(mailOptions);
};

export default sendEmail;