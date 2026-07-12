# 🚀 AssetFlow

> **Enterprise Asset & Resource Management System**  
> Developed for the **Odoo Hackathon 2026** by **Team CodeCatalyst**

AssetFlow is a centralized ERP platform that helps organizations efficiently manage their physical assets and shared resources throughout their entire lifecycle. The system replaces manual spreadsheets and paper-based tracking with a modern, secure, and scalable solution for asset registration, allocation, maintenance, resource booking, audits, and analytics.

---

## 📌 Problem Statement

Organizations often struggle with inefficient asset tracking, double allocations, scheduling conflicts, delayed maintenance, and poor visibility into asset utilization due to manual processes. AssetFlow addresses these challenges by providing a centralized platform with automated workflows, real-time tracking, and role-based access control.

---

## ✨ Features

- 🔐 Secure Authentication & Role-Based Access Control (RBAC)
- 🏢 Department & Employee Management
- 📦 Asset Registration & Lifecycle Management
- 👥 Asset Allocation & Transfer Workflow
- 📅 Shared Resource Booking with Conflict Detection
- 🔧 Maintenance Request & Approval Workflow
- 📋 Asset Audit Cycles & Discrepancy Reports
- 🔔 Smart Notifications & Activity Logs
- 📊 Dashboard with KPIs & Analytics
- 📈 Reports with Export Support
- 📱 Responsive & Modern User Interface

---

## 👥 User Roles

### Admin
- Manage departments, categories, and employee roles
- Configure organization settings
- View organization-wide analytics

### Asset Manager
- Register and allocate assets
- Approve transfers and maintenance requests
- Manage asset lifecycle

### Department Head
- Monitor departmental assets
- Approve allocation and transfer requests
- Book shared resources

### Employee
- View allocated assets
- Book shared resources
- Raise maintenance requests
- Request asset transfers or returns

---

## 🔄 Asset Lifecycle

```
Available
    │
    ├──► Allocated
    │        │
    │        ├──► Returned
    │        └──► Transfer Requested
    │
    ├──► Reserved
    ├──► Under Maintenance
    ├──► Lost
    ├──► Retired
    └──► Disposed
```

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React / Next.js |
| Backend | Node.js / Express |
| Database | PostgreSQL |
| Authentication | JWT + RBAC |
| Styling | Tailwind CSS + Shadcn UI |
| Charts | Recharts |

---

## 📊 Core Modules

- Dashboard
- Organization Setup
- Employee Directory
- Asset Registry
- Asset Allocation & Transfer
- Resource Booking
- Maintenance Management
- Asset Audit
- Reports & Analytics
- Notifications & Activity Logs

---

## 🎯 Project Goals

- Digitize enterprise asset management
- Eliminate manual tracking errors
- Prevent asset allocation conflicts
- Simplify maintenance workflows
- Improve resource utilization
- Provide real-time operational insights

---

## 📁 Repository Structure

```
assetflow/
├── frontend/
├── backend/
├── database/
├── docs/
├── assets/
└── README.md
```

---

## 👨‍💻 Team

**Team CodeCatalyst**

Developed for the **Odoo Hackathon 2026**.

---

## 📄 License

This project was developed for the **Odoo Hackathon 2026** and is intended for educational and demonstration purposes.
