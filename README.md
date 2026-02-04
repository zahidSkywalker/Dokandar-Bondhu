<div align="center">

# 🏪 Dokandar Bondhu

### *The Ultimate Digital Assistant for Bangladeshi Retailers*

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Offline_Ready-5A0FCB?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Manage Sales • Track Baki Khata • Monitor Market Prices • Offline First**

</div>

---

## ✨ Overview

**Dokandar Bondhu** (Shopkeeper’s Friend) is a modern, bilingual (English & Bangla) Progressive Web App (PWA) built specifically for small and medium-sized retailers in Bangladesh.

Designed for unreliable internet environments, the app functions as a complete **digital ledger, inventory manager, and market price reference**—all running directly on the user’s device.

---

## 🚀 Key Features

### 📊 Business Management
- **Smart Dashboard:** Visualize daily sales, profit, and performance using intuitive charts.
- **Inventory Tracking:** Monitor stock levels with low-stock alerts.
- **Expense Management:** Track daily expenses and calculate accurate net profit.

### 👥 Baki Khata (Ledger System)
- **Customer Debt Tracking:** Manage baki khata with clarity and reliability.
- **Payment History:** Log payments and settle outstanding dues.
- **Customer Profiles:** Maintain records of regular customers with contact details.

### 📉 Market Price Intelligence (Live Sync)
- **Market Price Synchronization:** Fetch and store the latest retail market prices locally.
- **Offline Access:** View previously synced prices anytime without internet.
- **Smart Updating:** Supports scheduled or manual price refresh.
- **200+ Commodities:** Rice, vegetables, spices, meat, oil, and daily essentials.
- **Dual Language Support:** Market categories and prices in Bangla and English.

### 🌐 Universal Access
- **Bilingual Interface:** Instantly switch between Bangla and English.
- **Dark Mode:** Comfortable viewing for night-time usage.
- **Installable PWA:** App-like experience without app store dependency.

---

## 📌 Data Transparency

Market prices are **indicative retail market prices** intended for reference only.  
Actual prices may vary depending on location, supplier, season, and local market conditions.

---

## 🛠 Tech Stack & Architecture

Built with modern, scalable, and maintainable technologies.

### 🔧 Core Technologies
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Custom Earth Theme)
- **State Management:** React Context API
- **Local Database:** Dexie.js (IndexedDB wrapper)
- **Icons:** Lucide React
- **Charts:** Recharts

### 🧱 Offline-First Architecture
All business data is stored locally using IndexedDB.  
The app remains fully functional offline and synchronizes data in the background when internet connectivity becomes available.

This ensures **zero downtime** for shopkeepers.

---

## 📸 App Showcase

**Dashboard**  
Visual overview of daily business performance.

**Market Prices**  
Instant access to cached retail market prices with one-click sync.

**Baki Khata**  
Dedicated ledger system for managing customer debts and payments.

---

🎨 Design System

Warm, professional colors inspired by earth tones.
	•	Primary (Earth): #8B5E3C — Mocha Brown
	•	Background (Cream): #FAF9F6
	•	Accent (Gold): #D4AF37

📦 Project Structure

dokandar-bondhu/
├── public/              # Static assets & PWA manifest
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/
│   │   ├── ui/
│   │   └── views/
│   ├── context/         # Global state (Language, Theme, App)
│   ├── data/            # Market price datasets
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── db/              # Dexie database setup
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js

🤝 Contributing

Contributions are welcome.
	1.	Fork the repository
	2.	Create a feature branch (feature/your-feature)
	3.	Commit changes
	4.	Push to your fork
	5.	Open a Pull Request

⸻

📜 License

Licensed under the MIT License.
See the LICENSE file for details.

⸻

📞 Contact

Dokandar Bondhu — Empowering local businesses with digital simplicity.
	•	Developer: Your Name
	•	Repository: https://github.com/your-username/dokandar-bondhu

<div align="center">
  <sub>Built with ❤️ for Bangladeshi Shopkeepers</sub>
</div>
```

   
