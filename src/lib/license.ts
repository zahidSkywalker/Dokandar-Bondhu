// src/lib/license.ts

/**
 * DOKANDAR BONDHU - LICENSE MANAGEMENT SYSTEM
 * Handles 7-day trial, paid status, and offline activation.
 */

// --- CONFIGURATION ---
// CHANGE THIS to your own secret license key
const SECRET_KEY = "BONDHU-PRO-2024"; 
const TRIAL_DAYS = 7;

// --- STORAGE KEYS ---
const KEY_INSTALL_DATE = 'dokandar_install_date';
const KEY_PAID_STATUS = 'dokandar_paid_status';

// --- HELPER FUNCTIONS FOR UI (Used in Settings.tsx) ---

/**
 * Returns current license status for UI display.
 */
export const getLicenseStatus = (): { status: 'active' | 'trial' | 'expired', daysLeft: number } => {
  // 1. Check if Paid
  if (localStorage.getItem(KEY_PAID_STATUS) === 'ACTIVE') {
    return { status: 'active', daysLeft: 999 };
  }

  // 2. Check Trial
  const installDateStr = localStorage.getItem(KEY_INSTALL_DATE);
  if (!installDateStr) {
    // Fallback if install date missing (shouldn't happen normally)
    return { status: 'trial', daysLeft: TRIAL_DAYS }; 
  }

  const installDate = new Date(installDateStr);
  const now = new Date();
  const diffTime = now.getTime() - installDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = TRIAL_DAYS - diffDays;

  if (daysLeft <= 0) return { status: 'expired', daysLeft: 0 };
  return { status: 'trial', daysLeft };
};

/**
 * Validates a key and activates if correct.
 * Used by both the Lock Screen and Settings Page.
 */
export const validateAndActivate = (key: string): { success: boolean; message: string } => {
  if (key.trim() === SECRET_KEY) {
    localStorage.setItem(KEY_PAID_STATUS, 'ACTIVE');
    return { success: true, message: "Activation Successful!" };
  }
  return { success: false, message: "Invalid License Key" };
};

// --- MAIN ACCESS CHECK (Used in main.tsx) ---

/**
 * Main function to check license status.
 * Returns true if access is allowed.
 * Returns false and blocks UI if trial is expired.
 */
export function checkLicenseAndAccess(): boolean {
  // 1. Check if user is already paid
  const paidStatus = localStorage.getItem(KEY_PAID_STATUS);
  if (paidStatus === 'ACTIVE') {
    return true; // Allow access indefinitely
  }

  // 2. Check Trial Start Date
  let installDateStr = localStorage.getItem(KEY_INSTALL_DATE);
  const now = new Date();

  if (!installDateStr) {
    // First time load: Set the install date
    localStorage.setItem(KEY_INSTALL_DATE, now.toISOString());
    console.log("Trial started: 7 days remaining.");
    return true;
  }

  // 3. Calculate Expiration
  const installDate = new Date(installDateStr);
  const diffTime = Math.abs(now.getTime() - installDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > TRIAL_DAYS) {
    // Trial Expired - Block Access
    showActivationScreen();
    return false;
  }

  console.log(`Trial Day: ${diffDays} of ${TRIAL_DAYS}`);
  return true;
}

/**
 * Replaces the entire screen with the Activation UI.
 */
function showActivationScreen() {
  // Expose validate function to global scope for the button onclick
  (window as any).validateLicense = () => {
    const input = document.getElementById('licenseInput') as HTMLInputElement;
    const errorEl = document.getElementById('licenseError');
    
    if (!input) return;

    const result = validateAndActivate(input.value);

    if (result.success) {
      alert("✅ Activation Successful! Reloading...");
      window.location.reload();
    } else {
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = "❌ Invalid Code. Please try again.";
      }
      input.style.borderColor = '#EF4444'; // Red border
      input.value = '';
    }
  };

  // Inject the Activation UI
  // Using inline styles ensures it looks good even if CSS bundles fail
  document.body.innerHTML = `
    <div style="
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      background-color: #14213D; 
      color: white; 
      font-family: 'Segoe UI', sans-serif; 
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
          Invalid Code.
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
            transition: background 0.2s;
          "
          onmouseover="this.style.backgroundColor='#e69b10'"
          onmouseout="this.style.backgroundColor='#FCA311'"
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
