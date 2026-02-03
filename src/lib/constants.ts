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
    // NEW ADDED
    ledger: {
      title: "Ledger (Baki)",
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
    }
  },
  bn: {
    common: {
      appName: "দোকানদার বন্ধু",
      save: "সংরক্ষণ",
      cancel: "বাতিল",
      delete: "মুছে ফেলুন",
      edit: "সম্পাদনা",
      search: "অনুসন্ধান...",
      loading: "লোড হচ্ছে...",
      noData: "কোন তথ্য পাওয়া যায়নি",
      confirmDelete: "আপনি কি নিশ্চিত এটি মুছে ফেলতে চান?",
    },
    dashboard: {
      title: "ড্যাশবোর্ড",
      todaySales: "আজকের বিক্রি",
      todayProfit: "আজকের লাভ",
      todayExpense: "আজকের খরচ",
      stockAlert: "মজুদ সতর্কতা",
      recentSales: "সাম্প্রতিক বিক্রি"
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
    // NEW ADDED
    ledger: {
      title: "হিসাব (বাকি)",
      addCustomer: "ক্রেতা যোগ",
      name: "নাম",
      phone: "ফোন",
      address: "ঠিকানা",
      debt: "বাকি",
      receivePayment: "টাকা নিন"
    },
    staff: {
      title: "কর্মী",
      addStaff: "কর্মী যোগ"
    }
  }
};
