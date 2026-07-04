/**
 * Utility functions for Weather and News application
 */
import { getIcon } from "./icons.js";

/**
 * Format temperature based on selected unit (Celsius or Fahrenheit)
 */
export function formatTemp(tempC, unit = "C") {
  if (unit === "F") {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

/**
 * Returns weather icon SVG component based on Open-Meteo or weather icon code
 */
export function getWeatherIconSvg(iconCode = "01d", className = "w-6 h-6 text-sky-300") {
  const isNight = iconCode.endsWith("n");
  const code = iconCode.slice(0, 2);

  switch (code) {
    case "01": // Clear sky
      return isNight
        ? getIcon("moon", `${className} text-blue-300`)
        : getIcon("sun", `${className} text-amber-400 animate-pulse`);
    case "02": // Few clouds
      return getIcon("cloud", `${className} text-slate-300`);
    case "03": // Scattered clouds
    case "04": // Overcast clouds
      return getIcon("cloud", `${className} text-slate-400`);
    case "09": // Drizzle
      return getIcon("cloudDrizzle", `${className} text-sky-300`);
    case "10": // Rain
      return getIcon("cloudRain", `${className} text-sky-400`);
    case "11": // Thunderstorm
      return getIcon("cloudLightning", `${className} text-purple-400`);
    case "13": // Snow
      return getIcon("snowflake", `${className} text-cyan-200 animate-spin-slow`);
    case "50": // Mist / Fog
      return getIcon("cloudFog", `${className} text-slate-400`);
    default:
      return getIcon("cloud", `${className} text-sky-300`);
  }
}

/**
 * Returns weather emoji for quick text representation
 */
export function getWeatherEmoji(conditionStr = "", descriptionStr = "") {
  const cond = conditionStr.toLowerCase();
  const desc = descriptionStr.toLowerCase();

  if (cond.includes("thunder") || cond.includes("storm") || desc.includes("thunder") || desc.includes("storm")) return "⛈️";
  if (cond.includes("rain") || desc.includes("rain")) return "🌧️";
  if (cond.includes("drizzle") || desc.includes("drizzle")) return "🌦️";
  if (cond.includes("snow") || cond.includes("freeze") || desc.includes("snow") || desc.includes("ice")) return "❄️";
  if (cond.includes("sunny") || cond.includes("clear") || desc.includes("clear") || desc.includes("sunny") || desc.includes("sun")) return "☀️";
  if (cond.includes("partly") || desc.includes("partly") || desc.includes("few clouds") || desc.includes("scattered clouds")) return "⛅";
  if (cond.includes("cloud") || desc.includes("cloud") || desc.includes("overcast")) return "☁️";
  if (cond.includes("wind") || desc.includes("wind") || desc.includes("breeze") || desc.includes("gust")) return "💨";
  if (cond.includes("fog") || cond.includes("mist") || desc.includes("fog") || desc.includes("mist")) return "🌫️";
  return "🌡️";
}

/**
 * Returns dynamic weather gradients based on condition string
 */
export function getWeatherGradientClasses(conditionStr = "") {
  const cond = conditionStr.toLowerCase();
  if (cond.includes("clear") || cond.includes("sun")) {
    return "from-sky-400 via-blue-500 to-indigo-600";
  }
  if (cond.includes("partly") || cond.includes("few")) {
    return "from-sky-300 via-blue-400 to-indigo-500";
  }
  if (cond.includes("cloud") || cond.includes("overcast") || cond.includes("mist") || cond.includes("fog")) {
    return "from-slate-400 via-slate-500 to-slate-600";
  }
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
    return "from-blue-500 via-blue-600 to-slate-700";
  }
  if (cond.includes("snow") || cond.includes("freeze") || cond.includes("ice")) {
    return "from-cyan-300 via-sky-400 to-blue-500";
  }
  if (cond.includes("storm") || cond.includes("thunder") || cond.includes("lightning")) {
    return "from-slate-600 via-slate-700 to-zinc-800";
  }
  return "from-sky-400 via-blue-500 to-indigo-600";
}

/**
 * Calculates human-readable relative time (e.g. "2 hours ago")
 */
export function getRelativeTime(isoString) {
  try {
    const pubDate = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    if (diffMs < 0 || isNaN(diffMs)) return "Just now";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

/**
 * Debounce execution of a function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
