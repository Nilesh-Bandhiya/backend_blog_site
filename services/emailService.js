const mailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

const transporter = mailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIl_PASSWORD
    }
})

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Blog-App',
        link: 'https://google.com'
    }
});

const welcomeEmail = (mail, welcomeUrl, name) => {

    const email = {
        body: {
            name: `Welcome ${name}`,
            intro: `Welcome to Blog App.
              We are Happy to know that you are a part of Our Family , Pease Wait until the our admin give you an access of Log in`,
            action: {
                instructions: `Let Into Our App`,
                button: {
                    color: '#0000FF',
                    text: 'Go to App',
                    link: welcomeUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    const welcomeEmailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const welcomeEmailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', welcomeEmailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', welcomeEmailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: 'Registeration in Blog App ',
        html: welcomeEmailBody,
        text: welcomeEmailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Welcome Mail sent successfully.');
        transporter.close();
    });
}

const loginRequestEmail = (mail, welcomeUrl, name,) => {

    const email = {
        body: {
            name: `Hello Admin`,
            intro: `Hii Admin please approve ${name} For the loggin`,
            action: {
                instructions: `For Approve User`,
                button: {
                    color: '#22BC66',
                    text: 'Go to App',
                    link: welcomeUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    const loginRequestEmailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const loginRequestEmailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', loginRequestEmailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', loginRequestEmailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: 'Registeration in Blog App ',
        html: loginRequestEmailBody,
        text: loginRequestEmailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Welcome Mail sent successfully.');
        transporter.close();
    });
}

const resetPasswordEmail = (mail, resetLink, name) => {

    const email = {
        body: {
            name: `Hello, ${name}`,
            intro: `Welcome to the Blog APP, We get your request for the reset password`,
            action: {
                instructions: `For Reset Your Password`,
                button: {
                    color: '#22BC66',
                    text: 'Reset Password',
                    link: resetLink
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    // Generate an HTML email with the provided contents
    const resetemailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const resetemailText = mailGenerator.generatePlaintext(email);

    require('fs').writeFileSync('preview.html', resetemailBody, 'utf8');
    require('fs').writeFileSync('preview.txt', resetemailText, 'utf8');

    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: mail,
        subject: `Reset Password`,
        html: resetemailBody,
        text: resetemailText,
    }, function (err) {
        if (err) return console.log(err);
        console.log('Reset Password Mail sent successfully.');
        transporter.close();
    });
}

module.exports = {
    welcomeEmail,
    resetPasswordEmail,
    loginRequestEmail
};