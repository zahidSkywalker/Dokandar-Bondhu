// src/data/marketData.ts
import { MarketPrice } from '../types';

// ==========================================
// FULL DATA SET: All 211 Products
// ==========================================
export const RAW_DATA = {
  metadata: {
    title: "Bangladesh Market Prices 2026",
    description: "Comprehensive market prices for 420+ items in Bangladesh",
    last_updated: "2026-02-04",
    currency: "BDT",
    total_items: 211
  },
  categories: [
    {
      category: { en: "Rice & Cereals", bn: "চাল ও খাদ্যশ্য" },
      items: [
        { id: 1, name: { en: "Miniket Rice (Branded)", bn: "মিনিকেট চাল (ব্র্যান্ডেড)" }, unit: "kg", price: 84, price_range: { min: 83, max: 85 } },
        { id: 2, name: { en: "Miniket Rice (Non-branded)", bn: "মিনিকেট চাল (নন-ব্র্যান্ডেড)" }, unit: "kg", price: 75, price_range: { min: 72, max: 75 } },
        { id: 3, name: { en: "Nazirshail Rice", bn: "নাজিরশাইল চাল" }, unit: "kg", price: 78, price_range: { min: 72, max: 85 } },
        { id: 4, name: { en: "Atap Rice (Coarse)", bn: "আটপ চাল (মোটা)" }, unit: "kg", price: 58, price_range: { min: 55, max: 62 } },
        { id: 5, name: { en: "Wheat Flour (Atta)", bn: "আটা (গমের)" }, unit: "kg", price: 52, price_range: { min: 48, max: 55 } },
        { id: 6, name: { en: "Parboiled Rice", bn: "সেদ্ধ চাল" }, unit: "kg", price: 62, price_range: { min: 60, max: 65 } },
        { id: 7, name: { en: "Swarna Rice", bn: "স্বর্ণা চাল" }, unit: "kg", price: 70, price_range: { min: 68, max: 72 } },
        { id: 8, name: { en: "Boro Rice", bn: "বোরো চাল" }, unit: "kg", price: 64, price_range: { min: 62, max: 66 } },
        { id: 9, name: { en: "Aman Rice", bn: "আমন চাল" }, unit: "kg", price: 66, price_range: { min: 64, max: 68 } },
        { id: 10, name: { en: "Aus Rice", bn: "আউস চাল" }, unit: "kg", price: 60, price_range: { min: 58, max: 62 } },
        { id: 11, name: { en: "Hybrid Rice (Boro)", bn: "হাইব্রিড চাল (বোরো)" }, unit: "kg", price: 68, price_range: { min: 66, max: 70 } },
        { id: 12, name: { en: "Hybrid Rice (Aman)", bn: "হাইব্রিড চাল (আমন)" }, unit: "kg", price: 67, price_range: { min: 65, max: 69 } },
        { id: 13, name: { en: "Oats", bn: "ওটস" }, unit: "kg", price: 280, price_range: { min: 250, max: 320 } },
        { id: 14, name: { en: "Corn/Maize", bn: "ভুট্টা" }, unit: "kg", price: 45, price_range: { min: 42, max: 48 } },
        { id: 15, name: { en: "Puffed Rice (Muri)", bn: "মুড়ি" }, unit: "kg", price: 65, price_range: { min: 60, max: 70 } },
        { id: 16, name: { en: "Flattened Rice (Chira)", bn: "চিড়া" }, unit: "kg", price: 70, price_range: { min: 65, max: 75 } },
        { id: 17, name: { en: "Popped Rice (Khoi)", bn: "খই" }, unit: "kg", price: 80, price_range: { min: 75, max: 85 } }
      ]
    },
    {
      category: { en: "Vegetables", bn: "সবজি" },
      items: [
        { id: 30, name: { en: "Potato (Local)", bn: "আলু (দেশীয়)" }, unit: "kg", price: 25, price_range: { min: 22, max: 28 } },
        { id: 31, name: { en: "Potato (Premium)", bn: "আলু (প্রিমিয়াম)" }, unit: "kg", price: 32, price_range: { min: 30, max: 35 } },
        { id: 32, name: { en: "Onion (Local)", bn: "পেঁয়াজ (দেশীয়)" }, unit: "kg", price: 105, price_range: { min: 95, max: 110 } },
        { id: 33, name: { en: "Onion (Indian Imported)", bn: "পেঁয়াজ (ভারতীয় আমদানি)" }, unit: "kg", price: 75, price_range: { min: 70, max: 80 } },
        { id: 34, name: { en: "Garlic (Local)", bn: "রসুন (দেশীয়)" }, unit: "kg", price: 220, price_range: { min: 200, max: 240 } },
        { id: 35, name: { en: "Garlic (Imported)", bn: "রসুন (আমদানি)" }, unit: "kg", price: 125, price_range: { min: 120, max: 130 } },
        { id: 36, name: { en: "Ginger (Local)", bn: "আদা (দেশীয়)" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 37, name: { en: "Ginger (Imported)", bn: "আদা (আমদানি)" }, unit: "kg", price: 80, price_range: { min: 75, max: 85 } },
        { id: 38, name: { en: "Tomato", bn: "টমেটো" }, unit: "kg", price: 120, price_range: { min: 100, max: 140 } },
        { id: 39, name: { en: "Green Chili (Local)", bn: "কাঁচা মরিচ (দেশীয়)" }, unit: "kg", price: 140, price_range: { min: 120, max: 160 } },
        { id: 40, name: { en: "Green Chili (Thai)", bn: "কাঁচা মরিচ (থাই)" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 41, name: { en: "Eggplant (Brinjal)", bn: "বেগুন" }, unit: "kg", price: 60, price_range: { min: 50, max: 70 } },
        { id: 42, name: { en: "Long Eggplant", bn: "লম্বা বেগুন" }, unit: "kg", price: 55, price_range: { min: 50, max: 60 } },
        { id: 43, name: { en: "Bitter Gourd (Karela)", bn: "করলা" }, unit: "kg", price: 80, price_range: { min: 70, max: 90 } },
        { id: 44, name: { en: "Bottle Gourd (Lau)", bn: "লাউ" }, unit: "kg", price: 45, price_range: { min: 40, max: 50 } },
        { id: 45, name: { en: "Ridge Gourd (Jhinga)", bn: "ঝিঙ্গা" }, unit: "kg", price: 65, price_range: { min: 60, max: 70 } },
        { id: 46, name: { en: "Snake Gourd (Chichinga)", bn: "চিচিঙ্গা" }, unit: "kg", price: 70, price_range: { min: 65, max: 75 } },
        { id: 47, name: { en: "Pointed Gourd (Potol)", bn: "পটল" }, unit: "kg", price: 100, price_range: { min: 90, max: 110 } },
        { id: 48, name: { en: "Pumpkin (Misti Kumra)", bn: "মিষ্টি কুমড়া" }, unit: "kg", price: 35, price_range: { min: 30, max: 40 } },
        { id: 49, name: { en: "White Pumpkin (Chal Kumra)", bn: "চাল কুমড়া" }, unit: "kg", price: 30, price_range: { min: 25, max: 35 } },
        { id: 50, name: { en: "Okra (Bhindi/Dherosh)", bn: "ঢেঁড়স" }, unit: "kg", price: 100, price_range: { min: 90, max: 110 } },
        { id: 51, name: { en: "Cucumber", bn: "শসা" }, unit: "kg", price: 50, price_range: { min: 45, max: 55 } },
        { id: 52, name: { en: "Carrot", bn: "গাজর" }, unit: "kg", price: 60, price_range: { min: 55, max: 65 } },
        { id: 53, name: { en: "Radish (White)", bn: "মুলা (সাদা)" }, unit: "kg", price: 35, price_range: { min: 30, max: 40 } },
        { id: 54, name: { en: "Turnip", bn: "শালগম" }, unit: "kg", price: 40, price_range: { min: 35, max: 45 } },
        { id: 55, name: { en: "Beetroot", bn: "বিটরুট" }, unit: "kg", price: 70, price_range: { min: 65, max: 75 } },
        { id: 56, name: { en: "Cabbage", bn: "বাঁধাকপি" }, unit: "kg", price: 40, price_range: { min: 35, max: 45 } },
        { id: 57, name: { en: "Cauliflower", bn: "ফুলকপি" }, unit: "kg", price: 50, price_range: { min: 45, max: 55 } },
        { id: 58, name: { en: "Broccoli", bn: "ব্রকলি" }, unit: "kg", price: 150, price_range: { min: 140, max: 160 } },
        { id: 59, name: { en: "Spinach (Palak)", bn: "পালং শাক" }, unit: "bundle", price: 15, price_range: { min: 12, max: 18 } },
        { id: 60, name: { en: "Red Amaranth (Lal Shak)", bn: "লাল শাক" }, unit: "bundle", price: 12, price_range: { min: 10, max: 15 } },
        { id: 61, name: { en: "Data Shak", bn: "ডাটা শাক" }, unit: "bundle", price: 10, price_range: { min: 8, max: 12 } },
        { id: 62, name: { en: "Mustard Greens (Shorshe Shak)", bn: "সরিষা শাক" }, unit: "bundle", price: 15, price_range: { min: 12, max: 18 } },
        { id: 63, name: { en: "Water Spinach (Kalmi Shak)", bn: "কলমি শাক" }, unit: "bundle", price: 12, price_range: { min: 10, max: 15 } },
        { id: 64, name: { en: "Fenugreek Leaves (Methi Shak)", bn: "মেথি শাক" }, unit: "bundle", price: 18, price_range: { min: 15, max: 20 } },
        { id: 65, name: { en: "Coriander Leaves (Dhonia Pata)", bn: "ধনিয়া পাতা" }, unit: "bundle", price: 10, price_range: { min: 8, max: 12 } },
        { id: 66, name: { en: "Mint Leaves (Pudina Pata)", bn: "পুদিনা পাতা" }, unit: "bundle", price: 15, price_range: { min: 12, max: 18 } },
        { id: 67, name: { en: "Curry Leaves (Karipata)", bn: "কারিপাতা" }, unit: "bundle", price: 20, price_range: { min: 18, max: 22 } },
        { id: 68, name: { en: "Spring Onion (Peyajkoli)", bn: "পেঁয়াজকলি" }, unit: "bundle", price: 15, price_range: { min: 12, max: 18 } },
        { id: 69, name: { en: "Green Beans (Sheem)", bn: "শিম" }, unit: "kg", price: 70, price_range: { min: 60, max: 80 } },
        { id: 70, name: { en: "Flat Beans (Sheem - Flat)", bn: "শিম (চ্যাপ্টা)" }, unit: "kg", price: 75, price_range: { min: 65, max: 85 } },
        { id: 71, name: { en: "String Beans", bn: "বরবটি" }, unit: "kg", price: 65, price_range: { min: 60, max: 70 } },
        { id: 72, name: { en: "Yard Long Beans (Barbati)", bn: "বরবটি (লম্বা)" }, unit: "kg", price: 60, price_range: { min: 55, max: 65 } },
        { id: 73, name: { en: "Green Peas", bn: "মটরশুঁটি" }, unit: "kg", price: 120, price_range: { min: 110, max: 130 } },
        { id: 74, name: { en: "Sweet Corn", bn: "মিষ্টি ভুট্টা" }, unit: "kg", price: 55, price_range: { min: 50, max: 60 } },
        { id: 75, name: { en: "Baby Corn", bn: "বেবি কর্ন" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 76, name: { en: "Capsicum (Bell Pepper - Green)", bn: "ক্যাপসিকাম (সবুজ)" }, unit: "kg", price: 250, price_range: { min: 220, max: 280 } },
        { id: 77, name: { en: "Capsicum (Bell Pepper - Red)", bn: "ক্যাপসিকাম (লাল)" }, unit: "kg", price: 350, price_range: { min: 320, max: 380 } },
        { id: 78, name: { en: "Capsicum (Bell Pepper - Yellow)", bn: "ক্যাপসিকাম (হলুদ)" }, unit: "kg", price: 380, price_range: { min: 350, max: 400 } },
        { id: 79, name: { en: "Lettuce", bn: "লেটুস" }, unit: "kg", price: 120, price_range: { min: 100, max: 140 } },
        { id: 80, name: { en: "Papaya (Green)", bn: "পেঁপে (কাঁচা)" }, unit: "kg", price: 30, price_range: { min: 25, max: 35 } },
        { id: 81, name: { en: "Jackfruit (Green)", bn: "কাঠাল (কাঁচা)" }, unit: "kg", price: 40, price_range: { min: 35, max: 45 } },
        { id: 82, name: { en: "Drumstick (Sajna)", bn: "সজনে" }, unit: "kg", price: 80, price_range: { min: 70, max: 90 } },
        { id: 83, name: { en: "Taro Root (Kochu)", bn: "কচু" }, unit: "kg", price: 50, price_range: { min: 45, max: 55 } },
        { id: 84, name: { en: "Taro Stolon (Kochu Loti)", bn: "কচু লতি" }, unit: "kg", price: 60, price_range: { min: 55, max: 65 } },
        { id: 85, name: { en: "Sweet Potato", bn: "মিষ্টি আলু" }, unit: "kg", price: 45, price_range: { min: 40, max: 50 } },
        { id: 86, name: { en: "Elephant Foot Yam (Ol)", bn: "ওল" }, unit: "kg", price: 55, price_range: { min: 50, max: 60 } },
        { id: 87, name: { en: "Lotus Root (Kamal Kakri)", bn: "পদ্ম মূল" }, unit: "kg", price: 90, price_range: { min: 80, max: 100 } },
        { id: 88, name: { en: "Raw Banana (Kachkola)", bn: "কাঁচকলা" }, unit: "4 pcs", price: 40, price_range: { min: 35, max: 45 } },
        { id: 89, name: { en: "Mushroom (Button)", bn: "মাশরুম (বাটন)" }, unit: "kg", price: 280, price_range: { min: 250, max: 300 } },
        { id: 90, name: { en: "Mushroom (Oyster)", bn: "মাশরুম (অয়েস্টার)" }, unit: "kg", price: 250, price_range: { min: 230, max: 270 } },
        { id: 91, name: { en: "Zucchini", bn: "জুকিনি" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 92, name: { en: "Celery", bn: "সেলারি" }, unit: "bundle", price: 80, price_range: { min: 70, max: 90 } },
        { id: 93, name: { en: "Leek", bn: "লীক" }, unit: "kg", price: 150, price_range: { min: 140, max: 160 } }
      ]
    },
    {
      category: { en: "Spices", bn: "মসলা" },
      items: [
        { id: 94, name: { en: "Turmeric Powder", bn: "হলুদ গুঁড়া" }, unit: "kg", price: 320, price_range: { min: 300, max: 350 } },
        { id: 95, name: { en: "Turmeric Whole", bn: "গোটা হলুদ" }, unit: "kg", price: 106, price_range: { min: 96, max: 115 } },
        { id: 96, name: { en: "Turmeric (Indian)", bn: "হলুদ (ভারতীয়)" }, unit: "kg", price: 120, price_range: { min: 115, max: 125 } },
        { id: 97, name: { en: "Red Chili Powder", bn: "লাল মরিচ গুঁড়া" }, unit: "kg", price: 420, price_range: { min: 380, max: 450 } },
        { id: 98, name: { en: "Dried Red Chili (Panchagarh)", bn: "শুকনা লাল মরিচ (পঞ্চগড়)" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 99, name: { en: "Dried Red Chili (Indian)", bn: "শুকনা লাল মরিচ (ভারতীয় আমদানি)" }, unit: "kg", price: 280, price_range: { min: 250, max: 300 } },
        { id: 100, name: { en: "Dried Red Chili (Myanmar)", bn: "শুকনা লাল মরিচ (মিয়ানমার)" }, unit: "kg", price: 230, price_range: { min: 210, max: 250 } },
        { id: 101, name: { en: "Dried Red Chili (Comilla)", bn: "শুকনা লাল মরিচ (কুমিল্লা)" }, unit: "kg", price: 190, price_range: { min: 170, max: 210 } },
        { id: 102, name: { en: "Cumin Seeds (Jeera)", bn: "জিরা" }, unit: "kg", price: 400, price_range: { min: 370, max: 430 } },
        { id: 103, name: { en: "Cumin Powder", bn: "জিরা গুঁড়া" }, unit: "kg", price: 750, price_range: { min: 700, max: 800 } },
        { id: 104, name: { en: "Black Cumin (Kalonji)", bn: "কালোজিরা" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 105, name: { en: "Coriander Seeds (Dhonia)", bn: "ধনিয়া" }, unit: "kg", price: 280, price_range: { min: 260, max: 300 } },
        { id: 106, name: { en: "Coriander Powder", bn: "ধনিয়া গুঁড়া" }, unit: "kg", price: 350, price_range: { min: 320, max: 380 } },
        { id: 107, name: { en: "Black Pepper Whole", bn: "গোল মরিচ" }, unit: "kg", price: 580, price_range: { min: 550, max: 610 } },
        { id: 108, name: { en: "Black Pepper Powder", bn: "গোল মরিচ গুঁড়া" }, unit: "kg", price: 650, price_range: { min: 620, max: 680 } },
        { id: 109, name: { en: "White Pepper", bn: "সাদা মরিচ" }, unit: "kg", price: 1200, price_range: { min: 1150, max: 1250 } },
        { id: 110, name: { en: "Cardamom (Green)", bn: "এলাচ (সবুজ)" }, unit: "kg", price: 1490, price_range: { min: 1420, max: 1550 } },
        { id: 111, name: { en: "Cardamom Powder", bn: "এলাচ গুঁড়া" }, unit: "kg", price: 1600, price_range: { min: 1500, max: 1700 } },
        { id: 112, name: { en: "Cinnamon Stick (Daruchini)", bn: "দারুচিনি" }, unit: "kg", price: 308, price_range: { min: 290, max: 330 } },
        { id: 113, name: { en: "Cinnamon Powder", bn: "দারুচিনি গুঁড়া" }, unit: "kg", price: 380, price_range: { min: 350, max: 400 } },
        { id: 114, name: { en: "Cloves (Lobongo)", bn: "লবঙ্গ" }, unit: "kg", price: 1040, price_range: { min: 1000, max: 1080 } },
        { id: 115, name: { en: "Bay Leaf (Tejpata)", bn: "তেজপাতা" }, unit: "kg", price: 250, price_range: { min: 230, max: 280 } },
        { id: 116, name: { en: "Mustard Seeds (Yellow)", bn: "সরিষা (হলুদ)" }, unit: "kg", price: 180, price_range: { min: 165, max: 195 } },
        { id: 117, name: { en: "Mustard Seeds (Black)", bn: "সরিষা (কালো)" }, unit: "kg", price: 200, price_range: { min: 185, max: 215 } },
        { id: 118, name: { en: "Fenugreek Seeds (Methi)", bn: "মেথি" }, unit: "kg", price: 220, price_range: { min: 200, max: 240 } },
        { id: 119, name: { en: "Fennel Seeds (Mouri)", bn: "মৌরি" }, unit: "kg", price: 380, price_range: { min: 360, max: 400 } },
        { id: 120, name: { en: "Anise Seeds (Aniseed)", bn: "মৌরি (আনিসিড)" }, unit: "kg", price: 450, price_range: { min: 420, max: 480 } },
        { id: 121, name: { en: "Star Anise (Chakri Phul)", bn: "চক্রিফুল" }, unit: "kg", price: 850, price_range: { min: 800, max: 900 } },
        { id: 122, name: { en: "Poppy Seeds (Posto)", bn: "পোস্ত" }, unit: "kg", price: 680, price_range: { min: 650, max: 720 } },
        { id: 123, name: { en: "Sesame Seeds (White)", bn: "তিল (সাদা)" }, unit: "kg", price: 280, price_range: { min: 260, max: 300 } },
        { id: 124, name: { en: "Sesame Seeds (Black)", bn: "তিল (কালো)" }, unit: "kg", price: 320, price_range: { min: 300, max: 340 } },
        { id: 125, name: { en: "Nutmeg (Jaiphal)", bn: "জায়ফল" }, unit: "kg", price: 1800, price_range: { min: 1700, max: 1900 } },
        { id: 126, name: { en: "Mace (Jawitri)", bn: "জয়িত্রী" }, unit: "kg", price: 2200, price_range: { min: 2100, max: 2300 } },
        { id: 127, name: { en: "Saffron", bn: "জাফরান" }, unit: "gram", price: 850, price_range: { min: 800, max: 900 } },
        { id: 128, name: { en: "Dried Mango Powder (Amchur)", bn: "আমচুর" }, unit: "kg", price: 450, price_range: { min: 420, max: 480 } },
        { id: 129, name: { en: "Tamarind (Tetul)", bn: "তেঁতুল" }, unit: "kg", price: 250, price_range: { min: 230, max: 280 } },
        { id: 130, name: { en: "Dried Kokum", bn: "শুকনা কোকাম" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 131, name: { en: "Carom Seeds (Ajwain)", bn: "আজোয়ান" }, unit: "kg", price: 380, price_range: { min: 350, max: 400 } },
        { id: 132, name: { en: "Dry Ginger Powder (Shuntho)", bn: "শুঁঠ" }, unit: "kg", price: 520, price_range: { min: 480, max: 560 } },
        { id: 133, name: { en: "Panch Phoron", bn: "পাঁচফোড়ন" }, unit: "kg", price: 320, price_range: { min: 300, max: 350 } },
        { id: 134, name: { en: "Garam Masala", bn: "গরম মসলা" }, unit: "kg", price: 680, price_range: { min: 650, max: 720 } },
        { id: 135, name: { en: "Biryani Masala", bn: "বিরিয়ানি মসলা" }, unit: "kg", price: 750, price_range: { min: 700, max: 800 } },
        { id: 136, name: { en: "Meat Masala", bn: "মাংস মসলা" }, unit: "kg", price: 680, price_range: { min: 650, max: 720 } },
        { id: 137, name: { en: "Fish Masala", bn: "মাছ মসলা" }, unit: "kg", price: 620, price_range: { min: 580, max: 650 } },
        { id: 138, name: { en: "Curry Powder", bn: "কারি পাউডার" }, unit: "kg", price: 580, price_range: { min: 550, max: 620 } },
        { id: 139, name: { en: "Chaat Masala", bn: "চাট মসলা" }, unit: "kg", price: 720, price_range: { min: 680, max: 760 } },
        { id: 140, name: { en: "Radhuni Turmeric Powder (200g)", bn: "রাধুনি হলুদ গুঁড়া (২০০ গ্রাম)" }, unit: "pack", price: 160, price_range: { min: 155, max: 165 } },
        { id: 141, name: { en: "Radhuni Chili Powder (200g)", bn: "রাধুনি মরিচ গুঁড়া (২০০ গ্রাম)" }, unit: "pack", price: 160, price_range: { min: 155, max: 165 } },
        { id: 142, name: { en: "Radhuni Cumin Powder (500g)", bn: "রাধুনি জিরা গুঁড়া (৫০০ গ্রাম)" }, unit: "pack", price: 750, price_range: { min: 730, max: 770 } },
        { id: 143, name: { en: "Garlic Paste (200g)", bn: "রসুন বাটা (২০০ গ্রাম)" }, unit: "pack", price: 70, price_range: { min: 65, max: 75 } },
        { id: 144, name: { en: "Green Chili Paste (200g)", bn: "কাঁচা মরিচ বাটা (২০০ গ্রাম)" }, unit: "pack", price: 50, price_range: { min: 45, max: 55 } },
        { id: 145, name: { en: "Onion Paste (200g)", bn: "পেঁয়াজ বাটা (২০০ গ্রাম)" }, unit: "pack", price: 85, price_range: { min: 80, max: 90 } },
        { id: 146, name: { en: "Ginger Paste (200g)", bn: "আদা বাটা (২০০ গ্রাম)" }, unit: "pack", price: 75, price_range: { min: 70, max: 80 } },
        { id: 147, name: { en: "Mixed Pickle (Achar)", bn: "মিশ্র আচার" }, unit: "kg", price: 280, price_range: { min: 250, max: 320 } },
        { id: 148, name: { en: "Mango Pickle", bn: "আমের আচার" }, unit: "kg", price: 320, price_range: { min: 280, max: 350 } }
      ]
    },
    {
      category: { en: "Meat & Fish", bn: "মাংস ও মাছ" },
      items: [
        { id: 149, name: { en: "Beef (with bone)", bn: "গরুর মাংস (হাড় সহ)" }, unit: "kg", price: 600, price_range: { min: 580, max: 620 } },
        { id: 150, name: { en: "Beef (boneless)", bn: "গরুর মাংস (হাড় ছাড়া)" }, unit: "kg", price: 800, price_range: { min: 750, max: 850 } },
        { id: 151, name: { en: "Beef (premium cut)", bn: "গরুর মাংস (প্রিমিয়াম কাট)" }, unit: "kg", price: 950, price_range: { min: 900, max: 1000 } },
        { id: 152, name: { en: "Beef Liver", bn: "গরুর কলিজা" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 153, name: { en: "Beef Brain (Mogoj)", bn: "গরুর মগজ" }, unit: "kg", price: 650, price_range: { min: 620, max: 680 } },
        { id: 154, name: { en: "Beef Hooves (Paya)", bn: "গরুর পায়া" }, unit: "kg", price: 540, price_range: { min: 500, max: 580 } },
        { id: 155, name: { en: "Mutton (with bone)", bn: "খাসির মাংস (হাড় সহ)" }, unit: "kg", price: 980, price_range: { min: 950, max: 1020 } },
        { id: 156, name: { en: "Mutton (boneless)", bn: "খাসির মাংস (হাড় ছাড়া)" }, unit: "kg", price: 1250, price_range: { min: 1200, max: 1300 } },
        { id: 157, name: { en: "Goat Meat (Local)", bn: "ছাগলের মাংস (দেশীয়)" }, unit: "kg", price: 850, price_range: { min: 800, max: 900 } },
        { id: 158, name: { en: "Chicken (Broiler - whole)", bn: "মুরগি (ব্রযলার - পুরো)" }, unit: "kg", price: 165, price_range: { min: 155, max: 175 } },
        { id: 159, name: { en: "Chicken (Broiler - boneless)", bn: "মুরগি (ব্রযলার - হাড় ছাড়া)" }, unit: "kg", price: 420, price_range: { min: 400, max: 450 } },
        { id: 160, name: { en: "Chicken Breast (Boneless)", bn: "মুরগির বুকের মাংস (হাড় ছাড়া)" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 161, name: { en: "Chicken Thigh (Boneless)", bn: "মুরগির ঊরুর মাংস (হাড় ছাড়া)" }, unit: "kg", price: 440, price_range: { min: 420, max: 460 } },
        { id: 162, name: { en: "Chicken Drumstick", bn: "মুরগির পা" }, unit: "kg", price: 320, price_range: { min: 300, max: 350 } },
        { id: 163, name: { en: "Chicken Wings", bn: "মুরগির ডানা" }, unit: "kg", price: 280, price_range: { min: 260, max: 300 } },
        { id: 164, name: { en: "Chicken Liver", bn: "মুরগির কলিজা" }, unit: "kg", price: 220, price_range: { min: 200, max: 240 } },
        { id: 165, name: { en: "Chicken (Deshi/Country - whole)", bn: "দেশী মুরগি (পুরো)" }, unit: "kg", price: 590, price_range: { min: 570, max: 620 } },
        { id: 166, name: { en: "Chicken (Pakistani)", bn: "পাকিস্তানি মুরগি" }, unit: "kg", price: 265, price_range: { min: 250, max: 280 } },
        { id: 167, name: { en: "Duck Meat", bn: "হাঁসের মাংস" }, unit: "kg", price: 420, price_range: { min: 400, max: 450 } },
        { id: 168, name: { en: "Quail (Batair)", bn: "বাটের (পাখি)" }, unit: "piece", price: 85, price_range: { min: 80, max: 90 } },
        { id: 169, name: { en: "Pigeon (Kobutor)", bn: "কবুতর" }, unit: "piece", price: 180, price_range: { min: 160, max: 200 } },
        { id: 170, name: { en: "Hilsa Fish (1 kg size)", bn: "ইলিশ মাছ (১ কেজি সাইজ)" }, unit: "kg", price: 2650, price_range: { min: 2500, max: 2800 } },
        { id: 171, name: { en: "Hilsa Fish (1.5 kg size)", bn: "ইলিশ মাছ (১.৫ কেজি সাইজ)" }, unit: "kg", price: 3200, price_range: { min: 3000, max: 3400 } },
        { id: 172, name: { en: "Hilsa Fish (small 150-200g)", bn: "ইলিশ মাছ (ছোট ১৫০-২০০ গ্রাম)" }, unit: "kg", price: 675, price_range: { min: 650, max: 700 } },
        { id: 173, name: { en: "Rui Fish (Farmed)", bn: "রুই মাছ (চাষের)" }, unit: "kg", price: 400, price_range: { min: 350, max: 450 } },
        { id: 174, name: { en: "Katla Fish (Farmed)", bn: "কাতলা মাছ (চাষের)" }, unit: "kg", price: 450, price_range: { min: 400, max: 500 } },
        { id: 175, name: { en: "Katla Fish (River)", bn: "কাতলা মাছ (নদীর)" }, unit: "kg", price: 650, price_range: { min: 600, max: 700 } },
        { id: 176, name: { en: "Pangash Fish (Farmed)", bn: "পাঙ্গাশ মাছ (চাষের)" }, unit: "kg", price: 175, price_range: { min: 150, max: 200 } },
        { id: 177, name: { en: "Pangas Fish (River)", bn: "পাঙ্গাস মাছ (নদীর)" }, unit: "kg", price: 900, price_range: { min: 800, max: 1000 } },
        { id: 178, name: { en: "Tilapia Fish", bn: "তেলাপিয়া মাছ" }, unit: "kg", price: 180, price_range: { min: 160, max: 200 } },
        { id: 179, name: { en: "Boal Fish (Local)", bn: "বোয়াল মাছ (দেশীয়)" }, unit: "kg", price: 900, price_range: { min: 800, max: 1000 } },
        { id: 180, name: { en: "Boal Fish (Farmed)", bn: "বোয়াল মাছ (চাষের)" }, unit: "kg", price: 525, price_range: { min: 500, max: 550 } },
        { id: 181, name: { en: "Koi Fish (Farmed)", bn: "কৈ মাছ (চাষের)" }, unit: "kg", price: 210, price_range: { min: 200, max: 220 } },
        { id: 182, name: { en: "Koi Fish (Local)", bn: "কৈ মাছ (দেশীয়)" }, unit: "kg", price: 900, price_range: { min: 800, max: 1000 } },
        { id: 183, name: { en: "Shing Fish (Farmed)", bn: "শিং মাছ (চাষের)" }, unit: "kg", price: 350, price_range: { min: 300, max: 400 } },
        { id: 184, name: { en: "Shing Fish (Local)", bn: "শিং মাছ (দেশীয়)" }, unit: "kg", price: 900, price_range: { min: 800, max: 1000 } },
        { id: 185, name: { en: "Magur Fish", bn: "মাগুর মাছ" }, unit: "kg", price: 420, price_range: { min: 400, max: 450 } },
        { id: 186, name: { en: "Tengra Fish", bn: "টেংরা মাছ" }, unit: "kg", price: 475, price_range: { min: 450, max: 550 } },
        { id: 187, name: { en: "Pabda Fish", bn: "পাবদা মাছ" }, unit: "kg", price: 650, price_range: { min: 600, max: 700 } },
        { id: 188, name: { en: "Chital Fish (Chitol)", bn: "চিতল মাছ" }, unit: "kg", price: 550, price_range: { min: 500, max: 600 } },
        { id: 189, name: { en: "Ayre Fish (Air)", bn: "আইর মাছ" }, unit: "kg", price: 1100, price_range: { min: 1000, max: 1200 } },
        { id: 190, name: { en: "Koral Fish", bn: "কোরাল মাছ" }, unit: "kg", price: 650, price_range: { min: 600, max: 700 } },
        { id: 191, name: { en: "Silver Carp", bn: "সিলভার কার্প" }, unit: "kg", price: 220, price_range: { min: 200, max: 240 } },
        { id: 192, name: { en: "Grass Carp", bn: "গ্রাস কার্প" }, unit: "kg", price: 240, price_range: { min: 220, max: 260 } },
        { id: 193, name: { en: "Mirror Carp", bn: "মিরর কার্প" }, unit: "kg", price: 280, price_range: { min: 260, max: 300 } },
        { id: 194, name: { en: "Rupchanda Fish (Pomfret)", bn: "রূপচাঁদা মাছ" }, unit: "kg", price: 850, price_range: { min: 800, max: 900 } },
        { id: 195, name: { en: "Salmon Fish (Imported)", bn: "স্যামন মাছ (আমদানি)" }, unit: "kg", price: 1800, price_range: { min: 1700, max: 1900 } },
        { id: 196, name: { en: "Mackerel (Rupchanda - small)", bn: "ম্যাকরেল (ছোট রূপচাঁদা)" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 197, name: { en: "Sardine Fish", bn: "সারডিন মাছ" }, unit: "kg", price: 380, price_range: { min: 350, max: 420 } },
        { id: 198, name: { en: "Loitta Fish (Bombay Duck)", bn: "লইট্টা মাছ" }, unit: "kg", price: 420, price_range: { min: 400, max: 450 } },
        { id: 199, name: { en: "Surma Fish", bn: "সুরমা মাছ" }, unit: "kg", price: 480, price_range: { min: 450, max: 520 } },
        { id: 200, name: { en: "Tuna Fish", bn: "টুনা মাছ" }, unit: "kg", price: 950, price_range: { min: 900, max: 1000 } },
        { id: 201, name: { en: "Prawn (Golda - Large)", bn: "চিংড়ি (গলদা - বড়)" }, unit: "kg", price: 850, price_range: { min: 700, max: 1000 } },
        { id: 202, name: { en: "Prawn (Bagda - Medium)", bn: "চিংড়ি (বাগদা - মাঝারি)" }, unit: "kg", price: 650, price_range: { min: 600, max: 700 } },
        { id: 203, name: { en: "Prawn (Chaka)", bn: "চিংড়ি (চাকা)" }, unit: "kg", price: 380, price_range: { min: 350, max: 420 } },
        { id: 204, name: { en: "Prawn (Small - Misti)", bn: "চিংড়ি (ছোট - মিস্টি)" }, unit: "kg", price: 280, price_range: { min: 250, max: 320 } },
        { id: 205, name: { en: "Crab (Kakra)", bn: "কাঁকড়া" }, unit: "kg", price: 650, price_range: { min: 600, max: 700 } },
        { id: 206, name: { en: "Dried Fish (Shutki - Loitta)", bn: "শুটকি মাছ (লইট্টা)" }, unit: "kg", price: 1200, price_range: { min: 1100, max: 1300 } },
        { id: 207, name: { en: "Dried Fish (Shutki - Rupchanda)", bn: "শুটকি মাছ (রূপচাঁদা)" }, unit: "kg", price: 1500, price_range: { min: 1400, max: 1600 } },
        { id: 208, name: { en: "Dried Prawn (Shutki Chingri)", bn: "শুটকি চিংড়ি" }, unit: "kg", price: 1800, price_range: { min: 1700, max: 1900 } },
        { id: 209, name: { en: "Fish Roe (Dim)", bn: "মাছের ডিম" }, unit: "kg", price: 420, price_range: { min: 400, max: 450 } }
      ]
    },
    {
      category: { en: "Fruits", bn: "ফলমূল" },
      items: [
        { id: 1001, name: { en: "Banana", bn: "কলা" }, unit: "kg", price: 65, price_range: { min: 60, max: 70 } },
        { id: 1002, name: { en: "Mango", bn: "আম" }, unit: "kg", price: 120, price_range: { min: 110, max: 130 } },
        { id: 1003, name: { en: "Watermelon", bn: "তরমুজ" }, unit: "kg", price: 45, price_range: { min: 40, max: 50 } }
      ]
    },
    {
      category: { en: "Daily Essentials", bn: "নিত্যপ্রয়োজনীয়" },
      items: [
        { id: 1004, name: { en: "Sugar", bn: "চিনি" }, unit: "kg", price: 130, price_range: { min: 120, max: 140 } },
        { id: 1005, name: { en: "Salt", bn: "লবণ" }, unit: "kg", price: 35, price_range: { min: 30, max: 40 } },
        { id: 1006, name: { en: "Tea Leaves", bn: "চা পাতা" }, unit: "kg", price: 320, price_range: { min: 300, max: 350 } },
        { id: 1007, name: { en: "Milk (Cow)", bn: "গরুর দুধ" }, unit: "liter", price: 80, price_range: { min: 75, max: 85 } },
        { id: 1008, name: { en: "Egg (Chicken)", bn: "মুরগির ডিম" }, unit: "dozen", price: 135, price_range: { min: 130, max: 140 } }
      ]
    }
  ]
};

/**
 * Helper to normalize category names to match UI Filter keys
 * "Rice & Cereals" -> "rice"
 * "Meat & Fish" -> "meat"
 * "Vegetables" -> "vegetables"
 * "Spices" -> "spices"
 * "Fruits" -> "fruits"
 * "Daily Essentials" -> "essentials"
 */
const normalizeCategoryKey = (categoryName: string): string => {
  const key = categoryName.toLowerCase();
  if (key.includes('rice') || key.includes('cereals')) return 'rice';
  if (key.includes('meat') || key.includes('fish')) return 'meat';
  if (key.includes('vegetable')) return 'vegetables'; // Added specifically for vegetables
  if (key.includes('spices')) return 'spices';
  if (key.includes('fruit')) return 'fruits';
  if (key.includes('essential') || key.includes('daily')) return 'essentials';  
  // Fallback: return lowercase version of name
  return key;
};

/**
 * Helper to map your JSON data to App's MarketPrice interface
 * Logic:
 * 1. Iterate through Categories
 * 2. Flatten 'items' arrays into a single list
 * 3. Map Name/Price to App Interface
 */
export const getMarketPrices = (): Omit<MarketPrice, 'id' | 'dateFetched'>[] => {
  let allItems: Omit<MarketPrice, 'id' | 'dateFetched'>[] = [];

  RAW_DATA.categories.forEach(cat => {
    // FIX: Normalize category name to match UI filters
    const catKey = normalizeCategoryKey(cat.category.en);
    
    cat.items.forEach(item => {
      allItems.push({
        nameEn: item.name.en,
        nameBn: item.name.bn,
        unit: item.unit,
        minPrice: item.price_range?.min || item.price || 0,
        maxPrice: item.price_range?.max || item.price || 0,
        category: catKey // Use normalized key
      });
    });
  });

  console.log(`Loaded ${allItems.length} market items.`);
  return allItems;
};
