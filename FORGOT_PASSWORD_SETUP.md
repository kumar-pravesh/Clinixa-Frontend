# Forgot Password Feature - Setup Guide

## Overview
This implementation adds a complete forgot password flow to the application with email reset functionality.

## Database Schema Changes

### Add columns to the `users` table:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
```

## Environment Variables Setup

### Backend (.env file)
Add or update these variables in your backend `.env` file:

```env
# Email Service Configuration (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Or for other email services:
# EMAIL_SERVICE=outlook
# EMAIL_USER=your-email@outlook.com
# EMAIL_PASSWORD=your-password

# Frontend URL (used in password reset email links)
FRONTEND_URL=http://localhost:5173
```

## Using Gmail with App Password
1. Enable 2-factor authentication on your Google account
2. Go to Google Account → Security → App passwords
3. Select "Mail" and "Windows Computer" (or your device)
4. Generate the app password
5. Use this password in EMAIL_PASSWORD

## Email Service Alternatives

### Using SendGrid:
```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxx
```

### Using Mailgun:
```env
EMAIL_SERVICE=Mailgun
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
```

## Frontend Flow

### 1. Login Page
- User clicks "Forgot password?" link
- ForgotPasswordModal opens
- User enters their email
- Email with reset link is sent

### 2. Reset Password Page
- User clicks the link in the email
- ResetPasswordPage loads with the reset token
- User enters new password
- Password is successfully reset
- User is redirected to login

## Backend Endpoints

### POST /api/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If this email is registered, you will receive a password reset link"
}
```

### POST /api/auth/reset-password
**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## Components Created

### Frontend
- **ForgotPasswordModal.jsx** - Modal for entering email
- **ResetPasswordPage.jsx** - Page for resetting password with token

### Backend
- **emailService.js** - Email sending functionality
- **auth.service.js** - Updated with forgotPassword and resetPassword methods
- **auth.controller.js** - Updated with new endpoints

## Testing the Feature

1. **Start Backend:**
   ```bash
   cd backend
   npm install nodemailer
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd public-website
   npm run dev
   ```

3. **Test Flow:**
   - Go to http://localhost:5173/login
   - Click "Forgot password?"
   - Enter a registered email
   - Check email for reset link
   - Click link and enter new password
   - Login with new credentials

## Security Notes

- Reset tokens expire after 1 hour
- Reset tokens are hashed before storing in database
- Tokens are single-use (cleared after reset)
- Email verification uses standard bcrypt hashing
- Frontend URL for reset links should be configurable via .env

## Troubleshooting

### Emails not sending?
1. Check EMAIL_USER and EMAIL_PASSWORD in .env
2. For Gmail, ensure App Password is used (not regular password)
3. Check backend logs for nodemailer errors

### Reset link expired?
- Token validity is set to 1 hour in emailService.js
- User should request a new reset link

### Token validation failed?
- Ensure reset_token and reset_token_expiry columns exist in database
- Clear reset_token data may be corrupted

## Future Enhancements

1. Add rate limiting to prevent email spam
2. Add resend reset email option
3. Add user confirmation before password change
4. Add password strength validation
5. Add account lockout after failed reset attempts
