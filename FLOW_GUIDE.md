# Forgot Password Feature - Visual Flow Guide

## User Journey

```
LOGIN PAGE
    ↓
User clicks "Forgot password?"
    ↓
FORGOT PASSWORD MODAL
    ├─ Enter email
    ├─ Click "Send Reset Link"
    └─ Validation & Email sent
         ↓
    USER'S EMAIL
         ↓
    Receives: "Reset your password"
    Click link → [Reset Token in URL]
         ↓
    RESET PASSWORD PAGE
         ├─ New Password
         ├─ Confirm Password
         └─ Click "Reset Password"
              ↓
         Backend validates:
         ├─ Token is valid
         ├─ Token not expired
         ├─ Passwords match
         └─ Passwords are strong enough
              ↓
         Password updated in database
              ↓
    SUCCESS MESSAGE
         ↓
    Redirect to LOGIN (2 seconds)
         ↓
    LOGIN WITH NEW PASSWORD ✓
```

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                                                          │
│  LoginPage                                              │
│  └─ Shows "Forgot password?" button                     │
│     └─ Opens ForgotPasswordModal                        │
│        └─ Takes email input                             │
│        └─ Calls authService.forgotPassword()            │
│                                                          │
│  ResetPasswordPage                                      │
│  └─ Gets token from URL query parameter                │
│  └─ Takes new password input                           │
│  └─ Calls authService.resetPassword()                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
            ↓ API Calls ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js)                       │
│                                                          │
│  POST /auth/forgot-password                             │
│  └─ authController.forgotPassword()                    │
│     └─ authService.forgotPassword(email)                │
│        ├─ Check if user exists                          │
│        ├─ Generate reset token (crypto)                 │
│        ├─ Hash token (bcrypt)                           │
│        ├─ Store in database with 1-hour expiry          │
│        └─ Send email with reset link                    │
│                                                          │
│  POST /auth/reset-password                              │
│  └─ authController.resetPassword()                     │
│     └─ authService.resetPassword(token, password)       │
│        ├─ Find user by token                            │
│        ├─ Verify token is valid & not expired           │
│        ├─ Hash new password (bcrypt)                    │
│        ├─ Update database                               │
│        └─ Clear reset token                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
            ↓ Communicates via ↓
┌─────────────────────────────────────────────────────────┐
│                   EMAIL SERVICE                          │
│                                                          │
│  nodemailer + Chosen Email Provider                     │
│  (Gmail, SendGrid, Mailgun, Outlook, etc.)              │
│                                                          │
│  Creates & sends HTML email with:                       │
│  - Reset link with token                                │
│  - Professional template                                │
│  - Expiry information (1 hour)                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
            ↓ Stores data in ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                  │
│                                                          │
│  users table:                                           │
│  ├─ reset_token (hashed)                                │
│  └─ reset_token_expiry (timestamp)                      │
│     └─ Set to NOW() + 1 hour                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Component Interactions

```
┌──────────────────────────┐
│     LoginPage            │
│  ┌──────────────────┐   │
│  │ Forgot password? │◄──┼──── Opens
│  │    (button)      │   │
│  └────────┬─────────┘   │
│           │             │
│         Opens            │
│           │             │
│  ┌────────▼──────────┐  │
│  │ ForgotPassword    │  │
│  │ Modal             │  │
│  │ ┌──────────────┐  │  │
│  │ │ Email input  │  │  │
│  │ ├──────────────┤  │  │
│  │ │ Send button  │  │  │
│  │ └──────────────┘  │  │
│  └────────┬──────────┘  │
│           │             │
│        Calls API         │
│           │             │
│  POST /auth/forgot-password
│           │             │
│        Returns          │
│           │             │
│  ┌────────▼──────────┐  │
│  │ Success message   │  │
│  │ Check your email  │  │
│  │ Close modal       │  │
│  └───────────────────┘  │
└──────────────────────────┘

┌──────────────────────────┐
│   ResetPasswordPage      │
│  ┌──────────────────┐   │
│  │ New password     │   │
│  ├──────────────────┤   │
│  │ Confirm password │   │
│  ├──────────────────┤   │
│  │ Reset button     │   │
│  └────────┬─────────┘   │
│           │             │
│        Calls API         │
│           │             │
│  POST /auth/reset-password
│           │             │
│        Returns          │
│           │             │
│  ┌────────▼──────────┐  │
│  │ Success message   │  │
│  │ Redirecting...    │  │
│  │ Go to login       │  │
│  └───────────────────┘  │
└──────────────────────────┘
```

