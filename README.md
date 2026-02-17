# Clinixa - Hospital Management System

A comprehensive hospital management system built with **Node.js (Backend)** and **React (Frontend)**. This repository contains the source code for the entire platform, divided into three main modules.

## 📂 Project Structure & Team Assignments

| Directory | Description | Target Users | Tech Stack |
|-----------|-------------|--------------|------------|
| **`backend/`** | REST API, Database Logic, Auth | *All Users* | Node.js, Express, MySQL |
| **`public-website/`** | Patient Appointment Booking, Profiles | **Patients** | React, Vite, Tailwind |
| **`staff-portal/`** | Internal Hospital Management | **Admin, Doctors, Reception, Lab** | React, Vite, Tailwind |

---

## 🚀 Local Development Guide

Follow these steps to set up the project locally. You will need to run the **Backend** and **Frontends** in separate terminal windows.

### Prerequisites
- **Node.js**: v18 or higher.
- **MySQL**: v8.0 or higher (Ensure it's running).
- **Git**: To clone the repo.

---

### Step 1: Backend Environment Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Configure environment variables:
    -   Copy `.env.example` to `.env`.
    -   The project is configured to use a **Shared Cloud MySQL (Aiven)** by default.
    -   Ensure your `.env` contains the following (provided by the team lead):
        ```env
        DB_USER=avnadmin
        DB_HOST=mysql-1e54b106-pk4645478-6b3e.c.aivencloud.com
        DB_NAME=defaultdb
        DB_PASSWORD=********
        DB_PORT=19909
        DB_SSL_CA_PATH=./src/config/ca.pem
        ```
3.  **SSL Certificate**: Ensure the `src/config/ca.pem` file exists in the backend directory. This is required for the secure cloud connection.
4.  Install dependencies:
    ```bash
    npm install
    ```
5.  **Initialize & Seed Database**:
    ```bash
    npm run db:cloud:seed
    ```
    *This sets up the database schema and loads sample data (doctors, departments, test users, etc.)*

### 📋 Database Utility Commands
We've consolidated all database scripts into one unified tool. Here are the available commands:

```bash
# Setup & Seed (use this for initial setup)
npm run db:cloud:seed      # Setup cloud database with sample data
npm run db:cloud           # Setup cloud database (schema only, no data)

# Maintenance & Testing
npm run db:test            # Test database connection
npm run db:list            # List all tables in database
npm run db:patch           # Apply schema patches (if needed)

# ⚠️ Destructive Commands (use with caution)
npm run db:clean           # Drop all tables
npm run db:reset           # Reset entire database
```

> **Note**: For local MySQL setup instead of cloud, use `npm run db:setup:seed`



---

### ☁️ Shared Cloud Database Benefits
- **Sync**: All changes made by one team member (e.g., adding a doctor) are immediately visible to everyone.
- **No Local Setup**: You don't need to install or run MySQL locally.
- **Persistent**: Data remains even if you restart your local machine.

---

### Step 2: Run the Backend
*Open Terminal #1*
```bash
cd backend
npm run dev
```
✅ **Success:** Server running at `http://localhost:5000`

---

### Step 3: Run the Public Website (Patients)
*Open Terminal #2*
```bash
cd public-website
npm install  # Only first time
npm run dev
```
✅ **Success:** Website running at `http://localhost:5173`
-   **Use for:** Booking appointments, Patient Login, view Doctors.

---

### Step 4: Run the Staff Portal (Admin, Doctor, etc.)
*Open Terminal #3*
```bash
cd staff-portal
npm install  # Only first time
npm run dev
```
✅ **Success:** Portal running at `http://localhost:5174`
-   **Use for:** Admin Dashboard, Doctor Prescriptions, Reception Desk.

---

## 🔑 Default Login Credentials
*Use these accounts to test different roles (Password: `Password@123`)*

| Role | Email | Access Portal |
|------|-------|---------------|
| **Admin** | `admin@clinixa.life` | Staff Portal |
| **Doctor** | `rajesh.kumar@clinixa.life` | Staff Portal |
| **Receptionist** | `anjali@clinixa.life` | Staff Portal |
| **Lab Tech** | `suresh@clinixa.life` | Staff Portal |
| **Patient** | `john.doe@email.com` | Public Website |

---

## 🛠 Troubleshooting

### Common Issues
-   **EADDRINUSE Error:** If port 5000 is busy, find and kill the process or change `PORT` in `.env`.
-   **Database Connection Error:** Verify your cloud database credentials in `backend/.env` are correct and `ca.pem` file exists.
-   **White Screen on Frontend:** Check the console (F12) for errors. Ensure the Backend is running first.
-   **"Table doesn't exist" Error:** Run `npm run db:cloud:seed` in the backend directory to initialize the database.
-   **Login Fails:** Ensure you've seeded the database with `npm run db:cloud:seed` to create test users.

### Database Issues
If you encounter database errors, try these commands in order:
```bash
cd backend

# 1. Test connection
npm run db:test

# 2. Check if tables exist
npm run db:list

# 3. If tables are missing, reinitialize
npm run db:cloud:seed
```

### Fresh Start
To completely reset your database:
```bash
cd backend
npm run db:reset          # Drops and recreates database
npm run db:cloud:seed     # Reinitialize with fresh data
```

---

## 📚 Additional Resources
- **API Documentation**: After starting the backend, visit `http://localhost:5000/api-docs` for Swagger API documentation
- **Database Scripts**: All database utilities are in `backend/src/scripts/db-utils.js`
- **Project Analysis**: Check the analysis reports in the knowledge base for architecture details
