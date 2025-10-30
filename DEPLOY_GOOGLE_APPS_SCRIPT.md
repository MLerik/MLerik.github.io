# Google Apps Script Deployment Guide

## Step-by-Step Instructions to Deploy with Trends

### 1. Open Your Script
1. Go to https://script.google.com
2. Find your "Villa Kunterbunt" project (or whatever you named it)

### 2. Update the Code
1. Click on **Code.gs** in the left sidebar
2. **Select ALL** the existing code (Ctrl+A / Cmd+A)
3. **Delete** it
4. Open the `google-apps-script.js` file from this repository
5. **Copy ALL** the code from that file
6. **Paste** it into Code.gs in your Apps Script editor

### 3. Verify Script Properties Still Exist
1. Click the **⚙️ (gear icon)** on the left sidebar for "Project Settings"
2. Scroll down to **Script Properties**
3. Verify these three properties exist:
   - `AIRTHINGS_CLIENT_ID`
   - `AIRTHINGS_CLIENT_SECRET`
   - `AIRTHINGS_DEVICE_SERIAL`
4. If they're missing, add them back with your credentials

### 4. Save the Script
1. Click the **💾 Save** icon or press Ctrl+S / Cmd+S
2. Wait for "Saved" confirmation

### 5. Test the Script (Optional but Recommended)
1. At the top, select function: **`testAirthingsConnection`**
2. Click **▶️ Run**
3. If prompted, authorize the script
4. Click **View** > **Logs** to see the test results
5. You should see temperature, humidity, VOC, mold data
6. **Check if trends appear in the logs!**

### 6. Deploy a New Version
1. Click **Deploy** button (top right)
2. Click **Manage deployments**
3. Click the **✏️ pencil icon** next to your active Web app deployment
4. Under "Version", select **New version**
5. Add description: "Added 24h trend indicators"
6. Click **Deploy**
7. Click **Done**

### 7. Copy the Deployment URL (if needed)
1. The URL should be the same as before
2. If you need it: Click the **📋 copy icon** next to the URL
3. It should match the URL in `index.html` line 485:
   ```
   https://script.google.com/macros/s/AKfycbz87bTwgcvTHScTlfwWyyEMjdZ_cEmGDLNWqMorcodVgwoxCHjeV263wKcPJds53bIS4A/exec
   ```

### 8. Test Your Webapp
1. Go to your Villa Kunterbunt webapp
2. Hard refresh: **Ctrl+Shift+R** / **Cmd+Shift+R**
3. Open browser console: **F12** > **Console** tab
4. Look for:
   - ✅ `Trends data: {humidity: 'falling', voc: 'stable', temperature: 'stable'}`
   - ✅ Small arrows (↑ → ↓) next to humidity and VOC values

---

## Troubleshooting

### "No trends data available" in console
- Make sure you deployed a **new version** (not just saved)
- The deployment needs to be a **Web app** type
- Clear your browser cache and hard refresh

### Trends show all "stable"
- This is normal if there hasn't been much change in 24h
- Wait for actual changes in conditions to see rising/falling trends

### Script errors
- Check Executions log: Click **⚙️** > **Executions**
- Look for error messages
- Verify Script Properties are set correctly

### Authorization issues
- Script needs these OAuth scopes:
  - External requests (UrlFetchApp)
  - Script properties access
- Re-run authorization if needed

---

## What the Trends Feature Does

The updated script:
1. Fetches **latest samples** (current readings)
2. Fetches **24h historical samples** from Airthings API
3. Compares first quarter vs last quarter of 24h data
4. Returns trend indicators:
   - **rising** (↑) - value increased by threshold
   - **falling** (↓) - value decreased by threshold
   - **stable** (→) - no significant change

### Thresholds:
- **Humidity**: ±3%
- **VOC**: ±50 ppb
- **Temperature**: ±1°C

These trends help you see if conditions are improving or getting worse over the day!
