🏪 Dokandar Bondhu

The Ultimate Digital Assistant for Bangladeshi Retailers

ReactTypeScriptVitePWA

Manage Sales • Track Debt (Baki Khata) • Monitor Market Prices • Offline First

✨ Overview

Dokandar Bondhu (Shopkeeper's Friend) is a beautifully crafted, bilingual (English & Bangla) Progressive Web App (PWA) designed specifically for the unique needs of Bangladeshi shopkeepers.

It combines the simplicity of a digital ledger with the power of inventory analytics, all wrapped in a "Cream & Earth" themed interface that feels professional yet familiar. Built to operate seamlessly without a backend server, it offers a 100% offline-first experience, ensuring business continuity even in areas with poor connectivity.

🚀 Key Features

📊 Business Intelligence Dashboard

Real-Time Analytics: Visualize today's sales, profit, and net income at a glance.
Stock Prediction Engine: An intelligent algorithm that analyzes the last 7 days of sales to predict how many days of stock are left for each product.
Visual Trends: Interactive charts (Recharts) showing weekly sales performance.
Quick Actions: One-tap access to sales, ledger, and low-stock alerts.
📈 Market Intelligence (Live Simulation)

211+ Commodities: A comprehensive database covering Rice, Vegetables, Spices, Meat, Fish, Fruits, and Daily Essentials.
Price Ranges: Displays both Minimum and Maximum retail market prices (e.g., ৳120 - ৳130).
Simulated Updates: Features a "Live Market" experience where prices fluctuate slightly on sync to simulate real-world volatility without needing complex external APIs.
Offline Data: The entire market database is embedded within the app, ensuring instant access with zero loading times.
👥 Baki Khata (Ledger Management)

Debt Tracking: A specialized ledger system for managing customer credits (Baki Khata) and debts.
Customer Directory: Maintain profiles for your regular customers.
Payment Logging: Easily record payments to clear dues, automatically updating the outstanding balance.
📦 Inventory Management

Smart Stock Control: Add, edit, and delete products with ease.
Visual Alerts: Immediate visual cues (color-coded) for items running low on stock.
Cost Analysis: Track buying price vs. selling price to calculate per-item profit.
💰 Expense & Finance

Dual Expense Tracking: Differentiate between "General Expenses" (Rent, Electricity) and "Inventory Expenses" (Transport for goods).
Accurate Profit Calculation: Automatically deducts expenses from gross sales to provide the true Net Profit.
🌐 Universal Accessibility

Full Bilingual Support: Switch between English and Bangla instantly, including digit conversion (e.g., ১২৩).
Dark Mode: A robust dark theme ("Midnight Earth") for comfortable use at night.
Data Freedom: Backup and Restore your entire database as JSON files, ensuring you never lose your business data.
🛠 Tech Stack & Architecture

This project is built with modern web technologies to ensure performance, scalability, and zero-dependency deployment.

Core: React 18.2.0 + TypeScript 5.0
Build Tool: Vite 4.4 (Lightning fast HMR and builds)
Styling: Tailwind CSS 3.3 (Custom "Cream & Mocha" Design System)
State Management: React Context API
Database: Dexie.js (IndexedDB Wrapper) - Enables Offline-First capability.
Charts: Recharts 2.8
Icons: Lucide React
Utilities: date-fns, clsx, tailwind-merge
🧱 Architecture Highlights

No Backend Required: The app uses a purely client-side architecture.
Simulated API: A custom service layer (marketService.ts) simulates network latency and price fluctuations using a local JSON dataset (marketData.ts), eliminating CORS and connectivity issues.
Responsive UI: Mobile-first design optimized for various screen sizes with bottom navigation.
📸 App Showcase

DashboardTrack your daily performance with stock prediction alerts.Dashboard

Market PricesAccess the database of 211 commodities with price ranges.Market

Baki KhataManage credits and debts with a dedicated ledger view.Ledger

🛠️ Installation & Setup

Get the project running on your local machine in minutes.

Prerequisites

Node.js >= 18.0.0
npm or yarn
Steps

Clone the repository
git clone https://github.com/your-username/dokandar-bondhu.gitcd dokandar-bondhu
Install dependencies
npm install
Start the development server
npm run dev
Build for production
npm run build
🎨 Design System

The app features a custom "Earth & Cream" palette designed to be warm and non-intrusive.

Primary (Earth): #8B5E3C (Mocha Brown)
Background (Cream): #FAF9F6
Accent (Gold): #D4AF37
Dark Mode: Deep Grays (#1f2937) with Earth highlights.
Animations

2D Vector Icons: Bottom navigation icons feature a subtle bounce animation when active.
Staggered Lists: Market prices and dashboard items animate in sequentially for a polished feel.
📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact

Dokandar Bondhu - Empowering local businesses with digital simplicity.

Developer: [Your Name]
Project Link: https://github.com/your-username/dokandar-bondhu
 Built with ❤️ for Bangladeshi Shopkeepers
