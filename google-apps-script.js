  /**
   * Villa Kunterbunt - Airthings API Proxy
   *
   * Simple Google Apps Script that securely proxies requests to Airthings API
   * This keeps your API credentials safe while allowing your public GitHub Pages site to access them.
   *
   * SETUP INSTRUCTIONS:
   * 1. Go to https://script.google.com and create a new project
   * 2. Copy this entire code into Code.gs
   * 3. Click the gear icon (Project Settings) on the left
   * 4. Scroll to "Script Properties" and add these THREE properties:
   *    - AIRTHINGS_CLIENT_ID = your_client_id_from_airthings_dashboard
   *    - AIRTHINGS_CLIENT_SECRET = your_client_secret_from_airthings_dashboard
   *    - AIRTHINGS_DEVICE_SERIAL = your_device_serial_number
   * 5. Click "Deploy" > "New deployment"
   *    - Type: Web app
   *    - Execute as: Me
   *    - Who has access: Anyone
   * 6. Copy the deployment URL and use it in your frontend
   *
   * IMPORTANT: Never commit your actual credentials to a public repository!
   * Get your credentials from: https://dashboard.airthings.com/integrations/api-integration
   */

  // Airthings API Configuration
  const AIRTHINGS_API_BASE = 'https://ext-api.airthings.com/v1';
  const AIRTHINGS_TOKEN_URL = 'https://accounts-api.airthings.com/v1/token';

  // Cache duration for access token (55 minutes - tokens are valid for 60 minutes)
  const TOKEN_CACHE_DURATION = 55 * 60; // seconds

  // ============================================================================
  // MAIN ENTRY POINT
  // ============================================================================

  function doGet(e) {
    try {
      // Get real-time data from Airthings device
      return getAirthingsData();
    } catch (error) {
      Logger.log('Error: ' + error.toString());
      return createJsonResponse({
        success: false,
        error: error.toString()
      }, 500);
    }
  }

  // ============================================================================
  // AIRTHINGS API FUNCTIONS
  // ============================================================================

  /**
   * Get real-time data from Airthings Wave Mini device
   */
  function getAirthingsData() {
    try {
      const accessToken = getAirthingsAccessToken();
      const deviceSerial = getScriptProperty('AIRTHINGS_DEVICE_SERIAL');

      if (!deviceSerial) {
        throw new Error('Device serial number not configured. Please add AIRTHINGS_DEVICE_SERIAL to Script Properties.');
      }

      // Fetch latest samples from device
      const url = `${AIRTHINGS_API_BASE}/devices/${deviceSerial}/latest-samples`;

      const response = UrlFetchApp.fetch(url, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        muteHttpExceptions: true
      });

      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();

      if (responseCode !== 200) {
        Logger.log('Airthings API error: ' + responseCode + ' - ' + responseText);
        throw new Error('Airthings API returned error ' + responseCode);
      }

      const airthingsData = JSON.parse(responseText);

      // Extract Wave Mini data and format for frontend
      const result = {
        success: true,
        deviceSerial: deviceSerial,
        timestamp: new Date().toISOString(),
        data: {
          // Core measurements from Wave Mini
          temperature: airthingsData.data.temp || null,
          humidity: airthingsData.data.humidity || null,
          voc: airthingsData.data.voc || null,           // Volatile Organic Compounds (ppb)
          mold: airthingsData.data.mold || null,         // Mold risk indicator (0-10 scale)

          // Device info
          batteryPercentage: airthingsData.data.battery || null,
          rssi: airthingsData.data.rssi || null,         // WiFi signal strength

          // Timestamp from device
          recorded: airthingsData.data.time || null
        }
      };

      return createJsonResponse(result);

    } catch (error) {
      Logger.log('Error getting Airthings data: ' + error.toString());
      return createJsonResponse({
        success: false,
        error: 'Failed to fetch Airthings data: ' + error.toString()
      }, 500);
    }
  }

  /**
   * Get Airthings OAuth2 access token (with caching)
   */
  function getAirthingsAccessToken() {
    // Check cache first
    const cache = CacheService.getScriptCache();
    const cachedToken = cache.get('airthings_access_token');

    if (cachedToken) {
      Logger.log('Using cached access token');
      return cachedToken;
    }

    Logger.log('Requesting new access token...');

    // Get credentials from Script Properties
    const clientId = getScriptProperty('AIRTHINGS_CLIENT_ID');
    const clientSecret = getScriptProperty('AIRTHINGS_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Airthings API credentials not configured. Please add AIRTHINGS_CLIENT_ID and AIRTHINGS_CLIENT_SECRET to Script Properties.');
    }

    // Request new token
    const response = UrlFetchApp.fetch(AIRTHINGS_TOKEN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      payload: {
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret,
        'scope': 'read:device:current_values'
      },
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
      Logger.log('Token request failed: ' + responseCode + ' - ' + responseText);
      throw new Error('Failed to get Airthings access token. Check your credentials.');
    }

    const tokenData = JSON.parse(responseText);
    const accessToken = tokenData.access_token;

    // Cache token for 55 minutes (tokens are valid for 60 minutes)
    cache.put('airthings_access_token', accessToken, TOKEN_CACHE_DURATION);

    Logger.log('New access token obtained and cached');
    return accessToken;
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Get a script property (secure configuration value)
   */
  function getScriptProperty(key) {
    const scriptProperties = PropertiesService.getScriptProperties();
    return scriptProperties.getProperty(key);
  }

  /**
   * Create a JSON response with CORS headers
   */
  function createJsonResponse(data, statusCode = 200) {
    const output = ContentService.createTextOutput(JSON.stringify(data));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }

  // ============================================================================
  // TESTING FUNCTIONS
  // ============================================================================

  /**
   * Test the Airthings API connection
   * Run this from the Apps Script editor to verify your setup
   */
  function testAirthingsConnection() {
    Logger.log('========================================');
    Logger.log('Testing Airthings API Connection...');
    Logger.log('========================================');

    try {
      const result = getAirthingsData();
      const data = JSON.parse(result.getContent());

      Logger.log('✓ SUCCESS!');
      Logger.log('');
      Logger.log('Device Data:');
      Logger.log('  Temperature: ' + data.data.temperature + '°C');
      Logger.log('  Humidity: ' + data.data.humidity + '%');
      Logger.log('  VOC: ' + data.data.voc + ' ppb');
      Logger.log('  Mold Risk: ' + data.data.mold + '/10');
      Logger.log('  Battery: ' + data.data.batteryPercentage + '%');
      Logger.log('');
      Logger.log('Full response:');
      Logger.log(JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      Logger.log('✗ FAILED');
      Logger.log('Error: ' + error.toString());
      throw error;
    }
  }

  /**
   * Test getting an access token (without fetching device data)
   */
  function testGetToken() {
    Logger.log('========================================');
    Logger.log('Testing Token Retrieval...');
    Logger.log('========================================');

    try {
      const token = getAirthingsAccessToken();
      Logger.log('✓ SUCCESS!');
      Logger.log('Token (first 30 chars): ' + token.substring(0, 30) + '...');
      return token;
    } catch (error) {
      Logger.log('✗ FAILED');
      Logger.log('Error: ' + error.toString());
      throw error;
    }
  }
