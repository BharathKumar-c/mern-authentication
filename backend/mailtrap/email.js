import {mailtrapClient, sender} from './mailtrap.config.js';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken
      ),
      category: 'Email verification',
    });

    console.log('Email sent successfully', response);
  } catch (error) {
    console.log(`Error sending verification mail ${error.message}`);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (name, email) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: 'e65925d1-a9d1-4a40-ae7c-d92b37d593df',
      template_variables: {
        company_info_name: 'Auth Company',
        name: name,
      },
    });

    console.log(`Welcome email sent successfully ${response}`);
  } catch (error) {
    console.log(`Error sending welcome email ${error}`);
    throw new Error(`Error sending welcome email ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetLink),
      category: 'Password reset',
    });

    console.log('Email sent successfully', response);
  } catch (error) {
    console.log(error);
  }
};
