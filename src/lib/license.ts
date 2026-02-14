// src/lib/license.ts

/**
 * DOKANDAR BONDHU - LICENSE MANAGEMENT SYSTEM
 * Handles 7-day trial, paid status, and offline activation.
 */

// --- CONFIGURATION ---
const SECRET_KEY = "BONDHU-PRO-2024"; // <--- CHANGE THIS TO YOUR DESIRED LICENSE KEY
const TRIAL_DAYS = 7;

// --- STORAGE KEYS ---
const KEY_INSTALL_DATE = 'dokandar_install_date';
const KEY_PAID_STATUS = 'dokandar_paid_status';

/**
 * 1. Checks if user is Paid.
 * 2. If not, checks/generates Trial.
 * 3. If Trial expired, blocks access and shows Activation Screen.
 */
export function checkLicenseAndAccess(): boolean {
  // 1. Check Paid Status First
  const paidStatus = localStorage.getItem(KEY_PAID_STATUS);
  if (paidStatus === 'ACTIVE') {
    return true; // Unlimited Access
  }

  // 2. Check Trial Dates
  let installDateStr = localStorage.getItem(KEY_INSTALL_DATE);
  const now = new Date();

  if (!installDateStr) {
    // First Time Launch: Start Trial
    localStorage.setItem(KEY_INSTALL_DATE, now.toISOString());
    console.log("Dokandar Bondhu: Trial Started (7 Days)");
    return true;
  }

  // 3. Calculate Remaining Days
  const installDate = new Date(installDateStr);
  const diffTime = now.getTime() - installDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= TRIAL_DAYS) {
    const remaining = TRIAL_DAYS - diffDays;
    console.log(`Trial Active: Day ${diffDays + 1} of ${TRIAL_DAYS}. ${remaining} days remaining.`);
    return true;
  }

  // 4. Trial Expired - Block Access
  showActivationScreen();
  return false;
}

/**
 * Replaces the DOM with a styled Activation Screen
 */
function showActivationScreen() {
  // Expose validate function to global scope for the button onclick
  (window as any).validateLicense = () => {
    const input = document.getElementById('licenseInput') as HTMLInputElement;
    const errorEl = document.getElementById('licenseError');
    
    if (!input) return;

    const userKey = input.value.trim();

    if (userKey === SECRET_KEY) {
      localStorage.setItem(KEY_PAID_STATUS, 'ACTIVE');
      alert("✅ Activation Successful! Welcome to Dokandar Bondhu Pro.");
      window.location.reload();
    } else {
      if (errorEl) errorEl.style.display = 'block';
      input.style.borderColor = '#EF4444'; // Red border for error
      input.value = ''; // Clear input
    }
  };

  // UI Styles matching the App Theme (Prussian Blue & Orange)
  document.body.innerHTML = `
    <div style="
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      background-color: #14213D; 
      color: white; 
      font-family: 'Hind Siliguri', sans-serif; 
      text-align: center; 
      padding: 24px; 
      margin: 0;
      box-sizing: border-box;
    ">
      <div style="
        background: white; 
        color: #14213D; 
        padding: 32px; 
        border-radius: 24px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
        max-width: 400px; 
        width: 100%;
        box-sizing: border-box;
      ">
        <!-- Icon -->
        <div style="
          width: 60px; height: 60px; 
          background: #FFF7ED; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto 20px;
          font-size: 24px;
        ">🔒</div>
  
        <h1 style="font-size: 24px; margin: 0 0 8px 0; font-weight: 800; font-family: 'Federant', cursive;">
          Trial Expired
        </h1>
        <p style="color: #6B7280; margin-bottom: 24px; font-size: 14px; line-height: 1.5;">
          Your 7-day free trial has ended. Enter your license key to continue managing your business.
        </p>
        
        <input 
          type="text" 
          id="licenseInput" 
          placeholder="Enter License Key" 
          style="
            width: 100%; 
            padding: 14px; 
            border: 2px solid #E5E7EB; 
            border-radius: 12px; 
            margin-bottom: 8px; 
            text-align: center; 
            font-size: 16px; 
            outline: none; 
            font-weight: 600;
            box-sizing: border-box;
          "
        />
        
        <p id="licenseError" style="
          color: #EF4444; 
          font-size: 12px; 
          display: none; 
          margin: 0 0 16px 0; 
          font-weight: bold;
        ">
          ❌ Invalid Code. Please try again.
        </p>
        
        <button 
          onclick="validateLicense()" 
          style="
            width: 100%; 
            padding: 14px; 
            background-color: #FCA311; 
            color: #14213D; 
            border: none; 
            border-radius: 12px; 
            font-weight: 800; 
            font-size: 16px; 
            cursor: pointer; 
            transition: transform 0.1s;
          "
        >
          Activate Now
        </button>
        
        <p style="margin-top: 24px; font-size: 12px; color: #9CA3AF;">
          Contact support to get your License Key.
        </p>
      </div>
    </div>
  `;
}
