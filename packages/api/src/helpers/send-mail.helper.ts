import nodemailer from 'nodemailer';
import { config } from '../config';

const transport = config.email && nodemailer.createTransport(config.email.smtp);

export const sendMail = (options: Omit<nodemailer.SendMailOptions, 'from'>) => {
  if (!transport) {
    throw new Error('No SMTP configuration found');
  }

  const merged = { ...options, from: config.email.from };
  console.log(merged);
  // console.log({ options });
  return transport.sendMail(merged);
};