## Data Flow - Forgot Password

```
User Email Input
       ↓
   ↓ Frontend ↓
POST /auth/forgot-password
       ↓
   ↓ Backend ↓
authService.forgotPassword()
       ├─ Query database for user
       ├─ Generate crypto token
       ├─ Hash token with bcrypt
       ├─ Store in database:
       │  └─ reset_token (hashed)
       │  └─ reset_token_expiry (NOW + 1 hour)
       └─ Send email
       
User's Email Inbox
       ↓
HTML Email with reset link
└─ /reset-password?token=xxxxx
```

## Data Flow - Reset Password

```
Token from URL + New Password
       ↓
   ↓ Frontend ↓
POST /auth/reset-password
{token, newPassword, confirmPassword}
       ↓
   ↓ Backend ↓
authService.resetPassword()
       ├─ Query all users with reset_token
       ├─ Check each token hash with crypto
       ├─ Verify token hasn't expired
       ├─ Hash new password with bcrypt
       ├─ UPDATE users:
       │  ├─ password_hash = new hashed password
       │  ├─ reset_token = NULL
       │  └─ reset_token_expiry = NULL
       └─ Return success
       
User can now login with new password ✓
```

## Security Token Process

```
1. GENERATION (Backend)
   ├─ crypto.randomBytes(32).toString('hex')
   └─ Creates 64-character random string
   
2. HASHING (Backend)
   ├─ bcrypt.hash(token, 10)
   └─ Creates salted hash for storage
   
3. STORAGE (Database)
   ├─ Stores hashed token (never plaintext)
   └─ Stores expiry time (1 hour from now)
   
4. EMAIL (Backend)
   ├─ Includes original token in URL
   │  └─ /reset-password?token=xxxxx
   └─ Hashed version stays in database
   
5. VERIFICATION (Backend)
   ├─ User submits original token from URL
   ├─ bcrypt.compare(token, hashedToken)
   ├─ Checks expiry timestamp
   └─ If valid, reset password and clear token
```

## Timeline

```
1. User requests reset (t=0)
   └─ Token expires at t=3600 seconds (1 hour)

2. User clicks email link (t<3600)
   └─ Can still reset password

3. User clicks email link (t>3600)
   └─ Token has expired
   └─ Must request new reset

4. After successful reset
   └─ Token is cleared from database
   └─ Token becomes invalid for future use
```

## Error Scenarios Handled

```
┌─ Forgot Password Flow ─────────────────────────┐
│                                                 │
│ ✓ Email not found → Generic message (security) │
│ ✓ Database error → Error message               │
│ ✓ Email service down → Error message           │
│ ✓ Invalid email format → Validation           │
│                                                 │
└─────────────────────────────────────────────────┘

┌─ Reset Password Flow ──────────────────────────┐
│                                                 │
│ ✓ Invalid token → Error message               │
│ ✓ Expired token → Error message               │
│ ✓ Passwords don't match → Validation          │
│ ✓ Password too short → Validation             │
│ ✓ Missing fields → Validation                 │
│ ✓ Database error → Error message              │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Integration Points

```
Frontend                    Backend                 Email Service
  │                           │                          │
  │─ forgotPassword ────────►│                           │
  │                           │─ Generate token          │
  │                           │─ Hash & store token      │
  │                           │─ Create email ──────────►│
  │                           │                          │ Send email
  │                           │◄─ Email sent ────────────│
  │◄─ Success response ───────│                          │
  │                           │                          │
  │                           │                          │
  │─ resetPassword ─────────►│                          │
  │ (with token & password)   │                          │
  │                           │─ Validate token         │
  │                           │─ Update password        │
  │                           │─ Clear token            │
  │◄─ Success response ───────│                          │
  │                           │                          │
```
