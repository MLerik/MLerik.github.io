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
5. ✅ **FIXED: Forecast toggle button functionality**
   - Button was inside forecast card and disappeared when hidden
   - Moved toggle button outside card structure
   - Added missing initialize() and setupEventListeners() functions
   - Toggle now works properly: "Show Forecast" ↔ "Hide Forecast"
6. ✅ **ADDED: Animated status indicators support**
   - Added support for both animated GIFs and videos
   - Flexible system: switch between formats with useVideo flag
   - Maintains responsive design and all existing styling
   - Created comprehensive animation guide (ANIMATION_GUIDE.md)

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

---

## 🏆 Phase 5: Venting History Analytics Card

### Overview
Create an intelligent history card that displays past venting sessions with analytics, trends, and performance insights to help users understand and improve their basement ventilation strategies.

---

## History Card Core Features 📊

### Data Visualization
- [ ] **Session Success Rate Gauge**
  ```
  ┌─────────────────────┐
  │   Success Rate      │
  │      ● 87%         │
  │    ░░░███░░░       │
  │  12 of 14 sessions │
  └─────────────────────┘
  ```

- [ ] **Recent Sessions Timeline**
  - Last 10 sessions with visual indicators
  - Green dots: Successful sessions (achieved target humidity)
  - Yellow dots: Partial success (improved but not optimal)
  - Red dots: Failed sessions (worse than predicted)
  - Interactive hover with session details

- [ ] **Humidity Achievement Chart**
  ```
  Predicted vs Actual Results
  │ 80%                     ●
  │                    ●
  │ 60%            ●
  │              ●   ●
  │ 40%      ●
  └────────────────────────
    Predicted Humidity →
  ```

### Smart Analytics
- [ ] **Performance Metrics Card**
  - **Average session duration**: "2.5 hours typical"
  - **Best time of day**: "Most successful: 9 PM - 1 AM"
  - **Seasonal effectiveness**: "Winter sessions 23% more effective"
  - **Accuracy score**: "Predictions accurate within ±8%"

- [ ] **Personal Records**
  - 🏆 **Best humidity achieved**: "32% on Dec 15"
  - 🔥 **Current streak**: "5 successful sessions in a row"
  - ⏱️ **Longest effective session**: "4.5 hours"
  - 📈 **Biggest improvement**: "Reduced humidity by 28%"

### Trend Analysis
- [ ] **Weekly Pattern Recognition**
  ```
  Your Best Venting Days
  Mon ░░░░░░░░ 42%
  Tue ░░░░░░░░░░ 67%
  Wed ░░░░░░░░░░░░ 89% ← Best day
  Thu ░░░░░░ 34%
  Fri ░░░░░░░░░ 56%
  Sat ░░░░░░░░ 45%
  Sun ░░░░░░░░░░ 71%
  ```

- [ ] **Monthly Progress Graph**
  - Line chart showing average humidity achieved per week
  - Seasonal trends and improvements over time
  - Goal line at 60% basement humidity

---

## Advanced History Features 🔮

### Intelligent Insights
- [ ] **Smart Recommendations Based on History**
  - "You're most successful when outside temperature is <12°C"
  - "Sessions longer than 3 hours show diminishing returns"
  - "Your accuracy improves 15% in low humidity conditions"
  
- [ ] **Failure Pattern Analysis**
  - Identify common factors in unsuccessful sessions
  - "Warning: Similar conditions to your failed session on Dec 3"
  - Suggest modifications: "Try shorter duration this time"

### Comparative Analytics
- [ ] **Session Comparison Tool**
  - Side-by-side comparison of best vs worst sessions
  - Identify what made successful sessions work
  - Environmental factor analysis

- [ ] **Prediction Accuracy Tracking**
  ```
  Algorithm Performance
  ┌─────────────────────────┐
  │ Prediction Accuracy     │
  │ ██████████░ 89%        │
  │                         │
  │ Overestimated:  4 times │
  │ Underestimated: 2 times │
  │ Perfect:       8 times  │
  └─────────────────────────┘
  ```

---

## History Card UI Design 🎨

### Card Layout Options
- [ ] **Compact Summary Card** (Always visible)
  - Key metrics: Success rate, last session result, streak
  - "View Full History" expandable section
  
