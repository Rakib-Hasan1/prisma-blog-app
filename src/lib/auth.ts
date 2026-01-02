import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <dev.rakibhasan1@gmail.com>',
          to: user.email,
          subject: "Verify your email address",
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
          <div style="max-width: 520px; margin: auto; background: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
            
            <h2 style="color: #1f2937; margin-bottom: 16px;">
              Verify your email address
            </h2>

            <p style="color: #374151; font-size: 15px;">
              Hi <strong>${user.name || "there"}</strong>,
            </p>

            <p style="color: #374151; font-size: 15px;">
              Thanks for creating an account on <strong>Prisma Blog</strong>.
              Please confirm your email address by clicking the button below.
            </p>

            <div style="margin: 28px 0; text-align: center;">
              <a
                href="${verificationURL}"
                style="
                  background-color: #2563eb;
                  color: #ffffff;
                  padding: 14px 26px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  display: inline-block;
                "
              >
                Verify Email
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>

            <p style="word-break: break-all; font-size: 14px; color: #2563eb;">
              ${verificationURL}
            </p>

            <hr style="margin: 28px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="color: #9ca3af; font-size: 13px;">
              If you didn’t create an account, you can safely ignore this email.
            </p>

            <p style="color: #9ca3af; font-size: 13px; margin-top: 20px;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </p>
          </div>
        </div>
      `,
        });

        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
