const sendAdminNotification = async (client, createdByUser) => {
    try {

        const adminEmail = "help@daewooappliances.in";

        const subject = `New Client Created: ${client.name}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
                    .header { background: #0070b9; color: white; padding: 15px; text-align: center; }
                    .content { padding: 20px; }
                    .info-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #333; }
                    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Client Created</h2>
                    </div>
                    <div class="content">
                        <p>A new client has been created in the system.</p>
                        
                        <div class="info-row">
                            <span class="label">Client Name:</span> ${client.name}
                        </div>
                        <div class="info-row">
                            <span class="label">Client Email:</span> ${client.email}
                        </div>
                        <div class="info-row">
                            <span class="label">Client Phone:</span> ${client.phone}
                        </div>
                        <div class="info-row">
                            <span class="label">Franchise Type:</span> ${client.franchiseType}
                        </div>
                        <div class="info-row">
                            <span class="label">Deal Amount:</span> ₹${client.dealAmount}
                        </div>
                        <div class="info-row">
                            <span class="label">Created By:</span> ${createdByUser.name} (${createdByUser.designation})
                        </div>
                        <div class="info-row">
                            <span class="label">Creation Date:</span> ${new Date().toLocaleString('en-IN')}
                        </div>
                        
                        <p style="margin-top: 20px;">
                            <a href="https://daewooebg.com/admin/client/${client._id}" 
                               style="background: #0070b9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                View Client Details
                            </a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Daewoo Appliances CRM System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendEmail({
            to: adminEmail,
            subject: subject,
            html: html
        });

        console.log("Admin notification email sent successfully");
    } catch (error) {
        console.error("Error sending admin notification:", error);
    }
};