const fs = require('fs');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'classtablexjtlu@outlook.com',
        pass: 'fcx20121221' //授权码
    }
});

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Chenxu Fu',
        link: 'https://class.kyrie.top/',
        copyright: 'Copyright © 2018 Chenxu Fu. All rights reserved.',
        // Optional product logo
        logo: `http://o6w0bsnj8.bkt.clouddn.com/favicon.png`
    }
});

module.exports = (recipient, uname) => {
    const email = {
        body: {
            name: `${uname}`,
            intro: `Thanks for using ClassTable Calendar, your calendar is attached below in this email!<br/><br/>
                    You can also check out newly introduced WeChat Mini Program.`,
            outro: 'If you need help, or have any questions, just reply to this email, I\'d love to help.',
            signature: 'Cheers'
        }
    };

    // Generate an HTML email with the provided contents
    const emailBody = mailGenerator.generate(email);

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Chenxu Fu 👻 ClassTable" <classtablexjtlu@outlook.com>', // sender address
        to: `${recipient}`, // list of receivers
        subject: `Here goes your Calendar file 📆`, // Subject line
        html: `${emailBody}`, // html body
        attachments: [
            {   // utf-8 string as an attachment
                path: `${__root}/calendars/${uname}.ics`
            },
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
