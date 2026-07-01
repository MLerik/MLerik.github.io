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
   * Get real-time and 24h historical data from Airthings Wave Mini device
   */
  function getAirthingsData() {
    try {
      const accessToken = getAirthingsAccessToken();
      const deviceSerial = getScriptProperty('AIRTHINGS_DEVICE_SERIAL');

      if (!deviceSerial) {
        throw new Error('Device serial number not configured. Please add AIRTHINGS_DEVICE_SERIAL to Script Properties.');
      }

      // Fetch latest samples from device
      const latestUrl = `${AIRTHINGS_API_BASE}/devices/${deviceSerial}/latest-samples`;

      const latestResponse = UrlFetchApp.fetch(latestUrl, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        muteHttpExceptions: true
      });

      if (latestResponse.getResponseCode() !== 200) {
        Logger.log('Airthings API error: ' + latestResponse.getResponseCode());
        throw new Error('Airthings API returned error ' + latestResponse.getResponseCode());
      }

      const latestData = JSON.parse(latestResponse.getContentText());

      // Fetch 24h historical samples
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - (24 * 60 * 60 * 1000)); // 24h ago

      const samplesUrl = `${AIRTHINGS_API_BASE}/devices/${deviceSerial}/samples?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;

      const samplesResponse = UrlFetchApp.fetch(samplesUrl, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        muteHttpExceptions: true
      });

      let historical24h = null;
      if (samplesResponse.getResponseCode() === 200) {
        historical24h = JSON.parse(samplesResponse.getContentText());
        Logger.log('Historical samples response code: 200');
        Logger.log('Historical data type: ' + typeof historical24h.data);
        if (historical24h.data) {
          Logger.log('Historical data is array: ' + Array.isArray(historical24h.data));
          Logger.log('Historical data length: ' + (Array.isArray(historical24h.data) ? historical24h.data.length : 'N/A'));
        }
      } else {
        Logger.log('Historical samples response code: ' + samplesResponse.getResponseCode());
      }

      // Calculate trends from 24h data
      const trends = calculateTrends(historical24h, latestData.data);

      // Extract Wave Mini data and format for frontend
      const result = {
        success: true,
        deviceSerial: deviceSerial,
        timestamp: new Date().toISOString(),
        data: {
          // Core measurements from Wave Mini
          temperature: latestData.data.temp || null,
          humidity: latestData.data.humidity || null,
          voc: latestData.data.voc || null,           // Volatile Organic Compounds (ppb)
          mold: latestData.data.mold || null,         // Mold risk indicator (0-10 scale)

          // Device info
          batteryPercentage: latestData.data.battery || null,
          rssi: latestData.data.rssi || null,         // WiFi signal strength

          // Timestamp from device
          recorded: latestData.data.time || null
        },
        trends: trends
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
   * Calculate short-term trends: the most recent hour vs the hour before it.
   *
   * The old version compared the first vs last quarter of a 24 h window, so the
   * arrows described "this evening vs last night" and lagged by half a day.
   * Deadbands are sized for a thermally massive basement, where ±0.2 °C within
   * an hour is a real move (the old ±1 °C threshold meant "always stable").
   */
  function calculateTrends(historical24h, currentData) {
    const stable = { humidity: 'stable', voc: 'stable', temperature: 'stable' };

    if (!historical24h || !Array.isArray(historical24h.data) || historical24h.data.length < 4) {
      Logger.log('Not enough historical data for trends');
      return stable;
    }

    // Sort ascending by sample time (unix seconds) so "recent" really is recent
    const samples = historical24h.data.slice().sort(function(a, b) {
      return (a.time || 0) - (b.time || 0);
    });
    const newest = samples[samples.length - 1].time || 0;
    const HOUR = 3600;

    const lastHour = samples.filter(function(s) { return s.time > newest - HOUR; });
    const prevHour = samples.filter(function(s) { return s.time <= newest - HOUR && s.time > newest - 2 * HOUR; });

    if (lastHour.length === 0 || prevHour.length === 0) {
      Logger.log('Not enough samples in the last two hours for trends');
      return stable;
    }

    function trendFor(field, deadband) {
      const recent = average(lastHour.map(function(s) { return s[field]; }).filter(function(v) { return v != null; }));
      const before = average(prevHour.map(function(s) { return s[field]; }).filter(function(v) { return v != null; }));
      if (recent === null || before === null) return 'stable';
      if (recent > before + deadband) return 'rising';
      if (recent < before - deadband) return 'falling';
      return 'stable';
    }

    return {
      humidity: trendFor('humidity', 1),    // ±1 %RH within an hour is a real move
      temperature: trendFor('temp', 0.2),   // massive basement: ±0.2 °C is a real move
      voc: trendFor('voc', 25)
    };
  }

  /**
   * Calculate average of an array of numbers (null when empty, so callers
   * can tell "no data" apart from a real 0)
   */
  function average(arr) {
    if (!arr || arr.length === 0) return null;
    return arr.reduce(function(a, b) { return a + b; }, 0) / arr.length;
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
