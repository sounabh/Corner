import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE
} from "./emailTemplate.js";
import {  sender, transport } from "./mailtrap.js";



export const sendVerificationEmail = async (email, verificationToken) => {

	if (!email || !verificationToken) {
	  throw new Error('Email and verification token are required.');
	}
  
	try {
		
	  const response = await transport.sendMail({
		from: sender, // Replace with your sender email
		to: email,
		subject: 'Verify Your Email',
		text: `Your verification code is: ${verificationToken}`, // Fallback plain-text content
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), // HTML template with dynamic code
	  });
  
	  console.log('Verification email sent successfully:', response);
	  return response;
	} catch (error) {
	  console.error('Error sending verification email:', error);
	  throw new Error(`Failed to send verification email: ${error.message}`);
	}
  };



 export const sendWelcomeEmail = async (email, name) => {
	

	if (!email || !name) {
		throw new Error('Email and name are required.');
	  }


	try {
		const response = await transport.sendMail({
			from: sender,
			to: email,
			subject: `Welcome ${name}`,
			html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};



 /*const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

 const sendResetSuccessEmail = async (email) => {
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
}*/