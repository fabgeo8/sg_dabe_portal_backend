const nodemailer = require("nodemailer");

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
}

if (process.env.SMTP_USER) {
    smtpConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
}

const senderAddress = '"Formularsystem noreply" <' + process.env.SMTP_SENDER + '>'

const transporter = nodemailer.createTransport(smtpConfig);

const supportEmailAddress = 'dev@govforms.ch'

module.exports = {
    sendUserActivationMessage(to) {
        try {
            let promise = new Promise((resolve, reject) => {
                let info = transporter.sendMail({
                    from: senderAddress, // sender address
                    to: to, // list of receivers
                    subject: "Ihr Benutzer wurde freigeschaltet", // Subject line
                    text: "Sie wurden erfolgreich für die Applikation 'Formularsystem Portal' freigeschaltet. Melden Sie sich an über " + process.env.CORS_ORIGIN + "/login", // plain text body
                    html: "<p>Sie wurden erfolgreich für die Applikation 'Formularsystem Portal' freigeschaltet. Melden Sie sich an über <a href='"+ process.env.CORS_ORIGIN +"/login'>" + process.env.CORS_ORIGIN + "/login</a></p>" // html body
                }, (err, info) => {
                    console.log(info);
                    console.log(err);
                    resolve("success")
                })
            })

            return promise;
        } catch (ex) {
            console.log("Error while sending email, activation message")
            throw new Error(ex.message)
        }
    },
    sendSupportNotification (subject, message) {
        try {
            /*let info = transporter.sendMail({
                from: senderAddress, // sender address
                to: supportEmailAddress, // list of receivers
                subject: subject, // Subject line
                text: message, // plain text body
                html: message // html body
            })
            console.log(info)*/
        } catch (ex) {
            console.log("Error while sending email, support notification")
            throw new Error(ex.message)
        }
    }

}