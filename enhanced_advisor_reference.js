// Enhanced Dynamic Advisor for Basement Ventilation
// This will replace the current basic hint logic

function getEnhancedBasementAdvice(tempIn, tempOut, rhOut, season, hour, trend, dewPointOut, finalHumidity) {
    let hint = "General Tip: Ventilate when outside is cooler and the dew point is lower than your basement's temperature.";
    let isHighPriority = false;
    
    // High-priority warnings (dangerous conditions)
    if (dewPointOut >= tempIn - 1.5) {
        hint = `⚠️ High condensation risk! Outside dew point (${dewPointOut.toFixed(1)}°C) is too close to your basement temperature. Wait for drier conditions.`;
        isHighPriority = true;
    } 
    else if (tempOut > tempIn + 3) {
        hint = `🔥 Outside is much warmer (${tempOut}°C vs ${tempIn}°C). Ventilating will heat and significantly humidify your basement.`;
        isHighPriority = true;
    }
    else if (rhOut > 95 && tempOut > tempIn) {
        hint = `💧 Extremely humid outside (${rhOut}%) + warmer temps = recipe for basement moisture problems. Avoid ventilation.`;
        isHighPriority = true;
    }
    
    // Optimal conditions (encouraging advice)
    else if (finalHumidity < 45 && tempOut < tempIn - 4) {
        hint = `✨ Excellent conditions! Cool, dry air will perfectly dehumidify your basement. Ventilate for 3-4 hours maximum.`;
    }
    else if (finalHumidity < 55 && dewPointOut < tempIn - 4) {
        if (trend === "Falling ↘" && (hour >= 20 || hour <= 6)) {
            hint = `🌙 Perfect timing! Night cooling + low dew point = ideal basement ventilation window. Expected humidity: ${finalHumidity}%.`;
        } else {
            hint = `👍 Great conditions! Ventilation will achieve ${finalHumidity}% humidity - perfect for preventing mold in basements.`;
        }
    }
    
    // Good conditions with specific guidance
    else if (finalHumidity < 65 && tempOut < tempIn - 1) {
        if (season === 'Winter' && tempOut < 5) {
            hint = `❄️ Winter advantage: Cold air = dry air! Brief 1-2 hour sessions will dehumidify effectively. Watch heating costs.`;
        } else if (trend === "Falling ↘") {
            hint = `📉 Good timing! Falling temperatures favor basement ventilation. Target humidity: ${finalHumidity}%.`;
        } else {
            hint = `✅ Solid conditions. Ventilation will cool and moderately dehumidify (${finalHumidity}%). Safe from condensation.`;
        }
    }
    
    // Marginal conditions (proceed with caution)
    else if (finalHumidity < 75 && dewPointOut < tempIn - 2) {
        hint = `⚠️ Marginal benefit. Ventilation cools but won't dramatically reduce humidity (${finalHumidity}%). Monitor closely.`;
    }
    
    // Poor conditions (not recommended)  
    else if (finalHumidity >= 75) {
        hint = `❌ Not recommended. Would result in ${finalHumidity}% humidity - too high for basements and promotes mold growth.`;
    }
    
    // Time-specific optimizations
    else if (season === 'Summer' && trend === "Rising ↗" && hour >= 6 && hour <= 10 && tempOut < tempIn) {
        hint = `☀️ Summer morning: Temperatures rising fast. If you ventilate, close windows by 10 AM to avoid heat trapping.`;
        isHighPriority = true;
    }
    else if ((hour >= 22 || hour <= 5) && tempOut < tempIn && rhOut < 80) {
        hint = `🌜 Night ventilation: Often optimal for basements. Coolest temps, lower humidity. Monitor dew point closely.`;
    }
    
    // Seasonal fallbacks when specific conditions aren't clear
    else {
        if (season === 'Winter' && rhOut < 70) {
            hint = "❄️ Winter strategy: Cold air holds less moisture. Short ventilation bursts (1-2 hours) effectively dry basements.";
        } else if (season === 'Summer') {
            hint = "☀️ Summer tip: Best basement ventilation windows are late evening through early morning when coolest.";  
        } else if (season === 'Spring') {
            hint = "🌸 Spring opportunity: Mild, variable weather. Watch for sudden humidity/temperature swings.";
        } else {
            hint = "🍂 Autumn advantage: Cooling temperatures make this excellent for basement ventilation. Watch humidity during rain.";
        }
    }
    
    return { hint, isHighPriority };
}