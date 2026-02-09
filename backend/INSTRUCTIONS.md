# Clinixa Hospital Management System - Backend Setup

This backend is built with Node.js, Express, and MySQL. It supports Admin, Doctor, Receptionist, Lab Technician, and Patient portals.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (running and accessible)

## Installation

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    - Ensure `.env` file exists (a sample `.env.example` is provided).
    - Update `DB_PASSWORD` and other credentials if necessary.

## Database Setup (IMPORTANT)

Before running the server, you must set up the database structure and populate it with initial data.

1.  **Reset & Setup Database:**
    We have provided a script to drop the existing database (if any) and recreate it with the correct schema and seed data.

    **Run the following command:**
    ```bash
    npm run db:setup:seed
    ```
    
    *This command will:*
    - Create `hospital_db` database.
    - Create all necessary tables (Users, Doctors, Patients, Appointments, etc.).
    - Populate tables with sample data (Admin, Doctors, Patients, etc.).

    **Troubleshooting:**
    If you encounter issues with existing tables, you can force a complete reset:
    ```bash
    node src/scripts/resetDatabase.js
    npm run db:setup:seed
    ```

## Running the Server

1.  **Start in Development Mode (with auto-reload):**
    ```bash
    npm run dev
    ```

2.  **Server Address:**
    The server runs on `http://localhost:5000`.

## API Documentation

- **Public**:
    - `GET /doctors`: List of doctors
    - `POST /auth/login`: User login

- **Admin**:
    - `GET /admin/dashboard`: Stats
    - `POST /admin/doctors`: create doctor
    - `GET /admin/appointments`: manage appointments

- **Receptionist**:
    - `POST /receptionist/patients`: Register patient
    - `POST /receptionist/tokens`: Generate token

- **Lab**:
    - `GET /lab/queue`: Test queue
    - `POST /lab/reports`: Upload report

## Default Login Credentials (from seed data)

- **Admin**: `admin@clinixa.life` / `Password@123`
- **Doctor**: `rajesh.kumar@clinixa.life` / `Password@123`
- **Receptionist**: `anjali@clinixa.life` / `Password@123`
- **Lab Tech**: `suresh@clinixa.life` / `Password@123`
- **Patient**: `john.doe@email.com` / `Password@123`
