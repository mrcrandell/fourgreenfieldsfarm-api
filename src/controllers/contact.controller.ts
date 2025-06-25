// src/controllers/contact.controller.ts
import { JsonController, Post, Body, Res, HttpCode } from "routing-controllers";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";
import { Response } from "express";
import { sendMail } from "../utils/email.util";

class ContactBody {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber("US")
  phone!: string;

  @IsString()
  message!: string;
}

@JsonController()
export class ContactController {
  @Post("/contact")
  @HttpCode(200)
  async sendContactMessage(
    @Body({ validate: true }) body: ContactBody,
    @Res() res: Response
  ) {
    const { name, email, phone, message } = body;

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    try {
      await sendMail({
        to: "me@mattcrandell.com", // change to farm's receiving email
        subject: `Contact Form: ${name}`,
        html,
      });

      return res.json({ success: true, message: "Message sent successfully." });
    } catch (err) {
      console.error("Contact form error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send message." });
    }
  }
}
