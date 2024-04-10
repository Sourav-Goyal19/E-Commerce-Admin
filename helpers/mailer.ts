import User from "@/models/user.model";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

interface EmailOptions {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: any;
}

export const SendEmail = async ({ email, emailType, userId }: EmailOptions) => {
  try {
    const token = uuidv4();
    let updateFields: any = {};

    if (emailType === "VERIFY") {
      updateFields = {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      };
    } else if (emailType === "RESET") {
      updateFields = {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      };
    }

    await User.findByIdAndUpdate(userId, { $set: updateFields });

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "ee0b386f05c14f",
        pass: process.env.MAILTRAP_PASS || "2230963de71eab",
      },
    });

    const mailOptions = {
      from: "goyalsourav935@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: getEmailTemplate(emailType, token),
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

function getEmailTemplate(
  emailType: "VERIFY" | "RESET",
  token: string
): string {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "";
  const action = emailType === "VERIFY" ? "verifyemail" : "forgotpassword";

  return `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center;">
  <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333333;">${emailType === "VERIFY" ? "Email Verification" : "Forgot Password"}</h1>
    <p style="color: #666666;">Thank you for signing up! To complete your ${emailType === "VERIFY" ? "registration" : "password reset"}, please click the button below.</p>
    <a href="${domain}/${action}/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">${emailType === "VERIFY" ? "Verify Email Address" : "Reset Password"}</a>
    <p style="color: #666666; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
  </div></div>`;
}
