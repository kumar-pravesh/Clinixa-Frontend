# Clinixa - Hospital Management System

A comprehensive hospital management system built with Node.js and React.

## Project Structure

- `backend/`: Node.js Express API.
- `public-website/`: Patient-facing website (Booking, Profiles, etc.).
- `staff-portal/`: Internal portal for Doctors, Admins, and Receptionists.

---

## Prerequisites

- **Node.js**: v18 or later.
- **MySQL**: v8.0 or later.
- **npm**: v9 or later.

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Clinixa
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update the `DB_PASSWORD` and other database settings as per your local MySQL configuration.
4. Setup the Database:
   - Ensure MySQL is running and your user has permissions to create databases.
   - Run the setup script:
     ```bash
     npm run db:setup
     ```
   - (Optional) Seed the database with initial data:
     ```bash
     npm run db:setup:seed
     ```
5. Start the backend:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

### 3. Public Website Setup (Patient Portal)
1. Open a new terminal and navigate to the public-website directory:
   ```bash
   cd public-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The website will run on `http://localhost:5173`.*

### 4. Staff Portal Setup (Admin/Doctor)
1. Open a new terminal and navigate to the staff-portal directory:
   ```bash
   cd staff-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The portal will run on `http://localhost:5174` (or next available port).*

---

## Test Credentials

If you seeded the database using `npm run db:setup:seed`, you can use the following accounts (Password for all: `Password@123`):

- **Admin**: `admin@clinixa.life`
- **Doctor**: `rajesh.kumar@clinixa.life`
- **Receptionist**: `anjali@clinixa.life`
- **Lab Technician**: `suresh@clinixa.life`
- **Patient**: `john.doe@email.com`

---

## Common Issues & Troubleshooting

- **Database Connection Error**: Double-check your `.env` credentials and ensure MySQL is listening on the specified port (default 3306).
- **CORS Errors**: The backend is configured to allow requests from `http://localhost:5173`, `http://localhost:5174`, etc. If your frontend runs on a different port, update the `origin` array in `backend/src/app.js`.
- **Missing Dependencies**: Ensure you run `npm install` in all three directories (`backend`, `public-website`, `staff-portal`).

---

## Core Features Implemented
- **Patient Portal**: Appointment booking, department exploration, and profile management.
- **Admin Dashboard**: Manage doctors, departments, and view hospital metrics.
- **Doctor Portal**: View assigned patients, manage prescriptions, and clinical records.
- **Payment Integration**: Razorpay support for appointment bookings.
