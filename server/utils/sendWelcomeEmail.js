import dotenv from 'dotenv';
import postmark from 'postmark';

dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

export const sendEnrollmentConfirmationEmail = async ({
	fullName,
	email,
	cohortName,
	startDate,
}) => {

	console.log("startDate: ", startDate);


	try {
		const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});


		const html = `
     <!DOCTYPE html>
     <html>
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Enrollment Confirmation</title>
     </head>
     <body style="margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
       <div style="max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

         <!-- Header -->
         <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
           <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.3);"></div>
           <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
           <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">ENROLLMENT CONFIRMED</h1>
           <div style="background: rgba(255,255,255,0.2); height: 1px; margin: 20px auto 0; width: 80px; border-radius: 1px;"></div>
         </div>

         <!-- Content -->
         <div style="padding: 20px;">

           <!-- Greeting -->
           <div style="margin-bottom: 30px;">
             <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
             <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">🎉 <strong style="color: #38a169;">Congratulations!</strong> You have successfully enrolled in <strong style="color: #2d3748;">${cohortName}</strong></p>
           </div>

           <!-- Class Details -->
           <table style="width: 100%; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;" cellpadding="0" cellspacing="0">
             <tr>
               <td style="padding: 25px;">

                 <!-- Start Date -->
                 <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px dashed #cbd5e0;">
                   <div style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">📅 Class Starts</div>
                   <div style="color: #2d3748; font-weight: 600; font-size: 18px;">${formattedStartDate}</div>
                   <div style="color: #718096; font-size: 14px; margin-top: 4px;">9:00 AM - 4:00 PM (Both Days)</div>
                 </div>

                 <!-- What to Bring -->
                 <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px dashed #cbd5e0;">
                   <div style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">📝 What to Bring</div>
                   <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                     • Your laptop<br/>
                     • A pen and notebook<br/>
                     • Ready to learn mindset!
                   </div>
                 </div>

                 <!-- Location -->
                 <div style="margin-bottom: 25px;">
                   <div style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">📍 Location</div>
                   <div style="color: #2d3748; font-weight: 600; margin-bottom: 8px;">Digital 4 Africa Office</div>
                   <div style="color: #4a5568; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
                     Delta Corner Annex, 4th Floor<br/>
                     Opposite Westlands Stage, Waiyaki Way<br/>
                     (Building with BMW Centre & PWC)
                   </div>
                   <a href="https://g.page/Digital4Africa?share" style="display: inline-block; background: #0069AA; color: #ffffff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500;">📍 View on Google Maps</a>
                 </div>

               </td>
             </tr>
           </table>

           <!-- Parking Instructions -->
           <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #ebf8ff 0%, #f0fff4 100%); border-radius: 8px; border-left: 4px solid #0069AA;">
             <div style="color: #2d3748; font-weight: 600; font-size: 15px; margin-bottom: 8px;">🚗 Parking Instructions</div>
             <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
               Ask guards to direct you to <strong>Nairobi Garage Parking</strong> on Floor P1. Visitors' parking is to your left after the barrier. Then take the lift to the 4th floor and ask for Digital 4 Africa.
             </div>
           </div>

           <!-- Taxi/Matatu -->
           <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #fef5e7 0%, #f0fff4 100%); border-radius: 8px; border-left: 4px solid #E32726;">
             <div style="color: #2d3748; font-weight: 600; font-size: 15px; margin-bottom: 8px;">🚕 Coming by Taxi/Matatu?</div>
             <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
               Use the front entrance along Waiyaki Way opposite Naivas. Guards will direct you to Delta Corner Annex behind the main towers.
             </div>
           </div>

           <!-- Reminder Notice -->
           <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
             <div style="color: #2d3748; font-weight: 600; font-size: 15px; margin-bottom: 8px;">📧 Upcoming Reminders</div>
             <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
               Don't worry about forgetting! We'll send you reminder emails as the class date approaches with additional details and updates.
             </div>
           </div>

           <!-- Meals -->
           <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #f0fff4 0%, #ebf8ff 100%); border-radius: 8px; border-left: 4px solid #38a169;">
             <div style="color: #2d3748; font-weight: 600; font-size: 15px; margin-bottom: 8px;">🍽️ Meals Provided</div>
             <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
               Snacks, lunch, and bottomless tea & coffee will be provided throughout both days. We'll ask for your lunch preferences closer to the date.
             </div>
           </div>

           <!-- Footer -->
           <div style="margin-top: 40px; text-align: center; padding-top: 25px; border-top: 1px solid #e2e8f0;">
             <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.6;">
               We can't wait to see you there!<br />
               <strong style="color: #2d3748;">D4A Masterclass Team</strong>
             </p>
           </div>

         </div>

         <!-- Bottom Border -->
         <div style="height: 4px; background: linear-gradient(90deg, #0069AA 0%, #E32726 100%);"></div>
       </div>
     </body>
     </html>
   `;

		const text = `Enrollment Confirmation for ${fullName}:\n\nCongratulations! You have successfully enrolled in ${cohortName}.\n\nClass Details:\n- Start Date: ${startDate}\n- Time: 9:00 AM - 4:00 PM (Both Days)\n- Location: Digital 4 Africa Office, Delta Corner Annex, 4th Floor\n\nWhat to Bring:\n- Your laptop\n- A pen and notebook\n\nParking: Ask guards for Nairobi Garage Parking on Floor P1\nTaxi/Matatu: Use front entrance along Waiyaki Way opposite Naivas\n\nMeals and snacks will be provided. We'll send reminder emails as the class approaches.\n\n— D4A Team`;

		await client.sendEmail({
			From: process.env.OPERATIONS_EMAIL,
			To: email,
			Subject: `Welcome to ${cohortName} - You're All Set! 🎉`,
			HtmlBody: html,
			TextBody: text,
		});

		console.log(`🎉 Enrollment confirmation sent to ${email}`);
	} catch (error) {
		console.error('❌ Error sending enrollment confirmation email:', error.message);
	}
};