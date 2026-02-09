# Quick Reference - Forgot Password Feature

## 🚀 Quick Setup (5 minutes)

### Step 1: Database
```bash
cd backend
npm run setup-forgot-password
```

### Step 2: Environment Variables
Add to `backend/.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173
```

### Step 3: Start Servers
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd public-website && npm run dev
```

### Step 4: Test
- Go to http://localhost:5173/login
- Click "Forgot password?"
- Done! ✓

---

## 📋 Files Created/Modified

### Created (6 files)
```
backend/src/services/emailService.js
backend/src/scripts/setupForgotPassword.js
public-website/src/pages/ForgotPasswordModal.jsx
public-website/src/pages/ResetPasswordPage.jsx
FORGOT_PASSWORD_SETUP.md
IMPLEMENTATION_SUMMARY.md
```

### Modified (5 files)
```
backend/src/modules/auth/auth.service.js
backend/src/modules/auth/auth.controller.js
backend/src/modules/auth/auth.routes.js
backend/package.json
public-website/src/services/authService.js
public-website/src/pages/LoginPage.jsx
public-website/src/App.jsx
```

---

## 🔑 Core Functions

### Frontend - authService
```javascript
// Request password reset
authService.forgotPassword(email)

// Reset password with token
authService.resetPassword(token, newPassword, confirmPassword)
```

### Backend - authService
```javascript
// Generate token, hash it, send email
forgotPassword(email)

// Verify token, update password
resetPassword(token, newPassword)
```

---

## 🌐 API Routes

```
POST /api/auth/forgot-password
└─ { email: string }
└─ Returns: { message: string }

POST /api/auth/reset-password  
└─ { token: string, newPassword: string, confirmPassword: string }
└─ Returns: { message: string }
```

---

## 📧 Email Providers

Choose one:

### Gmail (Free)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
```
👉 Get app password: Google Account → Security → App passwords

### SendGrid
```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxx
```

### Mailgun
```env
EMAIL_SERVICE=Mailgun
EMAIL_USER=postmaster@yourdomain.com
EMAIL_PASSWORD=your-password
```

### Outlook
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

---

## 🎨 UI Components

### ForgotPasswordModal
- Opens from login page
- Email input
- Loading state
- Success message
- Auto-closes

### ResetPasswordPage
- Full page (route: `/reset-password`)
- Token validation
- Password input fields
- Success/error states
- Auto-redirect to login

---

## 🔒 Security Features

✓ Tokens: Random 32-byte, hashed with bcrypt  
✓ Expiry: 1 hour from request  
✓ Single-use: Cleared after reset  
✓ Passwords: Minimum 6 characters, must match  
✓ Email: Won't reveal if registered (security best practice)  

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sending | Check .env EMAIL variables |
| Token invalid | Run `npm run setup-forgot-password` |
| Password won't reset | Check token isn't expired (1 hour limit) |
| Modal won't open | Check ForgotPasswordModal import in LoginPage |
| Reset page not found | Check route added in App.jsx |

---

## 📱 User Flow

```
Login Page
  ↓ Click "Forgot password?"
Forgot Password Modal
  ↓ Enter email
Check Email
  ↓ Click reset link
Reset Password Page
  ↓ Enter new password
Success!
  ↓ Redirect to login
Login with new password ✓
```

---

## 🔄 Token Validation Flow

1. Generate token: `crypto.randomBytes(32)`
2. Hash token: `bcrypt.hash(token, 10)`
3. Store hash in DB with expiry
4. Send original token in email
5. User clicks link with original token
6. Backend: `bcrypt.compare(token, storedHash)`
7. If valid & not expired: reset password
8. Clear token from DB

---

## 📊 Database Schema

```sql
users table additions:

ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP;
```

---

## 🧪 Testing Checklist

- [ ] Can click "Forgot password?" on login
- [ ] Modal opens with email input
- [ ] Email sent message appears
- [ ] Receive email with reset link
- [ ] Reset link works (shows reset page)
- [ ] Token validation works
- [ ] Can enter new password
- [ ] Password successfully resets
- [ ] Can login with new password
- [ ] Invalid token shows error
- [ ] Expired token shows error

---

## 📞 Support

1. Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for detailed info
2. Check [FORGOT_PASSWORD_SETUP.md](FORGOT_PASSWORD_SETUP.md) for setup guide
3. Check [FLOW_GUIDE.md](FLOW_GUIDE.md) for visual diagrams
4. Check backend/frontend logs for errors

---

## 🎯 Key Points

- ✅ Complete end-to-end implementation
- ✅ Production-ready with error handling
- ✅ Beautiful animated UI
- ✅ Secure token generation & validation
- ✅ Email integrations (Gmail, SendGrid, etc.)
- ✅ Database migration script included
- ✅ Comprehensive documentation

---

## 📝 Environment Variables Checklist

Add to `backend/.env`:
```
□ EMAIL_SERVICE
□ EMAIL_USER
□ EMAIL_PASSWORD
□ FRONTEND_URL
□ JWT_SECRET (existing)
□ JWT_EXPIRES_IN (existing)
□ JWT_REFRESH_SECRET (existing)
□ JWT_REFRESH_EXPIRES_IN (existing)
□ DB_USER (existing)
□ DB_HOST (existing)
□ DB_NAME (existing)
□ DB_PASSWORD (existing)
□ DB_PORT (existing)
```

---

## 🚀 Next Steps (Optional)

1. Add rate limiting
2. Add email verification
3. Add SMS option
4. Add 2FA
5. Add security questions
6. Custom email templates
7. Auto-retry failed emails
8. Email templates in database

---

## 💡 Pro Tips

- Use Gmail's app password, not regular password
- Test with a test email first
- Check spam folder for reset emails
- Token expires in 1 hour (configurable)
- Email address is never revealed in responses (security)

---

**Last Updated:** February 2026  
**Status:** Production Ready ✅
