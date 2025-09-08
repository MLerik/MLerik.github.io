# Villa Kunterbunt Kellerlüftungsberater 🏠

A delightfully smart basement ventilation advisor for our house! This is a toy project that helps us determine the optimal times to open basement windows for ventilation.

## What it does

This web app calculates whether you should ventilate your basement based on:
- **Temperature differences** between inside and outside
- **Humidity levels** and dew point calculations
- **Real-time weather data** from Thun, Switzerland (via Open-Meteo API)
- **Contextual advice** based on time of day and seasonal patterns

## Features

✨ **Smart Recommendations**: Tells you whether to ventilate, with clear reasoning
🌡️ **Live Weather Integration**: Fetches real-time data for accurate advice
📱 **Responsive Design**: Three-column layout on desktop, mobile-friendly single column
🎨 **Dynamic Theming**: Visual feedback changes based on ventilation status (good/caution/danger)
🔄 **Dual Modes**: Manual input for testing scenarios, or auto mode with live data

## The Science

The app prevents condensation by ensuring the outside air's dew point is sufficiently below your basement temperature. It calculates final humidity levels after ventilation and provides contextual advice based on:

- **Condensation risk**: Warns when outside dew point is too high
- **Temperature logic**: Prevents heating your basement with warm outside air
- **Humidity optimization**: Aims for ideal basement humidity levels (< 60%)

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Tailwind CSS with custom Material Design 3 theming
- **Weather API**: Open-Meteo (free, no API key required)
- **Hosting**: GitHub Pages ready

## Local Development

Simply open `index.html` in a modern web browser. The app works entirely client-side and will fetch live weather data automatically.

## Why "Villa Kunterbunt"?

It's our house name (German for "Colorful Villa") - because every house deserves a fun name and every basement deserves smart ventilation! 🌈

---

*This is a toy project for managing basement ventilation in our home. While scientifically sound, use common sense and consult professionals for serious moisture problems.*