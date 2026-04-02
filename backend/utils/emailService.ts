import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  message: string,
  attachments?: any[]
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"Vehicle Advertising Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #000000; margin: 0; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #121212; border-radius: 16px; border: 1px solid #222222; overflow: hidden; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 40px 30px; background-color: #0A0A0A; border-bottom: 1px solid #222222;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                        VEHICLE <span style="color: #FACC15;">ADVERTISING</span>
                      </h1>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td align="center" style="padding: 40px 30px; color: #d4d4d8; font-size: 16px; line-height: 1.6;">
                      ${message}
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 25px 30px; background-color: #0A0A0A; border-top: 1px solid #222222;">
                      <p style="margin: 0; font-size: 12px; color: #71717a;">This is an automated message from the Vehicle Advertising Platform.<br/>Please do not reply directly to this email.</p>
                      <p style="margin: 10px 0 0 0; font-size: 12px; color: #52525b;">&copy; ${new Date().getFullYear()} Vehicle Advertising. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      attachments: attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

export const sendQuoteEmail = async (to: string, leadName: string, quote: any, pdfBuffer: Buffer) => {
  const message = `
    <div style="text-align: left; background-color: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #333;">
      <h3 style="color: #FACC15; margin-bottom: 20px; font-size: 20px; font-weight: 800;">OFFICIAL QUOTATION ENCLOSED</h3>
      <p style="color: #fff; margin-bottom: 15px;">Hello <strong>${leadName}</strong>,</p>
      <p style="color: #A1A1AA; margin-bottom: 25px;">Our team has analyzed your requirements and prepared a formal quotation for your advertising campaign. Please find the detailed invoice PDF attached to this email.</p>
      
      <div style="background-color: #000; padding: 15px; border-radius: 8px; border: 1px solid #FACC15; color: #FACC15; font-size: 13px; text-align: center; font-weight: 700;">
        TOTAL QUOTED VALUE: ₹${quote.quotedPrice.toLocaleString()} (Incl. GST)
      </div>
      
      <p style="color: #71717a; font-size: 13px; margin-top: 25px;">A digital copy of the quotation is attached for your records. Our representative will contact you shortly to discuss the next steps.</p>
    </div>
  `;
  return await sendEmail(to, `Official Quotation: VAP-QUO-${Date.now().toString().slice(-4)}`, message, [
    {
      filename: `Vehicle_Ad_Quote_${leadName.replace(/\s+/g, '_')}.pdf`,
      content: pdfBuffer
    }
  ]);
};
