import postmark from 'postmark';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

// Function to generate PDF receipt
const generateReceiptPDF = async ({
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
  const receiptDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formatCurrency = (amount) => `KES ${amount.toLocaleString()}`;
  const hasDiscount = discount && discount > 0;

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Receipt</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: #fff;
          padding: 40px;
        }

        .receipt {
          max-width: 600px;
          margin: 0 auto;
          border: 2px solid #0069AA;
          padding: 30px;
        }

        .header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #0069AA;
        }

        .header-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .header-text {
          flex: 1;
        }

        .company-logo {
          height: 40px;
          width: auto;
          margin-left: 15px;
          margin-top: 2px;
          opacity: 0.9;
        }

        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #0069AA;
          margin-bottom: 8px;
          letter-spacing: 1.5px;
        }

        .company-address {
          font-size: 10px;
          color: #666;
          line-height: 1.3;
        }

        .receipt-title {
          font-size: 16px;
          font-weight: bold;
          color: #0069AA;
          margin-bottom: 5px;
          text-align: center;
        }

        .receipt-number {
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        .divider {
          border-top: 1px solid #ccc;
          margin: 20px 0;
        }

        .section {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #0069AA;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }

        .info-label {
          font-weight: bold;
          color: #333;
        }

        .info-value {
          color: #000;
        }

        .charges-section {
          background: #f8f9fa;
          padding: 15px;
          border: 1px solid #ddd;
        }

        .charge-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 3px 0;
        }

        .total-row {
          border-top: 2px solid #0069AA;
          margin-top: 15px;
          padding-top: 10px;
          font-weight: bold;
          font-size: 14px;
        }

        .balance-paid {
          color: #28a745;
        }

        .balance-remaining {
          color: #dc3545;
        }

        .discount {
          color: #28a745;
        }

        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
          font-size: 11px;
          color: #666;
        }

        .contact-info {
          margin-top: 10px;
          line-height: 1.6;
        }

        .thank-you {
          font-size: 12px;
          color: #0069AA;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="header-container">
            <div class="header-text">
              <div class="company-name">DIGITAL 4 AFRICA</div>
              <div class="company-address">
                Delta Corner Annex, 4th Floor<br>
                Opposite Westlands Stage, Waiyaki Way<br>
                Nairobi, Kenya
              </div>
            </div>
            <img src="${process.env.LOGO_URL}" class="company-logo" alt="Digital 4 Africa Logo">
          </div>
          <div class="receipt-title">OFFICIAL RECEIPT</div>
          <div class="receipt-number">Receipt #: ${reference}</div>
        </div>

        <div class="section">
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${receiptDate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Customer:</span>
            <span class="info-value">${fullName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${email}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <div class="section-title">Payment Details</div>
          <div class="info-row">
            <span class="info-label">Course:</span>
            <span class="info-value">${cohortName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Course Start Date:</span>
            <span class="info-value">${formattedStartDate}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <div class="section-title">Charges</div>
          <div class="charges-section">
            <div class="charge-row">
              <span>Course Fee:</span>
              <span>${formatCurrency(totalPrice)}</span>
            </div>

            ${hasDiscount ? `
            <div class="charge-row discount">
              <span>Discount Applied:</span>
              <span>-${formatCurrency(discount)}</span>
            </div>
            ` : ''}

            <div class="charge-row">
              <span>Amount Paid:</span>
              <span>${formatCurrency(amountPaid)}</span>
            </div>

            <div class="charge-row total-row ${balanceRemaining > 0 ? 'balance-remaining' : 'balance-paid'}">
              <span>Balance Remaining:</span>
              <span>${balanceRemaining > 0 ? formatCurrency(balanceRemaining) : 'FULLY PAID ✓'}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="thank-you">Thank you for choosing Digital 4 Africa</div>
          <div class="contact-info">
            Phone: +254 743830663<br>
            Email: hello@digital4africa.com<br>
            Website: digital4africa.com
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--no-zygote'
    ]
  });

  const page = await browser.newPage();
  await page.setContent(receiptHTML, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px'
    }
  });

  await browser.close();

  return pdfBuffer;
};

// Email function remains exactly the same
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
    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPDF({
      fullName,
      email,
      startDate,
      reference,
      amountPaid,
      totalPrice,
      cohortName,
      balanceRemaining,
      discount
    });

    // Simple email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Dear ${fullName},</p>

        <p>We confirm receipt of your payment for <strong>${cohortName}</strong>. Please find the official receipt attached.</p>

        <p>Regards,<br>
        D4A Team</p>
      </body>
      </html>
    `;

    const emailText = `Dear ${fullName},

We confirm receipt of your payment for ${cohortName}. Please find the official receipt attached.

Regards,
D4A Team`;

    // Send email with PDF attachment
    await client.sendEmail({
      From: process.env.OPERATIONS_EMAIL,
      To: email,
      Subject: 'Receipt - Payment Confirmation',
      HtmlBody: emailHTML,
      TextBody: emailText,
      Attachments: [
        {
          Name: `Receipt_${reference}.pdf`,
          Content: Buffer.from(pdfBuffer).toString('base64'),
          ContentType: 'application/pdf'
        }
      ]
    });

    console.log(`📨 Receipt email with PDF sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending receipt email:', error.message);
    throw error;
  }
};