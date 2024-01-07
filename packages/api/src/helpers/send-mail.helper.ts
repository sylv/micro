import nodemailer from 'nodemailer';
import { config } from '../config.js';

const transport = config.email && nodemailer.createTransport(config.email.smtp);

export const sendMail = (options: Omit<nodemailer.SendMailOptions, 'from'>) => {
  if (!transport || !config.email) {
    throw new Error('No SMTP configuration found');
  }

  const merged = { ...options, from: config.email.from };
  return transport.sendMail(merged);
};