- [ ] **Detailed History Modal/Page**
  - Full session list with filtering and sorting
  - Advanced charts and analytics
  - Export functionality for power users

### Visual Design Elements
- [ ] **Session Status Icons**
  - 🎯 Perfect sessions (within 5% of prediction)
  - ✅ Good sessions (met humidity goals)
  - ⚠️ Partial success (improved but missed target)
  - ❌ Failed sessions (worse than expected)

- [ ] **Color-Coded Timeline**
  ```
  Recent Sessions
  ●─●─●─○─●─●─○─●─●─●
  │ │ │ │ │ │ │ │ │ └─ Today: 45% ✅
  │ │ │ │ │ │ │ │ └─── Dec 8: 52% ✅  
  │ │ │ │ │ │ │ └───── Dec 6: 68% ⚠️
  └─────────────────── 10 days ago
  ```

### Interactive Elements
- [ ] **Session Detail Popover**
  - Click any session for full details
  - Weather conditions, duration, results
  - "Learn from this session" insights
  
- [ ] **Filter and Sort Options**
  - Filter by: Successful only, time period, weather conditions
  - Sort by: Date, success rate, duration, humidity achieved

---

## Data Integration Strategy 🔧

### Google Sheets Data Retrieval
- [ ] **Fetch Historical Data**
  ```javascript
  async function fetchVentingHistory() {
    // Use the doGet() function in Google Apps Script
    const response = await fetch(GOOGLE_SHEETS_URL);
    const data = await response.json();
    return processHistoryData(data.data);
  }
  ```

- [ ] **Local Caching Strategy**
  - Cache recent sessions in localStorage
  - Refresh from Google Sheets periodically
  - Handle offline scenarios gracefully

### Data Processing
- [ ] **Session Analysis Functions**
  ```javascript
  function analyzeSessionData(sessions) {
    return {
      successRate: calculateSuccessRate(sessions),
      averageDuration: calculateAverageDuration(sessions),
      bestTimeOfDay: findOptimalTimePattern(sessions),
      predictionAccuracy: calculateAccuracy(sessions),
      trends: identifyTrends(sessions)
    };
  }
  ```

### Performance Considerations
- [ ] **Lazy Loading**
  - Load summary data first (last 10 sessions)
  - Full history on demand
  - Infinite scroll for long histories

- [ ] **Data Optimization**
  - Compress older session data
  - Aggregate weekly/monthly summaries
  - Client-side analytics to reduce API calls

---

## Priority Implementation Plan 📆

### Phase 5A: Basic History (High Priority)
1. [ ] Implement Google Sheets data retrieval (doGet)
2. [ ] Create simple history card with last 5 sessions
3. [ ] Add basic success rate calculation
4. [ ] Show prediction vs actual comparison

### Phase 5B: Analytics Dashboard (Medium Priority) 
5. [ ] Add trend analysis (best times, patterns)
6. [ ] Implement session comparison features
7. [ ] Create detailed session view modal
8. [ ] Add filtering and sorting capabilities

### Phase 5C: Advanced Insights (Low Priority)
9. [ ] Machine learning pattern recognition
10. [ ] Seasonal trend analysis
11. [ ] Predictive recommendations based on history
12. [ ] Export functionality (CSV, charts)

---

## Success Metrics 🎯

### User Engagement
- [ ] **Learning Acceleration**
  - Users improve success rate over time
  - Better prediction accuracy with experience
  - More confident venting decisions

### Feature Effectiveness
- [ ] **Data-Driven Optimization**
  - History insights lead to better session planning
  - Users adapt timing based on personal patterns
  - Reduced "trial and error" approach

---

## Integration with Existing Features 🔗

### Smart Advisor Enhancement
- [ ] **Personalized Advice**
  - "Based on your history, 2.5 hours would be optimal"
  - "You tend to be most successful on Tuesday evenings"
  - "Your last 3 sessions like this achieved 54% average"

### Forecast Card Connection
- [ ] **Historical Context**
  - "Similar conditions to your successful session on Dec 5"
  - "This forecast matches your best performing windows"
  - Show success probability based on historical patterns

This History Card will transform Villa Kunterbunt from a simple calculator into a **learning companion** that gets smarter with every session! 📈🏠