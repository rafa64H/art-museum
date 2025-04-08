import { MAILTRAP_TOKEN } from "../../constants/env";
import { MailtrapClient } from "mailtrap";

const mailtrapClient = new MailtrapClient({
  token: MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  userId: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ).replace("{userId}", userId),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to art museum!",
      html: WELCOME_EMAIL_TEMPLATE,
      category: "Welcome email",
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetPasswordToken: string,
  userId: string
) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetPasswordToken}",
        resetPasswordToken
      ).replace("{userId}", userId),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

export const VERIFICATION_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email verification code</title>
  </head>
  <body>
    <div style="background-color: #00023d;padding:1.5rem;">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/crisp-ecommerce-developm-4e4a7.appspot.com/o/company-logo.png?alt=media&token=bbc5980f-31cb-4c34-aa4e-bddcd1b71b8d"
        alt="Art museum page logo"
        style="width: 10rem;"
      />
      <h1 style="font-size:2rem; text-align: center; color: white; font-family: sans-serif;">Verify your email</h1>
    </div>
    <p style="font-size: 1.2rem; margin-left: 0.5em; color: #00728b;">
      Your link to verify your email is this:
    </p>
    <h2 style="font-size: 1.5rem; text-align: center; margin: 0.5em auto; background-color: #333775; padding: 1.5em; color: white;"><a href="http://localhost:5173/verify-email/{userId}/{verificationCode}">Click here to verify email</a></h2>
    <p style="font-size: 1.2rem; margin-left: 0.5em; color: #00728b;">
      If you didn't use this email for an account in our page, then ignore this
      email.
    </p>
  </body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password - Code</title>
  </head>
  <body>
    <div style="background-color: #00023d;padding:1.5rem;">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/crisp-ecommerce-developm-4e4a7.appspot.com/o/company-logo.png?alt=media&token=bbc5980f-31cb-4c34-aa4e-bddcd1b71b8d"
        alt="Art museum page logo"
        style="width: 10rem;"
      />
      <h1 style="font-size:2rem; text-align: center; color: white; font-family: sans-serif;">Reset your password</h1>
    </div>
    <p style="font-size: 1.2rem; margin-left: 0.5em; color: #00728b;">
      Your link to Reset your password is:
    </p>
    <h2 style="font-size: 1.5rem; text-align: center; margin: 0.5em auto; background-color: #333775; padding: 1.5em; color: white;"><a href="http://localhost:5173/reset-password/{userId}/{resetPasswordToken}">Click here to verify email</a></h2>
    <p style="font-size: 1.2rem; margin-left: 0.5em; color: #00728b;">
      If you didn't request this email, ignore this (maybe be sure to change
      your email's password).
    </p>
  </body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email verified successfully</title>
  </head>
  <body>
    <div style="background-color: #00023d;padding:1.5rem;">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/crisp-ecommerce-developm-4e4a7.appspot.com/o/company-logo.png?alt=media&token=bbc5980f-31cb-4c34-aa4e-bddcd1b71b8d"
        alt="Art museum page logo"
        style="width: 10rem;"
      />
      <h1 style="font-size:2rem; text-align: center; color: white; font-family: sans-serif;">Your email has been verified</h1>
    </div>
    <h2 style="font-size: 1.5rem; text-align: center; margin: 0.5em auto; background-color: #333775; padding: 1.5em; color: white;">Your email was successfuly verified</h2>
    <p style="font-size: 1.2rem; margin-left: 0.5em; color: #00728b;">
      If you didn't create an account in our page and you receive this email
      verification, then maybe someone has access to your email, maybe you
      should change your passwod... Or something
    </p>
  </body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset password done successfuly</title>
  </head>
  <body>
    <div style="background-color: #00023d;padding:1.5rem;">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/crisp-ecommerce-developm-4e4a7.appspot.com/o/company-logo.png?alt=media&token=bbc5980f-31cb-4c34-aa4e-bddcd1b71b8d"
        alt="Art museum page logo"
        style="width: 10rem;"
      />
      <h1 style="font-size:2rem; text-align: center; color: white; font-family: sans-serif;">Reset password done successfuly</h1>
    </div>
    <h2 style="font-size: 1.5rem; text-align: center; margin: 0.5em auto; background-color: #333775; padding: 1.5em; color: white;">Your password has been changed</h2>
  </body>
</html>
`;
