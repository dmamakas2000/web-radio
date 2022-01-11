// App imports
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Constants
const hostname = "localhost";
const port = 7070;

var emailTargetDetails = require("./htdocs/mail/mail-config.json");

// Important headers in order not to generate CORS errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Application - POST endpoint (Email send)
app.post('/contact', function (req, res) {
    const sendersName = req.body.name;
    const sendersEmail = req.body.email;
    const messageToSend = req.body.message;
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: emailTargetDetails['target-email'],
            pass: emailTargetDetails['target-password']
        },
    tls: {
      rejectUnauthorized: false
    }
    });
  
    // Define email's text/html body
    var textBody = `FROM: ${sendersName} EMAIL: ${sendersEmail} MESSAGE: ${messageToSend}`;
    var htmlBody = `<img src="https://www.aueb.gr/press/logos/2_AUEB-white-HR.jpg" alt="aueb-logo" width="1200" height="400">
                  <h1 style='font-size: 80px; text-align: center'>Mail From Contact Form</h1>
                  <p style='font-size: 25px'>This mail was sent from: <b>${sendersName}</b> <br>
                  Sender's email address: <a href="mailto:${sendersEmail}">${sendersEmail}</a></p> 
                  <p style='font-size: 25px'> The person wrote the following message: <br> <b> ${messageToSend} </b> </p>`;
    var mail = {
        from: emailTargetDetails['target-email'], 
        to: emailTargetDetails['target-email'], 
        subject: "Mail From Contact Form",
        text: textBody,
        html: htmlBody
    };

    // Send mail with defined transport object
    transporter.sendMail(mail, function (err, info) {
        if(err) {
      // Something went wrong and the email was not sent with success
            console.log(err);
            res.status(500).json({ message: "message not sent: an error occured; check the server's console log" });
        } else {
      // The email was sent successfully
      res.status(200).json({ message: `message sent: ${info.messageId}` })
        }
    });
});

// Make the application listening on port 8080
app.listen(port, hostname, () => {
    console.log(`App running at http://${hostname}:${port}/`);
});