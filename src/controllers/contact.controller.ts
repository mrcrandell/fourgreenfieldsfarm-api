// src/controllers/contact.controller.ts
import { JsonController, Post, Body, Res, HttpCode } from "routing-controllers";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";
import { Response } from "express";
import { sendMail } from "../utils/email.util";
import fs from "fs";

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

    const raw = fs.readFileSync("src/templates/contact-email.html", "utf-8");
    const year = new Date().getFullYear();
    const html = raw
      .replace("{{name}}", name)
      .replace("{{email}}", email)
      .replace("{{phone}}", phone)
      .replace("{{message}}", message)
      .replace("{{year}}", String(year));

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
