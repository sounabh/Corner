import { createTransport } from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "4bea34f8e5d36a6ba1aaf73cc14e7208";


export const transport = createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

export const sender = {
  address: "hello@demomailtrap.com",
  name: "sounabh",
};


/*transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);*/