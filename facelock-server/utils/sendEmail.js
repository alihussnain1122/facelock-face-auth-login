const nodemailer= require('nodemailer');

const sendEmail= async(to, subject, html)=>{

    const transporter= nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS // Your email password or app password
        }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: `${html}`,
    });
};
module.exports= sendEmail;