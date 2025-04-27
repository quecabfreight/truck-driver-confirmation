// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a transport instance for sending emails using Gmail and Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Use your Gmail address
        pass: 'your-app-password' // Use the app password generated from Google
    }
});

// Endpoint for sending email
app.post('/send-email', (req, res) => {
    const { loadId, companyName, driverPhone, startTime, expirationTime, recipientEmail } = req.body;

    const emailData = {
        from: 'your-email@gmail.com',
        to: recipientEmail,
        subject: `Truck/Driver Confirmation for Load #${loadId}`,
        text: `Load ID: ${loadId}\nCompany Name: ${companyName}\nDriver Phone: ${driverPhone}\nStart Time: ${startTime}\nExpiration Time: ${expirationTime}`
    };

    transporter.sendMail(emailData, (error, info) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'Email failed to send. Please try again.' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully!' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

