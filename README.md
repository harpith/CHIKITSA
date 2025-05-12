# Chikitsa - Medical Data Encryption System

**Version:** 1.0  
**Developed by:** Software Engineering Team-5, Mahindra University  
**Course:** Software Engineering  
**Instructor:** Prof. Vijay Rao

## 📌 Project Overview

Chikitsa is a secure, role-based, encrypted medical data management system designed for storing, accessing, and managing sensitive patient records. Built using the MERN stack (MongoDB, Express.js, ReactJS, Node.js), it ensures data privacy and integrity by implementing **AES-GCM encryption** for secure access by patients, doctors, and administrators.

---

## 📌 Purpose

The purpose of the **Chikitsa Medical Data Encryption System** is to securely manage and protect sensitive patient records by implementing encrypted storage and role-based access control. It ensures that only authorized patients, doctors, and administrators can view or modify medical data, while maintaining privacy, data integrity, and compliance with healthcare data protection regulations.

---

## 🚀 Run the Frontend

To set up and run the frontend part of the project, follow these steps:

### 📥 Navigate to the frontend directory and install dependencies

```bash
cd frontend
npm install
```
### Start the frontend server
```bash
npm run dev
```

## 🚀 Run the Backend

To set up and run the backend part of the project, follow these steps:

### 📥 Navigate to the backend directory and install dependencies

```bash
cd backend
npm install
```
### Start the backend server
```
node server
```
###
📌 Note:
The backend server should be started from the following directories as applicable:
- Backend folder
- Medical folder

## 🎯 Objectives

- Develop a secure, encrypted medical record management system.
- Implement role-based access for patients, doctors, and administrators.
- Provide an intuitive, responsive web interface for viewing, uploading, and managing medical records.
- Ensure compliance with the **Digital Personal Data Protection Act (DPDP Act), 2023** and EHR standards.

---

## 🛠️ Technologies Used

- **Frontend:** ReactJS, TailwindCSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** Mongo DB Cloud Based Authentication
- **Encryption:** AES-GCM
- **UI/UX Prototyping:** Figma

---

### Backend

- **cors** `v2.8.5` — Cross-Origin Resource Sharing  
  - **object-assign** `v4.1.1` — Object property assignment utility  
  - **vary** `v1.1.2` — HTTP header control middleware  
- **bcryptjs** — Password hashing  
- **dotenv** — Environment variable management  
- **express** — Backend server framework  
- **jsonwebtoken** — JWT authentication  
- **mongoose** — MongoDB Object Data Modeling  
- **multer** — File upload handling  
- **nodemon** — Auto-restarting dev server

## 📦 Features

- Secure user authentication and role-based dashboards.
- AES-GCM encrypted medical records storage and retrieval.
- Encrypted prescription downloads.
- Doctor-patient secure linking and record sharing.
- Admin management of user records.
- Robust audit trails for all system activities.
- Configurable system parameters (encryption keys, file size limits, etc.)
- Error handling for authentication failures, unauthorized access, and database exceptions.

---

## 📊 Project Deliverables

- **Secure Medical Record Interface**
- **Side-by-Side Login Functionality**
- **Patient Dashboard** for viewing and downloading medical history.
- **Doctor Dashboard** for viewing patient records and adding prescriptions.
- **Admin Dashboard** for managing user accounts and verifying data integrity.

---

## 📈 Performance Standards

- Authentication response within 2 seconds.
- Medical record encryption/decryption within 500ms.
- Dashboard load times under 2 seconds.

---

## 📌 Assumptions and Constraints

- All hospitals will adhere to data security regulations.
- MongoDB Atlas will remain available for 24/7 secure data storage.
- Users will access the system via modern web browsers.
- Performance may vary with large-scale medical data but is optimized for scalability.

---

# 📄 Project Documentation

You can find the detailed project documentation here:

- [📑 Software Requirements Specification ](./documentation/Chikitsa.pdf)
- [📑 Statement of Work ](./documentation/SoW.pdf)
- [📑 Software Design Specification ](./documentation/SDS.pdf)
- [📑 Software Test Plan ](./documentation/Software_Test_Plan.xlsx)


## 👥 Team Members

- **K Harpith Rao** (Frontend & Backend)
- **C Srikanth** (Backend)  
- **Dev M Bandhiya** (UI/UX, Encryption)  
- **G Aditya Vardhan** (Backend, UI/UX)  
- **K Sai Bharat Kumar Varma** (Frontend, Encryption)   
- **Punith Chavan** (Frontend)  
- **Harsha B** (Frontend, Deployment)


## 📜 License

This project is academic and open for educational purposes.  
© 2025 Software Engineering Team-5, Mahindra University




