import postmark from 'postmark';
import dotenv from 'dotenv';

dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export const sendOneWeekReminderEmail = async ({ fullName, email, cohortName, startDate }) => {
  try {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>One Week Reminder</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div class="email-container" style="width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
            <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">ONE WEEK TO GO!</h1>
          </div>

          <div style="padding: 20px;">
            <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
            <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">It's just a week to the <strong>${cohortName}</strong>! The class runs on <strong>${formattedStartDate}</strong> from <strong>8:30 AM - 5:00 PM</strong>.</p>

            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <h3 style="color: #0069AA; margin: 0 0 10px;">📝 What to Bring</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                <li>Your laptop</li>
                <li>A pen and notebook</li>
                <li>Ready-to-learn mindset!</li>
              </ul>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <h3 style="color: #0069AA; margin: 0 0 10px;">📍 Location</h3>
              <p style="color: #4a5568; margin: 0 0 10px;"><strong>Digital 4 Africa Office</strong><br>Delta Corner Annex, 4th Floor<br>Opposite Westlands Stage, Waiyaki Way</p>
              <a href="https://g.page/Digital4Africa?share" style="display: inline-block; background: #0069AA; color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-top: 10px;">View on Google Maps</a>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #ebf8ff; border-radius: 8px; border-left: 4px solid #0069AA;">
              <h3 style="color: #2d3748; margin: 0 0 10px;">🚗 Parking Instructions</h3>
              <p style="color: #4a5568; margin: 0;">Ask guards to direct you to <strong>Nairobi Garage Parking</strong> on Floor P1. Visitors' parking is to your left after the barrier.</p>
            </div>

            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">We can't wait to see you there!<br><strong>D4A Masterclass Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
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

export const sendTwoDayReminderEmail = async ({ fullName, email, cohortName, startDate }) => {
  try {
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Two Day Reminder</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div class="email-container" style="width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
            <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">REMINDER: CLASS STARTS SOON!</h1>
          </div>

          <div style="padding: 20px;">
            <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
            <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">Less than 48 hours until <strong>${cohortName}</strong>! Please arrive by <strong>8:30 AM</strong> on <strong>${formattedStartDate}</strong>.</p>

            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <h3 style="color: #0069AA; margin: 0 0 10px;">📍 Location</h3>
              <p style="color: #4a5568; margin: 0 0 10px;"><strong>Delta Corner Annex, 4th Floor</strong><br>Opposite Westlands Stage, Waiyaki Way<br>(Building with BMW Centre & PWC)</p>
              <a href="https://g.page/Digital4Africa?share" style="display: inline-block; background: #0069AA; color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; margin-top: 10px;">View on Google Maps</a>
            </div>

            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">See you soon!<br><strong>D4A Masterclass Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await client.sendEmail({
      From: process.env.OPERATIONS_EMAIL,
      To: email,
      Subject: `Important Reminder: ${cohortName} Starts Soon!`,
      HtmlBody: html,
    });

    console.log(`📧 Two-day reminder sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending two-day reminder:', error.message);
  }
};

export const sendDayOfReminderEmail = async ({ fullName, email, cohortName, startDate }) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Day Of Reminder</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div class="email-container" style="width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
            <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">TODAY'S THE DAY!</h1>
          </div>

          <div style="padding: 20px;">
            <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
            <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">Your <strong>${cohortName}</strong> starts today at <strong>8:30 AM</strong>!</p>

            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <h3 style="color: #0069AA; margin: 0 0 10px;">📶 WIFI Access</h3>
              <p style="color: #4a5568; margin: 0;"><strong>Network:</strong> Nairobi Garage<br><strong>Password:</strong> COWORK@NG</p>
            </div>

            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">Let's make today amazing!<br><strong>D4A Masterclass Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
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

export const sendSecondDayReminderEmail = async ({ fullName, email, cohortName }) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Second Day Reminder</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div class="email-container" style="width: 100%; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
            <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">DAY 2: LET'S KEEP GOING!</h1>
          </div>

          <div style="padding: 20px;">
            <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
            <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">Hope you enjoyed Day 1 of <strong>${cohortName}</strong>! Here's what's coming today:</p>

            <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
              <h3 style="color: #0069AA; margin: 0 0 10px;">📚 Today's Topics</h3>
              <p style="color: #4a5568; margin: 0;">We'll continue with more exciting content today!</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #ebf8ff; border-radius: 8px; border-left: 4px solid #0069AA;">
              <h3 style="color: #2d3748; margin: 0 0 10px;">🎓 Free 30-Day Mentorship</h3>
              <p style="color: #4a5568; margin: 0;">Ask questions anytime for the next month! Reach out to Caleb or Chelsea.</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #f0fff4; border-radius: 8px; border-left: 4px solid #38a169;">
              <h3 style="color: #2d3748; margin: 0 0 10px;">📢 Tell A Friend</h3>
              <p style="color: #4a5568; margin: 0 0 10px;">If you know anyone who's interested in joining this masterclass, please share these links:</p>
              <p style="color: #4a5568; margin: 0 0 5px;"><a href="https://digital4africa.com/mc/" style="color: #0069AA;">Masterclass Information</a></p>
              <p style="color: #4a5568; margin: 0;"><a href="https://masterclass.digital4africa.com/" style="color: #0069AA;">Registration for next class</a></p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #fef5e7; border-radius: 8px; border-left: 4px solid #E32726;">
              <h3 style="color: #2d3748; margin: 0 0 10px;">⭐ Give Us a 5-star Rating</h3>
              <p style="color: #4a5568; margin: 0 0 10px;">Enjoying the class? Please take a moment to give us a review:</p>
              <p style="color: #4a5568; margin: 0;"><a href="https://g.page/r/Cey0F9ks65yHEAI/review" style="color: #0069AA;">Leave a Google Review</a></p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3 style="color: #2d3748; margin: 0 0 10px;">📱 Follow Us</h3>
              <p style="color: #4a5568; margin: 0 0 10px;">Stay updated with D4A:</p>
              <a href="https://www.instagram.com/digital4africa/" style="display: inline-block; margin-right: 10px; color: #0069AA;">Instagram</a>
              <a href="https://www.linkedin.com/company/digital-for-africa/" style="display: inline-block; margin-right: 10px; color: #0069AA;">LinkedIn</a>
              <a href="https://x.com/Digital4Africa" style="display: inline-block; color: #0069AA;">X</a>
            </div>

            <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">Let's make Day 2 even better!<br><strong>D4A Masterclass Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await client.sendEmail({
      From: process.env.OPERATIONS_EMAIL,
      To: email,
      Subject: `Day 2: ${cohortName} Continues!`,
      HtmlBody: html,
    });

    console.log(`📧 Second-day reminder sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending second-day reminder:', error.message);
  }
};