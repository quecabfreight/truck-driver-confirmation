// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // From .env
    pass: process.env.EMAIL_PASS      // From .env (App Password)
  }
});

// POST route to send confirmation email
app.post('/send-email', (req, res) => {
  const {
    loadId,
    companyName,
    driverPhone,
    startTime,
    expirationTime,
    recipientEmail
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `Truck/Driver Confirmation for Load #${loadId}`,
    text: `Load ID: ${loadId}
Company Name: ${companyName}
Driver Phone: ${driverPhone}
Start Time: ${startTime}
Expiration Time: ${expirationTime}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to send email.' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully!' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
