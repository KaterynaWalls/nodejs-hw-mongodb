import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';


const transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: Number(getEnvVar('SMTP_PORT')),
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASS'),
    },
  });
  
  export const sendEmail = async (options) => {
    return transporter.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.from,
      html: options.html,
    });
  };