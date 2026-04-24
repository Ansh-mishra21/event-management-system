
const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/*
----------------------------------------
BOOKING CONFIRMATION EMAIL FUNCTION
----------------------------------------
This function sends email after event booking
*/
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    await resend.emails.send({
      // Sender email (Resend allows this default domain)
      from: "Eventify <mishransh2108@gmail.com>",

      
      to: userEmail,

      
      subject: `Booking Confirmed: ${eventTitle}`,

      
      html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventify.</p>
            `,
    });

    console.log("Booking confirmation email sent to:", userEmail);
  } catch (error) {
    
    console.error("Error sending booking email:", error);
  }
};

/*
----------------------------------------
OTP EMAIL FUNCTION
----------------------------------------
Used for:
1. Account verification
2. Booking verification
*/
const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    // Title of the email based on type
    const title =
      type === "account_verification"
        ? "Verify your Eventify Account"
        : "Eventify Booking Verification";

    // Message inside email
    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventify account."
        : "Please use the following OTP to verify and confirm your event booking.";

    await resend.emails.send({
      from: "Eventify <mishransh2108@gmail.com>",

      to: userEmail,

      subject: title,

      html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    
                    <h2 style="color: #111;">${title}</h2>

                    <p style="color: #555; font-size: 16px;">
                        ${msg}
                    </p>

                    <div style="
                        margin: 20px auto;
                        padding: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        background: #f4f4f4;
                        width: max-content;
                        letter-spacing: 5px;
                    ">
                        ${otp}
                    </div>

                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes.
                        If you didn't request this, please ignore this email.
                    </p>

                </div>
            `,
    });

    console.log(`OTP sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};


module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};
