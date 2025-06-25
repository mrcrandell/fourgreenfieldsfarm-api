// src/utils/mailgunService.ts
import formData from "form-data";
import Mailgun from "mailgun.js";
import * as dotenv from "dotenv";
dotenv.config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export async function sendMail({
  to,
  subject,
  html,
  from = "Four Green Fields Farm <postmaster@mailgun.fourgreenfieldsfarm.com>",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  return mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from,
    to,
    subject,
    html,
  });
}
