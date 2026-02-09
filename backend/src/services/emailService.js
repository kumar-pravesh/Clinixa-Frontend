const nodemailer = require('nodemailer');

// Configure Nodemailer - Update these with your email service credentials
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendPasswordResetEmail = async (email, resetToken, userName) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - Clinixa Hospital Management',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #2a9b8e 0%, #ff6b6b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">Password Reset Request</h1>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #333;">Hello ${userName || 'User'},</p>
                    
                    <p style="font-size: 14px; color: #666; line-height: 1.6;">
                        We received a request to reset the password for your Clinixa Hospital Management account. 
                        If you did not request this, you can safely ignore this email.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #2a9b8e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="font-size: 12px; color: #999;">
                        Or copy this link: <br/>
                        <span style="word-break: break-all;">${resetLink}</span>
                    </p>
                    
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">
                        This link will expire in 1 hour.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        `,
    };
    
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset email');
    }
};

module.exports = {
    sendPasswordResetEmail,
};
