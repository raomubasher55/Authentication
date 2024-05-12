const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendMailer = async (email, subject, content) => {
    try {
        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully! Message ID:", info.messageId);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
    }
}

module.exports = {
    sendMailer
}
