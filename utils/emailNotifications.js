// emailNotifications.js

const { transporter } = require('../config.js');

// Function to send email notification
function sendEmailNotification(fromEmail, toEmail, subject, content) {
    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email notification:', error);
        } else {
            console.log('Email notification sent:', info.response);
        }
    });
}

// Function to send bulk email notification
function sendBulkEmailNotifications(fromEmail, toEmails, subject, content) {
    for (let toEmail in toEmails) {
        sendEmailNotification(fromEmail, toEmail, subject, content);
    }
}
module.exports =  {
    sendEmailNotification,
    sendBulkEmailNotifications,
};
