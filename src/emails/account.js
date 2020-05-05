const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bataman911@gmail.com',
        subject: 'bienvenido',
        text: `Hi ${name} thanks....`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
}

const sendClosedAccountEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bataman911@gmail.com',
        subject: 'mensaje 3 cerrar cta',
        text: `Bye ${name} thanks....`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendClosedAccountEmail
}


/* 
const msg = {
    to: 'bataman911@gmail.com',
    from: 'bataman911@gmail.com',
    subject: 'banana is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg); 
  */