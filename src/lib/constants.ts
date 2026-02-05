import { Translation } from '../types';

export const TRANSLATIONS: Record<'en' | 'bn', Translation> = {
  en: {
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
      refresh: "Refresh", // NEW
      offline: "Offline", // NEW
      online: "Online",   // NEW
      lastUpdated: "Last Updated", // NEW
      sync: "Sync Now",    // NEW
    },
    dashboard: {
      title: "Dashboard",
      todaySales: "Today's Sales",
      todayProfit: "Today's Profit",
      todayExpense: "Today's Expenses",
      stockAlert: "Low Stock Alert",
      recentSales: "Recent Sales"
    },
    sales: {
      title: "Sales",
      newSale: "New Sale",
      selectProduct: "Select Product",
      quantity: "Quantity",
      total: "Total",
      date: "Date",
      profit: "Profit"
    },
    inventory: {
      title: "Inventory",
      addProduct: "Add Product",
      productName: "Product Name",
      buyPrice: "Buy Price",
      sellPrice: "Sell Price",
      stock: "Stock Qty",
      category: "Category"
    },
    expenses: {
      title: "Expenses",
      addExpense: "Add Expense",
      category: "Category",
      amount: "Amount",
      note: "Note"
    },
    ledger: {
      title: "Ledger", 
      addCustomer: "Add Customer",
      name: "Name",
      phone: "Phone",
      address: "Address",
      debt: "Debt",
      receivePayment: "Receive Payment"
    },
    staff: {
      title: "Staff",
      addStaff: "Add Staff"
    },
    // NEW SECTION: Market Prices
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
      syncInProgress: "Updating prices...",
    },
     // NEW: Stock Alert Keys
      stockLow: "Low Stock",
      stockOut: "Stock Out",
      stockCritical: "Critical",
      stockWarning: "Warning",
      daysLeft: "Days Left",
      stockUnknown: "No Sales Data"
    },
            // NEW: Notification Keys
      stockLow: "Low Stock",
      stockOut: "Stock Out",
      stockCritical: "Critical",
      stockWarning: "Warning",
      daysLeft: "Days Left",
      stockUnknown: "No Sales Data"
    }
  },
  bn: {
    common: {
      appName: "দোকানদার বন্ধু",
      save: "সংরক্ষণ",
      cancel: "বাতিল",
      delete: "মুছে ফেল",
      edit: "সম্পাদনা",
      search: "অনুসন্ধান...",
      loading: "লোড হচ্ছে...",
      noData: "কোন তথ্য পাওয়া যায়নি",
      confirmDelete: "আপনি কি নিশ্চিত এটি মুছে ফেল?",
      refresh: "রিফ্রেশ", // NEW
      offline: "অফলাইন", // NEW
      online: "অনলাইন",   // NEW
      lastUpdated: "সর্বশেষ আপডেট", // NEW
      sync: "সিঙ্ক করুন",    // NEW
    },
    dashboard: {
      title: "ড্যাশবোর্ড",
      todaySales: "আজকের বিক্রয়",
      todayProfit: "আজকের লাভ",
      todayExpense: "আজকের খরচ",
      stockAlert: "মজুদ সতর্কতা",
      recentSales: "সাম্প্রতিক বিক্রয়"
    },
    sales: {
      title: "বিক্রয়",
      newSale: "নতুন বিক্রয়",
      selectProduct: "পণ্য নির্বাচন",
      quantity: "পরিমাণ",
      total: "মোট",
      date: "তারিখ",
      profit: "লাভ"
    },
    inventory: {
      title: "মজুদ খাতা",
      addProduct: "নতুন পণ্য",
      productName: "পণ্যের নাম",
      buyPrice: "ক্রয় মূল্য",
      sellPrice: "বিক্রয় মূল্য",
      stock: "মজুদ সংখ্যা",
      category: "ক্যাটাগরি"
    },
    expenses: {
      title: "খরচের খাতা",
      addExpense: "নতুন খরচ",
      category: "খাত",
      amount: "টাকা",
      note: "নোট"
    },
    ledger: {
      title: "বাকি খাতা", 
      addCustomer: "গ্রাহক যোগ",
      name: "নাম",
      phone: "ফোন",
      address: "ঠিকানা",
      debt: "বাকি",
      receivePayment: "টাকা গ্রহণ"
    },
    staff: {
      title: "কর্মী",
      addStaff: "কর্মী যোগ"
    },
    // NEW SECTION: Market Prices
    market: {
      title: "বাজার দর",
      subtitle: "দৈনিক পাইকারি ও খুচরা বাজার দর (RMP)",
      source: "সূত্র: টিসিবি অফিসিয়াল",
      categories: {
        all: "সকল পণ্য",
        rice: "চাল ও শস্য",
        vegetables: "সবজি",
        spices: "মসলা",
        meat: "মাছ ও মাংস",
        fruits: "ফলমূল",
        essentials: "নিত্যপ্রয়োজনীয়"
      },
      priceRange: "দর (টাকা)",
      unit: "একক",
      emptyState: "কোন বাজার তথ্য নেই। অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে সিঙ্ক করুন।",
      syncSuccess: "বাজার দর সফলভাবে আপডেট হয়েছে!",
      syncError: "আপডেট করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।",
      syncInProgress: "আপডেট হচ্ছে...",
    },
     stockLow: "কম মজুদ",
      stockOut: "মজুদ শেষ",
      stockCritical: "গুরুত্ব",
      stockWarning: "সতর্তবক",
      daysLeft: "দিন বাকি আছে",
      stockUnknown: "বিক্রয়ার নেই"
    }
  }
};
