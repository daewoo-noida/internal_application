exports.welcomeEmail = ({ name, email, password, loginUrl }) => `
<div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111;">
  
  <h2 style="margin-bottom:12px;">Welcome to Daewoo Sales Portal</h2>

  <p>Hi <strong>${name}</strong>,</p>

  <p>We’re excited to welcome you to the <strong>Daewoo Sales Portal</strong> — your centralized workspace for sales, clients, payments and team collaboration.</p>

  <p><strong>Your account is now successfully verified!</strong></p>

  <p>You can log in using the details below:</p>

  <p>
    <strong>Login Link:</strong> <a href="${loginUrl}" target="_blank">${loginUrl}</a><br/>
    <strong>Email ID:</strong> ${email}<br/>
    <strong>Password:</strong> ${password}
  </p>

  <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />

  <p><strong>Why Use This Portal?</strong></p>
  <ul>
    <li>Access brochures, product sheets & proposals</li>
    <li>Track leads, follow-ups & sales conversions</li>
    <li>Manage payments & collections easily</li>
    <li>Stay updated with announcements & internal updates</li>
    <li>Participate in scheduled team meetings</li>
  </ul>

  <p>If you need help at any time, our support team is ready to assist you.</p>
  
  <br/>
  <p>Regards,<br/>
  <strong>Team Daewoo</strong><br/>
  EBG Group</p>
</div>
`;

exports.otpEmail = ({ name, otp }) => `
<div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111;">

  <h2 style="margin-bottom:10px;">Your OTP Verification Code</h2>

  <p>Hi <strong>${name}</strong>,</p>

  <p>To complete your registration for the <strong>Daewoo Sales Portal</strong>, use the OTP below:</p>

  <h1 style="letter-spacing:4px; font-size:32px; font-weight:700;">${otp}</h1>

  <p>This OTP is valid for the next <strong>10 minutes</strong>.  
  Please do not share it with anyone.</p>

  <p>If you didn’t request this OTP, simply ignore this email.</p>

  <br/>
  <p>Regards,<br/>
  <strong>Team Daewoo</strong><br/>EBG Group</p>
</div>
`;


exports.resendOtpEmail = ({ name, otp }) => `
<div style="font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111;">

  <h2 style="margin-bottom:10px;">Your New OTP Code</h2>

  <p>Hi <strong>${name}</strong>,</p>

  <p>You requested a new OTP for verifying your <strong>Daewoo Sales Portal</strong> account.</p>

  <h1 style="letter-spacing:4px; font-size:32px; font-weight:700;">${otp}</h1>

  <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>

  <p>If you didn't request this, please ignore this message.</p>

  <br/>
  <p>Regards,<br/>
  <strong>Team Daewoo</strong><br/>EBG Group</p>
</div>
`;
