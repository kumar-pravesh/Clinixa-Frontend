# 🏥 Clinixa - Premium Hospital Management System

Welcome to the **Clinixa** team! This guide will help you set up the entire ecosystem on your local machine without any errors. Please follow the steps exactly as written.

---

## 📂 Project Structure

This repository is a monorepo containing three main components:

| Component | Directory | Description | Port |
| :--- | :--- | :--- | :--- |
| **Backend** | `backend/` | Node.js REST API & Database Logic | `5000` |
| **Public Website** | `public-website/` | Patient Facing Website (Vite/React) | `5173` |
| **Staff Portal** | `staff-portal/` | Internal Clinical Command Center (Vite/React) | `5174` |

---

## ⚙️ Prerequisites

Before you start, ensure you have the following installed:

1.  **Node.js**: v18.0.0 or higher. [Download here](https://nodejs.org/)
2.  **Git**: For version control.
3.  **Terminal**: Use **PowerShell** or **Command Prompt** (recommended for Windows).
4.  **Database**: No local MySQL installation is required as we use a **Shared Cloud Database (Aiven)**.

---

## 🚀 Step 1: First-Time Setup (One-Time Only)

Follow these steps to initialize the project on your system.

### 1.1 Backend Configuration
```powershell
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# Copy the example file to a new .env file
cp .env.example .env

# 4. Configure .env
# Open .env and ensure it has the credentials provided in the team group.
# Ensure DB_SSL_CA_PATH points to src/config/ca.pem
```

### 1.2 Database Initialization
Initialization creates the tables and seeds the database with test accounts (Admin, Doctor, etc.).
```powershell
# In the backend directory
npm run db:cloud:seed
```

### 1.3 Frontend Setup
Open two new terminal windows for the frontends.

**Terminal 2 (Public Website):**
```powershell
cd public-website
npm install
```

**Terminal 3 (Staff Portal):**
```powershell
cd staff-portal
npm install
```

---

## 💻 Step 2: Daily Development (Running the App)

To start working, you need to run the **Backend** first, then the frontends.

### 1. Run Backend (Terminal 1)
```powershell
cd backend
npm run dev
```
> ✅ Success: `Server running at http://localhost:5000`

### 2. Run Public Website (Terminal 2)
```powershell
cd public-website
npm run dev
```
> ✅ Success: `http://localhost:5173`

### 3. Run Staff Portal (Terminal 3)
```powershell
cd staff-portal
npm run dev
```
> ✅ Success: `http://localhost:5174`

---

## 🔑 Test Credentials (Password: `Password@123`)

| Role | Email | Portal |
| :--- | :--- | :--- |
| **Admin** | `admin@clinixa.life` | Staff Portal |
| **Doctor** | `rajesh.kumar@clinixa.life` | Staff Portal |
| **Receptionist** | `anjali@clinixa.life` | Staff Portal |
| **Lab Tech** | `suresh@clinixa.life` | Staff Portal |
| **Patient** | `john.doe@email.com` | Public Website |

---

## 🛠️ Troubleshooting (Windows Common Fixes)

### ❌ Error: "Port 5000 is already in use"
If the backend fails to start because the port is busy:
```powershell
# Find and stop the process automatically (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

### ❌ Error: "Table 'defaultdb.users' doesn't exist"
This happens if the database was not initialized. Run:
```powershell
cd backend
npm run db:cloud:seed
```

### ❌ Error: "SSL connection error"
Ensure the file `backend/src/config/ca.pem` exists. This is critical for connecting to our cloud database.

---

## 📜 Development Rules
1.  **Do not create extra files** without discussing with the team lead.
2.  **Lint your code** before pushing: `npm run lint`.
3.  **Sync often**: Pull the latest changes from `main` before starting your task.

---
*© 2026 Clinixa Medical Systems. Confidential & Internal Use Only.*
