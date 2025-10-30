# Airthings Integration Setup Guide

This guide will walk you through setting up the Google Apps Script backend to securely connect your Villa Kunterbunt app to your Airthings Wave Mini device.

## Important Note: Advanced Protection Program

If your Google account has **Advanced Protection** enabled, you'll need to use a different Google account for this script:

1. Create a new free Google account (or use an existing one without Advanced Protection)
2. This account will only be used to run the backend script
3. The script will still be publicly accessible from your GitHub Pages site

**Why?** Advanced Protection blocks third-party scripts for security. Using a separate account keeps your main account protected while allowing the script to work.

---

## Step 1: Create New Google Apps Script Project

Since we're simplifying the app (no more data storage), let's create a fresh script:

1. Go to https://script.google.com/home
2. Click **New project** (+ button)
3. Give it a name like "Villa Kunterbunt Airthings Proxy"
4. You should see an empty `Code.gs` file

## Step 2: Copy the Script Code

1. In the Apps Script editor, you should see a file called `Code.gs`
2. **Replace the entire contents** with the code from `google-apps-script.js` (in this repository)
3. Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`

## Step 3: Configure Script Properties (IMPORTANT!)

This is where we'll store your Airthings API credentials **securely** (they won't be visible in your code or frontend).

1. In the Apps Script editor, click on **Project Settings** (⚙️ gear icon on the left sidebar)
2. Scroll down to **Script Properties** section
3. Click **Add script property** and add these THREE properties:

   | Property Name | Value |
   |---------------|-------|
   | `AIRTHINGS_CLIENT_ID` | Your client ID from Airthings dashboard |
   | `AIRTHINGS_CLIENT_SECRET` | Your client secret from Airthings dashboard |
   | `AIRTHINGS_DEVICE_SERIAL` | Your device serial number |

4. Click **Save script properties**

**Where to find these values:**
- Go to https://dashboard.airthings.com/integrations/api-integration
- Your Client ID and Client Secret are shown there
- Your device serial number is on the device itself or in the Airthings app

**Security Note:** These credentials are now stored securely in Google's infrastructure and will NOT be visible to anyone viewing your frontend code!

## Step 4: Test the Airthings Connection

Before deploying, let's make sure everything works:

1. In the Apps Script editor, find the function dropdown (near the top, says "Select function")
2. Select `testAirthingsConnection`
3. Click the **Run** button (▶️ play icon)
4. You may be asked to authorize the script - click **Review Permissions** and approve
5. Click **View** → **Logs** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Expected Output in Logs:**
```
✓ SUCCESS!

Device Data:
  Temperature: 18.5°C
  Humidity: 65%
  VOC: 150 ppb
  Mold Risk: 0/10
  Battery: 85%
```

If you see real data from your Wave Mini - **SUCCESS!** 🎉

If you see an error, check:
- Script Properties are set correctly (check for typos)
- Your Airthings API credentials are valid at https://dashboard.airthings.com/integrations/api-integration
- Your device serial number is correct

## Step 5: Deploy the Script

Now let's make your script accessible from your GitHub Pages site:

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description:** "Airthings API Proxy"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**
6. **IMPORTANT:** Copy the "Web app URL" - you'll need this for your frontend!

**The URL will look like:**
```
https://script.google.com/macros/s/ABC123.../exec
```

**Save this URL!** You'll use it in the next step.

## Step 6: Test the API Endpoint

Open a new browser tab and paste your deployment URL (from Step 5).

You should see JSON data like:
```json
{
  "success": true,
  "deviceSerial": "2920005754",
  "timestamp": "2025-10-30T10:30:00.000Z",
  "data": {
    "temperature": 18.5,
    "humidity": 65,
    "voc": 150,
    "mold": 0,
    "batteryPercentage": 85
  }
}
```

If you see this - **YOU'RE DONE WITH THE BACKEND!** 🚀

## Troubleshooting

### Error: "Script Properties not configured"
- Go back to Step 3 and make sure all three properties are added correctly
- Check for typos in the property names (they're case-sensitive!)

### Error: "Failed to get Airthings access token"
- Verify your Client ID and Client Secret at https://dashboard.airthings.com/integrations/api-integration
- Make sure they're copied exactly with no extra spaces

### Error: "Device not found"
- Double-check your device serial number
- Make sure the device is online and connected to WiFi
- Verify the device appears in your Airthings dashboard

### "Authorization required" when running test
- Click "Review Permissions"
- Select your Google account
- Click "Advanced" → "Go to [Project Name] (unsafe)" - this is YOUR script, it's safe!
- Click "Allow"

### Different error when testing
- Check the Execution log in Apps Script for detailed error messages
- Common issues: missing Script Properties, incorrect credentials, device offline

---

## Next Steps

Once your backend is working:

1. **Give me your deployment URL** so I can update the frontend
2. I'll update the app to:
   - Fetch real-time basement data from your Airthings device
   - Remove manual basement sliders (temp/humidity will come from Airthings)
   - Display additional metrics like VOC and mold risk
   - Remove all Google Sheets/session tracking features
   - Make even more precise ventilation recommendations!

Let me know when you've completed the backend setup! 🎯
