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

The app prevents condensation by ensuring the outside air's dew point is sufficiently below your basement temperature. It calculates final humidity levels after ventilation and provides contextual advice based on:

- **Condensation Prevention**: Warns when outside dew point is too high (< 1.5°C safety margin)
- **Temperature Logic**: Prevents heating your basement with warm outside air
- **Humidity Optimization**: Aims for ideal basement humidity levels (< 60% optimal, < 75% acceptable)
- **Duration Guidance**: Specific time recommendations (1-2 hours winter, 3-4 hours optimal conditions)

## Planned Enhancements 🚀

### Advanced Forecast Card (In Development)
- **6-Hour Temperature & Humidity Trends**: Visual charts showing upcoming conditions
- **Optimal Window Identification**: Automatically detect perfect ventilation times coming up
- **Extended 10-Day Forecast**: When no good opportunities exist in 6 hours, show longer-term options
- **Proactive Notifications**: "Perfect ventilation window starting at 10 PM tonight!"

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

**v2.0 - Enhanced Intelligence (Current)**
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