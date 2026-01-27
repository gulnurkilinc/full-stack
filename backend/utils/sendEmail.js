const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Blog İletişim" <${process.env.EMAIL_FROM}>`,
      to: options.to || process.env.EMAIL_TO,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ E-posta gönderildi:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ E-posta hatası:', error);
    throw error;
  }
};

module.exports = sendEmail;