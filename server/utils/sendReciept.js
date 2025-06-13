import postmark from 'postmark';
import dotenv from 'dotenv';

dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

/**
 * Sends a payment receipt email to a student after enrollment.
 *
 * @param {Object} data
 * @param {string} data.fullName - Student's full name
 * @param {string} data.email - Student's email
 * @param {string} data.reference - Payment reference code
 * @param {number} data.amountPaid - Amount paid by the student
 * @param {number} data.totalPrice - Total price of the cohort
 * @param {string} data.cohortName - Name of the cohort
 * @param {number} data.balanceRemaining - Amount remaining to pay
 * @param {number} [data.discount] - Optional discount applied
 */
export const sendReceiptEmail = async ({
  fullName,
  email,
  startDate,
  reference,
  amountPaid,
  totalPrice,
  cohortName,
  balanceRemaining,
  discount
}) => {
  try {
    const receiptDate = new Date().toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formatCurrency = (amount) => `KES ${amount.toLocaleString()}`;

    const hasDiscount = discount && discount > 0;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
      </head>
      <body style="margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0069AA 0%, #E32726 100%); padding: 30px 40px; text-align: center; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.3);"></div>
            <img src="${process.env.LOGO_URL}" alt="Digital4africa" style="height: 45px; margin-bottom: 15px; background: rgba(255,255,255,0.95); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">PAYMENT RECEIPT</h1>
            <div style="background: rgba(255,255,255,0.2); height: 1px; margin: 20px auto 0; width: 80px; border-radius: 1px;"></div>
          </div>

          <!-- Content -->
          <div style="padding: 40px;">

            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
              <p style="color: #2d3748; font-size: 18px; margin: 0 0 8px; font-weight: 500;">Hi ${fullName},</p>
              <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.5;">Thank you for your payment towards <strong style="color: #2d3748;">${cohortName}</strong></p>
              <p style="color: #718096; font-size: 15px; margin: 8px 0 0; line-height: 1.5;">Starting on <strong style="color: #2d3748;">${startDate}</strong></p>
            </div>

            <!-- Receipt Details -->
            <table style="width: 100%; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 25px;">

                  <!-- Date & Reference -->
                  <table style="width: 100%; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e0;" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 50%; vertical-align: top;">
                        <div style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Receipt Date</div>
                        <div style="color: #2d3748; font-weight: 600;">${receiptDate}</div>
                      </td>
                      <td style="width: 50%; vertical-align: top; text-align: right;">
                        <div style="color: #a0aec0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Reference</div>
                        <div style="color: #2d3748; font-weight: 600; font-family: 'Courier New', monospace;">${reference}</div>
                      </td>
                    </tr>
                  </table>

                  <!-- Payment Breakdown -->
                  <table style="width: 100%;" cellpadding="0" cellspacing="0">

                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #4a5568; font-size: 15px;">Amount Paid</td>
                            <td style="color: #2d3748; font-weight: 600; font-size: 16px; text-align: right;">${formatCurrency(amountPaid)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    ${hasDiscount ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #38a169; font-size: 15px;">
                              <span style="display: inline-block; width: 8px; height: 8px; background: #38a169; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
                              Discount Applied
                            </td>
                            <td style="color: #38a169; font-weight: 600; font-size: 16px; text-align: right;">-${formatCurrency(discount)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ` : ''}

                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #4a5568; font-size: 15px;">Total Price</td>
                            <td style="color: #2d3748; font-weight: 600; font-size: 16px; text-align: right;">${formatCurrency(totalPrice)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Balance Remaining -->
                    <tr>
                      <td style="padding: 16px 0 0; border-top: 2px solid #0069AA; margin-top: 8px;">
                        <table style="width: 100%;" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color: #2d3748; font-size: 16px; font-weight: 600;">Balance Remaining</td>
                            <td style="color: ${balanceRemaining > 0 ? '#e53e3e' : '#38a169'}; font-weight: 700; font-size: 18px; text-align: right;">
                              ${balanceRemaining > 0 ? formatCurrency(balanceRemaining) : 'FULLY PAID ✓'}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>

            <!-- Support Message -->
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #ebf8ff 0%, #f0fff4 100%); border-radius: 8px; border-left: 4px solid #0069AA;">
              <p style="color: #2d3748; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>Need help?</strong> If you have any questions or need support, feel free to reply to this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; text-align: center; padding-top: 25px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 15px; margin: 0; line-height: 1.6;">
                Warm regards,<br />
                <strong style="color: #2d3748;">D4A Academy Team</strong>
              </p>
            </div>

          </div>

          <!-- Bottom Border -->
          <div style="height: 4px; background: linear-gradient(90deg, #0069AA 0%, #E32726 100%);"></div>
        </div>

        <!-- Decorative Elements -->
        <div style="text-align: center; margin-top: 20px;">
          <div style="display: inline-block; width: 40px; height: 2px; background: rgba(255,255,255,0.3); border-radius: 1px;"></div>
        </div>
      </body>
      </html>
    `;

    const text = `Payment Receipt for ${fullName}:\n\nDate: ${receiptDate}\nReference: ${reference}\nAmount Paid: ${formatCurrency(amountPaid)}\n${hasDiscount ? `Discount: ${formatCurrency(discount)}\n` : ''}Total Price: ${formatCurrency(totalPrice)}\nBalance Remaining: ${balanceRemaining > 0 ? formatCurrency(balanceRemaining) : 'No balance (Fully Paid)'}\n\n— D4A Team`;

    await client.sendEmail({
      From: process.env.OPERATIONS_EMAIL,
      To: email,
      Subject: `Payment Receipt – ${cohortName}`,
      HtmlBody: html,
      TextBody: text,
    });

    console.log(`📨 Receipt sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending receipt email:', error.message);
  }
};