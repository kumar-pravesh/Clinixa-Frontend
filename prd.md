# Product Requirements Document (PRD)

## Product Name

**Antigravity – Smart Hospital Management System**

---

## 1. Overview

Antigravity is a web-based Smart Hospital Management System designed to digitize and automate hospital operations such as appointment booking, patient management, billing, prescriptions, lab reports, and notifications using secure role-based access.

---

## 2. Goals & Objectives

* Digitize end-to-end hospital workflows
* Reduce manual operations and errors
* Improve patient experience and doctor efficiency
* Provide real-time dashboards and reports
* Ensure secure handling of medical and financial data

---

## 3. Target Users & Roles

| Role           | Description                               |
| -------------- | ----------------------------------------- |
| Admin          | Full control over system and reports      |
| Doctor         | Patient care, prescriptions, appointments |
| Patient        | Booking, payments, medical records        |
| Receptionist   | Walk-in management, billing               |
| Lab Technician | Upload and manage lab reports             |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

* Secure login for all roles
* Role-based access control (RBAC)
* Separate dashboards for each role

### 4.2 Admin Module

* Manage doctors, patients, departments
* Approve/cancel appointments
* Billing control and GST management
* Dashboard analytics:

  * Today’s appointments
  * Total patients
  * Daily income
  * Pending bills
* Generate reports (PDF/CSV)

### 4.3 Patient Portal

* User registration & login
* Doctor-wise appointment booking
* Date & time slot selection
* Online payment (mandatory)
* Download prescriptions and reports
* View medical history

**Business Rule:** Appointment is confirmed only after successful payment.

### 4.4 Doctor Portal

* View assigned patients
* Access patient history
* Create digital prescriptions
* Upload lab reports
* Add medications and follow-ups
* Manage availability slots

### 4.5 Reception Module

* Register walk-in patients
* Generate queue tokens
* Create bills
* Print receipts

### 4.6 Lab Technician Module

* Upload diagnostic reports
* Associate reports with patients
* Restricted access to lab-related data

### 4.7 Appointment Management

* Doctor-wise scheduling
* Configurable slot duration
* Status tracking (Pending / Confirmed / Completed)
* Payment-linked confirmation

### 4.8 Billing & Payments

* Consultation fees
* Lab charges
* Medicine charges
* GST and discounts
* Auto-generated PDF invoices

### 4.9 Notifications

* SMS reminders for appointments
* Email confirmations for booking, payments, and reports

---

## 5. API Requirements (REST)

| Module       | Endpoint          | Method     |
| ------------ | ----------------- | ---------- |
| Auth         | /api/login        | POST       |
| Auth         | /api/register     | POST       |
| Patient      | /api/patients     | GET / POST |
| Doctor       | /api/doctors      | GET        |
| Appointment  | /api/appointments | POST       |
| Billing      | /api/invoice      | GET        |
| Prescription | /api/prescription | POST       |
| Reports      | /api/reports      | GET        |

---

## 6. Database Requirements

### Patients Table

* patient_id (PK)
* name
* phone
* email
* address
* medical_history

### Appointments Table

* appointment_id (PK)
* patient_id (FK)
* doctor_id (FK)
* date
* time
* status

(Extendable for billing, prescriptions, and lab reports)

---

## 7. Non-Functional Requirements

* Page load time < 3 seconds
* Mobile-responsive UI
* Secure authentication
* Daily automated database backup
* High availability and reliability

---

## 8. Technology Stack

### Frontend

* React.js

### Backend

* Node.js with Express

### Database

* MySQL

### Integrations

* Razorpay (Payments)
* SMS Gateway (OTP & reminders)
* Email service (Notifications)
* PDF generation for invoices & reports

### DevOps & Tools

* Git & GitHub
* Linux Server
* REST APIs
* Postman for API testing

---

## 9. Security Requirements

* Encrypted passwords
* Secure payment processing
* Role-based data access
* No shared credentials

---

## 10. Project Constraints

* Duration: 10 working days
* Minimum 10 hours/day
* Daily progress demos
* Complete testing before delivery

---

## 11. Development Timeline

| Day | Focus                               |
| --- | ----------------------------------- |
| 1   | Requirements, DB design, wireframes |
| 2   | Authentication & roles              |
| 3   | Patient module                      |
| 4   | Doctor module                       |
| 5   | Appointment system                  |
| 6   | Billing                             |
| 7   | Integrations                        |
| 8   | Reports                             |
| 9   | Testing                             |
| 10  | Deployment & demo                   |

---

## 12. Deliverables

* Fully functional application
* Source code
* Database schema documentation
* API documentation
* Test cases & testing report
* User manual
* Production deployment

---

## 13. Success Metrics

* Smooth end-to-end appointment booking
* Correct payment and billing flow
* Successful prescription and report generation
* Secure, bug-free deployment

---

**End of PRD**
