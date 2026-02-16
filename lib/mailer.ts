import { SMTPClient } from "emailjs";

export const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("Faltan variables SMTP.");
  }

  return new SMTPClient({
    user,
    password: pass,
    host,
    port,
    ssl: port === 465,
  });
};
