# 🚀 Dynamic Billing Engine & Plan Builder

A full-stack, end-to-end prototype of a usage-based billing and metering platform. This project demonstrates how to translate complex business pricing models into an intuitive, no-code interface for finance teams.

**[🔴 Live App ](https://billing-engine-ashen.vercel.app/)**

---

## 📖 Overview

In modern B2B SaaS, pricing is rarely a flat fee. Companies need hybrid models (Base Fee + Usage Metrics). This prototype solves the engineering bottleneck of hardcoded billing logic by decoupling the **Pricing Configuration** (Frontend) from the **Metering & Calculation** (Backend).

**Core Workflows Demonstrated:**
1. **No-Code Plan Creation:** Finance teams can visually build complex, multi-metric usage plans.
2. **Usage Metering:** A scalable ingestion endpoint to record raw customer events.
3. **Billing Aggregation:** An engine that marries customer usage with their subscribed plan to generate accurate invoices.

---

## 🏗️ Architecture & Tech Stack

This project uses a decoupled, Service-Oriented Architecture (SOA) approach.

### Frontend (The Configuration UI)
- **Framework:** React 18 with Vite
- **Language:** TypeScript (Strict typing for robust data contracts)
- **Styling:** Material UI (MUI) for enterprise-grade, accessible components
- **Routing:** React Router DOM (SPA architecture)

### Backend (The Calculation Engine)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Data Store:** In-Memory Database for local, Postgres vercel for production
- **Architecture:** Controller-Service pattern for separation of concerns.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### 1. Set up backend and database
1. Navigate to /api.
2. Create a .env file and add your DATABASE_URL.
3. Run migrations (SQL scripts provided in /api/db/schema.sql).

```bash
cd api
npm install
npm run dev

2. Start the Frontend
The frontend is configured to proxy requests to the backend.

Bash
cd ..
npm install
npm run dev
