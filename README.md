# Villa Kunterbunt Kellerlüftungsberater 🏠

A delightfully smart basement ventilation advisor for our house! This web app helps determine the optimal times to open basement windows for ventilation using real-time weather data and intelligent analysis.

## What it does

This app calculates whether you should ventilate your basement based on:
- **Temperature differences** between inside and outside
- **Humidity levels** and dew point calculations to prevent condensation
- **Real-time weather data** from Thun, Switzerland (via Open-Meteo API)
- **Intelligent contextual advice** with specific guidance and timing recommendations

## Features

### Current Implementation ✨
- **Smart Recommendations**: Clear yes/no ventilation advice with detailed reasoning
- **Live Weather Integration**: Real-time data from Open-Meteo API for accurate conditions
- **Enhanced Dynamic Advisor**: Comprehensive basement-specific guidance including:
  - ⚠️ High-priority warnings for dangerous conditions (condensation risk, extreme humidity)
  - ✨ Optimal condition identification with duration recommendations
  - 🌙 Time-specific optimizations (night ventilation, summer morning cautions)
  - ❄️ Seasonal strategies with specific guidance for each season
- **Responsive Design**: Two-column layout on desktop, mobile-friendly single column
- **Dynamic Theming**: Visual feedback changes based on ventilation status (good/caution/danger)
- **Dual Modes**: Manual input for testing scenarios, or auto mode with live weather data
- **Persistent Warnings**: Clear indication when using sample data vs live weather

### User Interface
- **Input Controls**: Weather data display, basement temperature slider, manual/auto mode toggle
- **Enhanced Outcome Card**: Expected humidity + recommendation + intelligent advisor tips
- **Mobile Optimized**: Weather data stacks vertically on narrow screens (< 640px)

## The Science

The advisor works on **absolute moisture content** (g of water per m³ of air, via the Magnus formula), not on relative-humidity percentages — venting only dries the basement if outside air physically carries less water than the air inside, regardless of what the RH readings suggest.

- **Absolute Humidity Comparison**: The core decision variable — outside air must be ≥0.3 g/m³ drier to help; both values are shown in the UI
- **Wall-Temperature Condensation Guard**: Old ground-coupled masonry runs up to ~2 °C colder than the basement *air* in summer; the dew-point safety check (1.5 °C margin) is made against the estimated coldest *surface*, catching the classic "Sommerkondensation" trap
- **Realistic Air Exchange**: Ventilation is exponential dilution (f = 1 − e^(−ACH·t)), not instant replacement — single-sided ≈1.5 air changes/h, cross-ventilation ≈4/h, sized to the configured basement volume
- **Concrete Outcomes**: Predicted humidity after the recommended session and estimated liters of water removed
- **Seasonal Logic**: Freezing weather → short 30-min bursts repeated through the day; summer → wait for the night window; damp old walls → several spaced sessions beat one marathon (moisture rebound)

## Forecast & Venting Windows 🌙

Using Open-Meteo's hourly forecast, the app grades the next 24–36 hours against the current basement state and renders a color-coded timeline:

- **Best-Window Detection**: Finds the best contiguous ≥2 h venting window ("Next good window: today 22:00 → 07:00")
- **Overnight Summer Venting**: When daytime venting is blocked, the recommendation tells you when tonight's window opens
- **Close-By Warnings**: When conditions are good *now*, it tells you when the window ends ("shut windows by 09:00") — crucial on summer mornings
- **Live-Anchored "Now"**: The current hour is graded from live observations so the strip never contradicts the headline recommendation

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Tailwind CSS with custom Material Design 3 theming
- **Weather API**: Open-Meteo (free, no API key required)
- **Responsive Framework**: Mobile-first CSS Grid layout
- **Hosting**: GitHub Pages ready

## Local Development

Simply open `index.html` in a modern web browser. The app works entirely client-side and will fetch live weather data automatically from the Open-Meteo API.

## Project Structure

```
MLerik.github.io/
├── index.html                    # Main application
├── README.md                     # This file
├── TODO.md                       # Development roadmap
├── images/                       # Status icons
│   ├── good.png                  # Green ventilation status
│   ├── caution.png              # Orange/yellow caution
│   └── danger.png               # Red warning status
└── enhanced_advisor_reference.js # Logic reference for smart tips
```

## Recent Updates

**v3.0 - Physics Engine & Forecast (Current)**
- ✅ Absolute-humidity (g/m³) based decisions — fixes cases where venting was recommended despite adding moisture
- ✅ Wall-surface condensation guard with safety margin (old-masonry summer trap)
- ✅ Realistic air-exchange model with configurable basement size & window setup (persisted settings panel)
- ✅ 24 h venting-window forecast strip with best-window detection and close-by warnings
- ✅ Water-removal estimate in liters per session
- ✅ Fixed 0 °C treated as missing data; unified Magnus constants

**v2.0 - Enhanced Intelligence**
- ✅ Removed basic context card, integrated smart advisor into results
- ✅ Comprehensive basement-specific guidance with emojis and specific recommendations
- ✅ Improved responsive layout (2-column desktop, single-column mobile)
- ✅ Enhanced weather data display with vertical stacking on narrow screens
- ✅ Persistent sample data warnings for better UX

**v1.0 - Core Functionality**
- ✅ Basic ventilation calculations and recommendations
- ✅ Live weather integration
- ✅ Mobile-responsive design
- ✅ Dynamic theming

## Why "Villa Kunterbunt"?

It's our house name (German for "Colorful Villa") - because every house deserves a fun name and every basement deserves smart ventilation! 🌈

---

*This is a toy project for managing basement ventilation in our home. While scientifically sound, use common sense and consult professionals for serious moisture problems.*