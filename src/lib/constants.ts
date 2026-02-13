import { Translation } from '../types';

// ==========================================
// NEW: STANDARDIZED UNITS & CATEGORIES
// ==========================================
export const UNITS = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'liter', label: 'Liter (l)' },
  { value: 'ml', label: 'Milliliter (ml)' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pack', label: 'Pack' },
];

export const CATEGORIES = [
  { value: 'General', label: 'General' },
  { value: 'Grocery', label: 'Grocery' },
  { value: 'Vegetable', label: 'Vegetable' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Food', label: 'Food & Snacks' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Meat', label: 'Meat & Fish' },
  { value: 'Stationary', label: 'Stationary' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Household', label: 'Household' },
];

export const TRANSLATIONS: Record<'en' | 'bn', Translation> = {
  en: {
    // ==========================================
    // 1. COMMON
    // ==========================================
    common: {
      appName: "Dokandar Bondhu",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search...",
      loading: "Loading...",
      noData: "No data found",
      confirmDelete: "Are you sure you want to delete this?",
      refresh: "Refresh",
      offline: "Offline",
      online: "Online",
      lastUpdated: "Last Updated",
      sync: "Sync Now"
    },

    // ==========================================
    // 2. DASHBOARD
    // ==========================================
    dashboard: {
      title: "Dashboard",
      todaySales: "Today's Sales",
      todayProfit: "Today's Profit",
      todayExpense: "Today's Expenses",
      stockAlert: "Low Stock Alert",
      recentSales: "Recent Sales",
      stockLow: "Low Stock",
      stockOut: "Stock Out",
      stockCritical: "Critical",
      stockWarning: "Warning",
      daysLeft: "Days Left",
      stockUnknown: "No Sales Data"
    },

    // ==========================================
    // 3. SALES
    // ==========================================
    sales: {
      title: "Sales",
      newSale: "New Sale",
      selectProduct: "Select Product",
      quantity: "Quantity",
      total: "Total",
      date: "Date",
      profit: "Profit"
    },

    // ==========================================
    // 4. INVENTORY
    // ==========================================
    inventory: {
      title: "Inventory",
      addProduct: "Add Product",
      productName: "Product Name",
      buyPrice: "Buy Price",
      sellPrice: "Sell Price",
      stock: "Stock Qty",
      category: "Category"
    },

    // ==========================================
    // 5. EXPENSES
    // ==========================================
    expenses: {
      title: "Expenses",
      addExpense: "Add Expense",
      category: "Category",
      amount: "Amount",
      note: "Note"
    },

    // ==========================================
    // 6. LEDGER (BAKI KHATA)
    // ==========================================
    ledger: {
      title: "Ledger",
      addCustomer: "Add Customer",
      name: "Name",
      phone: "Phone",
      address: "Address",
      debt: "Debt",
      receivePayment: "Receive Payment"
    },

    // ==========================================
    // 7. STAFF
    // ==========================================
    staff: {
      title: "Staff",
      addStaff: "Add Staff"
    },

    // ==========================================
    // 8. MARKET PRICES
    // ==========================================
    market: {
      title: "Market Prices",
      subtitle: "Daily Retail Market Price (RMP)",
      source: "Source: TCB Official",
      categories: {
        all: "All Items",
        rice: "Rice & Cereals",
        vegetables: "Vegetables",
        spices: "Spices",
        meat: "Meat & Fish",
        fruits: "Fruits",
        essentials: "Daily Essentials"
      },
      priceRange: "Price Range",
      unit: "Unit",
      emptyState: "No market data available. Please connect to internet and sync.",
      syncSuccess: "Prices updated successfully!",
      syncError: "Failed to update prices. Check internet connection.",
      syncInProgress: "Updating prices..."
    },

    // ==========================================
    // 9. SUPPLIERS
    // ==========================================
    suppliers: {
      title: "Suppliers",
      addSupplier: "Add Supplier",
      phone: "Phone",
      notes: "Notes",
      totalDue: "Total Due",
      lastPurchase: "Last Purchase",
      payNow: "Pay Now"
    },

    // ==========================================
    // 10. NOTIFICATIONS
    // ==========================================
    notifications: {
      title: "Notifications",
      enable: "Enable Notifications",
      enabled: "Active",
      disabled: "Denied",
      status: "Status",
      testBtn: "Send Test Notification",
      alertMsg: "Notifications allow us to alert you about low stock and daily summaries even when the app is closed.",
      settings: "Notification Settings",
      type: "Notification Type",
      lowStock: "Low Stock Alerts",
      duePayment: "Due Payment Reminders",
      dailySummary: "Daily Sales Summary",
      monthlySummary: "Monthly Profit Summary",
      marketUpdate: "Market Price Updates"
    },

    // ==========================================
    // 11. PROFIT INSIGHTS
    // ==========================================
    insights: {
      title: "Profit Insights",
      subtitle: "Business Performance Analysis",
      topPerformers: "Top Performers",
      bottomPerformers: "Attention Required",
      trends: "Trend Analysis",
      bestSeller: "Best Seller",
      dailyReport: "Daily Report",
      monthlyReport: "Monthly Report"
    }
  },

  bn: {
    // ==========================================
    // 1. COMMON
    // ==========================================
    common: {
      appName: "দোকানদার বন্ধু",
      save: "সেভ করুন",
      cancel: "বাতিল",
      delete: "ডিলিট করুন",
      edit: "এডিট",
      search: "খুঁজুন...",
      loading: "লোড হচ্ছে...",
      noData: "কোনো ডাটা নাই",
      confirmDelete: "এইটি ডিলিট করবেন নিশ্চিত?",
      refresh: "রিফ্রেশ",
      offline: "অফলাইন",
      online: "অনলাইন",
      lastUpdated: "সর্বশেষ আপডেট",
      sync: "এখনই সিঙ্ক করুন"
    },

    // ==========================================
    // 2. DASHBOARD
    // ==========================================
    dashboard: {
      title: "ড্যাশবোর্ড",
      todaySales: "আজকের বিক্রয়",
      todayProfit: "আজকের লাভ",
      todayExpense: "আজকের খরচ",
      stockAlert: "মজুদ কম সতর্কতা",
      recentSales: "সাম্প্রতিক বিক্রয়",
      stockLow: "মজুদ কম",
      stockOut: "মজুদ শেষ",
      stockCritical: "জরুরি অবস্থা",
      stockWarning: "সতর্ক থাকুন",
      daysLeft: "আর কত দিন বাকি",
      stockUnknown: "বিক্রয়ের হিসাব নাই"
    },

    // ==========================================
    // 3. SALES
    // ==========================================
    sales: {
      title: "বিক্রয়",
      newSale: "নতুন বিক্রয়",
      selectProduct: "পণ্য বাছাই করুন",
      quantity: "পরিমাণ",
      total: "মোট টাকা",
      date: "তারিখ",
      profit: "লাভ"
    },

    // ==========================================
    // 4. INVENTORY
    // ==========================================
    inventory: {
      title: "মজুদের হিসাব",
      addProduct: "পণ্য যোগ করুন",
      productName: "পণ্যের নাম",
      buyPrice: "কেনা দাম",
      sellPrice: "বিক্রয় দাম",
      stock: "মজুদের পরিমাণ",
      category: "ক্যাটাগরি"
    },

    // ==========================================
    // 5. EXPENSES
    // ==========================================
    expenses: {
      title: "খরচ",
      addExpense: "খরচ যোগ করুন",
      category: "খাত",
      amount: "টাকার পরিমাণ",
      note: "নোট"
    },

    // ==========================================
    // 6. LEDGER (BAKI KHATA)
    // ==========================================
    ledger: {
      title: "বাকির খাতা",
      addCustomer: "গ্রাহক যোগ করুন",
      name: "নাম",
      phone: "মোবাইল",
      address: "ঠিকানা",
      debt: "বাকি টাকা",
      receivePayment: "টাকা নিলাম"
    },

    // ==========================================
    // 7. STAFF
    // ==========================================
    staff: {
      title: "কর্মচারী",
      addStaff: "কর্মচারী যোগ করুন"
    },

    // ==========================================
    // 8. MARKET PRICES
    // ==========================================
    market: {
      title: "বাজার দর",
      subtitle: "আজকের খুচরা বাজার দর",
      source: "সূত্র: টিসিবি",
      categories: {
        all: "সব পণ্য",
        rice: "চাল-ডাল",
        vegetables: "সবজি",
        spices: "মসলা",
        meat: "মাছ-মাংস",
        fruits: "ফলমূল",
        essentials: "নিত্যপ্রয়োজনীয়"
      },
      priceRange: "দামের রেঞ্জ",
      unit: "একক",
      emptyState: "বাজার দর নাই। নেট অন করে সিঙ্ক দেন।",
      syncSuccess: "বাজার দর আপডেট হয়েছে!",
      syncError: "আপডেট হয়নি। নেট চেক করেন।",
      syncInProgress: "আপডেট চলছে..."
    },

    // ==========================================
    // 9. SUPPLIERS
    // ==========================================
    suppliers: {
      title: "সরবরাহকারী",
      addSupplier: "সরবরাহকারী যোগ",
      phone: "ফোন নম্বর",
      notes: "নোট",
      totalDue: "মোট বাকি",
      lastPurchase: "শেষ কেনাকাটা",
      payNow: "এখনই পরিশোধ"
    },

    // ==========================================
    // 10. NOTIFICATIONS
    // ==========================================
    notifications: {
      title: "নোটিফিকেশন",
      enable: "নোটিফিকেশন চালু করুন",
      enabled: "চালু আছে",
      disabled: "বন্ধ",
      status: "স্ট্যাটাস",
      testBtn: "টেস্ট নোটিফিকেশন পাঠান",
      alertMsg:
        "নোটিফিকেশন চালু রাখলে আমরা মজুদ কম, বাকি আদায় আর দৈনিক বিক্রয়ের খবর নেট থাকুক বা না থাকুক পাবেন।",
      settings: "নোটিফিকেশন সেটিংস",
      type: "নোটিফিকেশন টাইপ",
      lowStock: "মজুদ কম হলে",
      duePayment: "বাকি আদায় রিমাইন্ডার",
      dailySummary: "আজকের বিক্রয়ের হিসাব",
      monthlySummary: "মাসিক লাভের হিসাব",
      marketUpdate: "বাজার দর আপডেট"
    },

    // ==========================================
    // 11. PROFIT INSIGHTS
    // ==========================================
    insights: {
      title: "লাভের বিশ্লেষণ",
      subtitle: "ব্যবসায়ের অবস্থা এক নজরে",
      topPerformers: "সবচেয়ে বেশি বিক্রয়",
      bottomPerformers: "খেয়াল দরকার",
      trends: "ট্রেন্ড বিশ্লেষণ",
      bestSeller: "বেস্ট সেলার",
      dailyReport: "আজকের রিপোর্ট",
      monthlyReport: "মাসের রিপোর্ট"
    }
  }
};
