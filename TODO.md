# Villa Kunterbunt Development TODO 📋

## 🚀 Advanced Forecast Card Implementation

### Overview
Add a comprehensive forecast visualization that proactively identifies optimal basement ventilation windows in the coming hours and days.

---

## Phase 1: 6-Hour Forecast Foundation 📊

### API Enhancement
- [ ] **Extended Weather Data Fetch**
  - Modify Open-Meteo API call to include `hourly=temperature_2m,relative_humidity_2m,dewpoint_2m`
  - Fetch 6-hour detailed forecast data  
  - Handle timezone properly (Europe/Berlin for Thun)
  - Add error handling for extended forecast failures

### Data Processing
- [ ] **Ventilation Window Detection Algorithm**
  ```javascript
  function findOptimalWindows(hourlyData, basementTemp) {
    // For each hour, calculate:
    // - Expected basement humidity after ventilation
    // - Condensation risk score
    // - Temperature benefit
    // - Overall ventilation quality score
    // Return ranked opportunities with timing
  }
  ```

- [ ] **Window Quality Scoring**
  - **Excellent** (90-100): Low humidity result (<50%), significant cooling
  - **Good** (70-89): Moderate humidity result (<65%), safe conditions
  - **Marginal** (40-69): Limited benefit but safe
  - **Poor** (0-39): Not recommended or dangerous

---

## Phase 2: Forecast Card UI Design 🎨

### Card Layout
- [ ] **New Forecast Card**
  - Add below the 2-column layout (full width)
  - Organic card styling matching existing theme
  - Collapsible/expandable for mobile optimization

### Visual Components
- [ ] **6-Hour Timeline Visualization**
  - Horizontal timeline with hour markers
  - Temperature curve (line chart)
  - Humidity bars or dots
  - Ventilation quality indicators (color-coded zones)
  
- [ ] **Optimal Window Highlights**
  - Green zones for excellent opportunities
  - Yellow zones for good opportunities  
  - Red zones for dangerous conditions
  - Gray zones for marginal/not recommended

- [ ] **Interactive Elements**
  - Hover/tap for detailed hour info
  - "Best window starting at XX:XX" callouts
  - Duration recommendations for each opportunity

### Example Layout
```
┌─────────────────────────────────────────────────────────┐
│  📈 Next 6 Hours - Optimal Ventilation Opportunities    │
├─────────────────────────────────────────────────────────┤
│  20°C ─╲                                               │
│        ╲─╲              /─╲                           │
│  15°C    ╲─╲___/─/─/─/─/   ╲─╲                       │
│           ▓▓▓░░░░░░░░░▓▓▓    ░░                       │
│  85% ■    ■■░░░░░░░░░■■■     ░■                      │
│      18:00  19:00  20:00  21:00  22:00  23:00       │
│                                                       │
│  🌟 Perfect window: 20:00-22:00 (2 hours)           │
│  Expected result: 52% basement humidity               │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 3: Extended Forecast Logic 📅

### 10-Day Fallback Strategy
- [ ] **No Good Windows Detection**
  ```javascript
  if (noGoodWindowsIn6Hours()) {
    fetchExtended10DayForecast();
    identifyBestDaysForVentilation();
  }
  ```

- [ ] **Extended API Integration**
  - Fetch daily min/max temperature and humidity
  - Identify days with favorable conditions
  - Show "Next opportunity: Thursday evening" style guidance

### Smart Notifications
- [ ] **Proactive Guidance**
  - "Perfect 3-hour window starting at 21:30 tonight!"
  - "No good opportunities today. Best chance: Tuesday morning"
  - "Excellent conditions starting in 2 hours - prepare to ventilate"

---

## Phase 4: Advanced Features 🔮

### Trend Analysis
- [ ] **Pattern Recognition**
  - Detect recurring optimal windows (e.g., "Usually best 10 PM - 2 AM")
  - Seasonal pattern learning
  - Weather front predictions impact

### User Preferences
- [ ] **Customizable Settings**
  - Preferred ventilation duration (user input: 1-4 hours)
  - Risk tolerance (conservative vs aggressive)
  - Notification preferences

### Mobile Enhancements
- [ ] **Progressive Web App Features**
  - Browser notifications for optimal windows
  - Offline forecast caching
  - Add to homescreen capability

---

## Technical Implementation Notes 🔧

### Data Structure
```javascript
const forecastData = {
  hours: [
    {
      time: '2025-09-08T18:00:00Z',
      temperature: 16.5,
      humidity: 78,
      dewPoint: 12.8,
      ventilationScore: 85, // calculated
      recommendation: 'excellent' | 'good' | 'marginal' | 'poor'
    }
    // ... 6 hours
  ],
  optimalWindows: [
    {
      start: '2025-09-08T20:00:00Z',
      end: '2025-09-08T22:00:00Z', 
      duration: 2,
      score: 92,
      expectedHumidity: 48,
      description: 'Perfect conditions for basement dehumidification'
    }
  ]
}
```

### Performance Considerations
- [ ] Cache forecast data (5-minute refresh interval)
- [ ] Lazy load extended forecast only when needed
- [ ] Optimize chart rendering for mobile devices

---

## Priority & Timeline 📆

**High Priority (Next Implementation)**
1. ✅ Basic 6-hour forecast API integration
2. ✅ Simple timeline visualization
3. ✅ Optimal window detection algorithm
4. ✅ **FIXED: Forecast recommendations now align with main outcome tab logic**
   - No more overly optimistic suggestions
   - Same safety thresholds for condensation risk
   - Consistent humidity and temperature criteria
   - Added "Meets safety standards" indicator

**Medium Priority**  
4. Enhanced visual design with charts
5. 10-day extended forecast fallback
6. Interactive hover/tap functionality

**Low Priority (Future Enhancement)**
7. Pattern recognition and learning
8. PWA features and notifications
9. User preference customization

---

## Design Philosophy 🎯

The forecast card should be **proactive rather than reactive** - instead of just showing data, it should intelligently guide users to the best action:

- ❌ "Here's the weather forecast" 
- ✅ "Your perfect ventilation window opens at 9 PM tonight for 3 hours"

This transforms the app from a calculator into a true **smart advisor** for Villa Kunterbunt! 🏠✨