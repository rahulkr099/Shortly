import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();
export const mailSender = async (email, title, body, text) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                 //add certification
                 port: 465,
                 secure: true,
                auth:{
                    user: process.env.MAIL_USER, //your email address
                    pass: process.env.MAIL_PASS, //your email password
                }
            })


            let info = await transporter.sendMail({
                from: process.env.MAIL_USER,
                to:`${email}`,
                subject: `${title}`,
                text:`${text}`,
                html: `${body}`,
            })
            // console.log(info);
            return info;
    }
    catch(error) {
        console.error(error);
        //throw right error
        throw error;
    }
}
