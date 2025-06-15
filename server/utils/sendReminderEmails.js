import postmark from 'postmark';
import dotenv from 'dotenv';

dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export const sendOneWeekReminderEmail = async (
    {
  fullName,
  email,
  cohortName,
  startDate,
}) => {
  try {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Simple email for now - we'll make it fancy later
    const html = `
      <h2>Hi ${fullName},</h2>
      <p>Just a week left until your ${cohortName} starts!</p>
      <p><strong>Date:</strong> ${formattedStartDate}</p>
      <p>We're excited to see you there!</p>
      <p>- D4A Team</p>
    `;

    await client.sendEmail({
      From: process.env.OPERATIONS_EMAIL,
      To: email,
      Subject: `One Week Until ${cohortName}!`,
      HtmlBody: html,
    });

    console.log(`📧 One week reminder sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending one week reminder:', error.message);
  }
};

export const sendTwoDayReminderEmail = async ({
    fullName,
    email,
    cohortName,
    startDate,
  }) => {
    try {
      const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const html = `
        <h2>Hi ${fullName},</h2>
        <p>Just two days left until your ${cohortName} starts!</p>
        <p><strong>Date:</strong> ${formattedStartDate}</p>
        <p><strong>Time:</strong> 9:00 AM - 4:00 PM</p>
        <p><strong>Location:</strong> Digital 4 Africa Office, Delta Corner Annex, 4th Floor</p>
        <p>Don't forget to bring your laptop and notebook!</p>
        <p>- D4A Team</p>
      `;

      await client.sendEmail({
        From: process.env.OPERATIONS_EMAIL,
        To: email,
        Subject: `Two Days Until ${cohortName}!`,
        HtmlBody: html,
      });

      console.log(`📧 Two day reminder sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending two day reminder:', error.message);
    }
  };

  export const sendDayOfReminderEmail = async ({
    fullName,
    email,
    cohortName,
    startDate,
  }) => {
    try {
      const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const html = `
        <h2>Hi ${fullName},</h2>
        <p>Today's the day! Your ${cohortName} starts today!</p>
        <p><strong>Time:</strong> 9:00 AM - 4:00 PM</p>
        <p><strong>Location:</strong> Digital 4 Africa Office, Delta Corner Annex, 4th Floor</p>
        <p>We're excited to see you soon!</p>
        <p>- D4A Team</p>
      `;

      await client.sendEmail({
        From: process.env.OPERATIONS_EMAIL,
        To: email,
        Subject: `Today: ${cohortName} Starts Now!`,
        HtmlBody: html,
      });

      console.log(`📧 Day-of reminder sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending day-of reminder:', error.message);
    }
  };