/**
 * Weather Detail Screen Component in Vanilla JavaScript
 */
import { store } from "../state.js";
import { getIcon } from "../icons.js";
import { formatTemp, getWeatherIconSvg, getWeatherGradientClasses } from "../utils.js";
import { fetchWeather } from "../api.js";
import { renderWeatherEffects } from "./weatherEffects.js";

export function renderWeatherDetail(container) {
  if (!container) return;

  const state = store.getState();
  const { weather, weatherLoading, weatherError, tempUnit: unit, nearbyWeather, currentCity } = state;

  const gradientClass = weather ? getWeatherGradientClasses(weather.condition) : "from-sky-500 via-blue-600 to-indigo-700";

  // Generate 7-day forecast
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const forecast7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() + i + 1);
    const dayName = days[d.getDay()];
    const baseT = weather ? weather.temp : 22;
    const maxT = baseT + Math.round(Math.sin(i + 1) * 3 + 2);
    const minT = baseT + Math.round(Math.cos(i + 1) * 3 - 2);
    let icon = weather ? weather.icon : "01d";
    if (i % 2 === 0 && icon.startsWith("01")) icon = "02d";
    if (i % 3 === 0 && icon.startsWith("02")) icon = "03d";
    let condName = "Sunny";
    if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04")) condName = "Cloudy";
    if (icon.startsWith("09") || icon.startsWith("10")) condName = "Rainy";
    if (icon.startsWith("11")) condName = "Thunderstorm";
    if (icon.startsWith("13")) condName = "Snow";
    return { day: dayName, maxTemp: maxT, minTemp: minT, icon, condition: condName };
  });

  // Generate hourly temperature trend
  const hours = ["08:00", "11:00", "14:00", "17:00", "20:00", "23:00"];
  const baseTemp = weather ? weather.temp : 22;
  const hourlyTemps = [baseTemp - 3, baseTemp - 1, baseTemp + 2, baseTemp + 1, baseTemp - 2, baseTemp - 4];
  const minH = Math.min(...hourlyTemps) - 2;
  const maxH = Math.max(...hourlyTemps) + 2;
  const rangeH = maxH - minH || 1;

  container.innerHTML = `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Top Title & Navigation Back Notice -->
      <div class="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            ${getIcon("thermometer", "w-6 h-6 text-primary")}
            <span>Comprehensive Weather Analytics</span>
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">Live atmospheric readings, 7-day outlook, and global regional comparisons.</p>
        </div>
        <button id="btn-back-dashboard" class="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-1.5 shadow-sm cursor-pointer">
          ← Back to Dashboard
        </button>
      </div>

      <!-- Main Expanded Weather Feature Hero -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 bg-gradient-to-br ${gradientClass} text-white p-6 sm:p-10 border border-white/15">
        
        <!-- Animated Effects Layer -->
        <div id="detail-effects-layer" class="absolute inset-0 pointer-events-none z-0 overflow-hidden"></div>
        <div class="absolute inset-0 dot-grid pointer-events-none opacity-40 z-0"></div>

        ${weatherLoading ? `
          <div class="py-16 text-center text-white/80 animate-pulse font-bold">Loading live weather data...</div>
        ` : weather ? `
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <!-- Left Column: Big Temp & Condition -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-white/90">
                ${getIcon("mapPin", "w-5 h-5 animate-bounce-slow")}
                <span class="text-3xl sm:text-4xl font-black tracking-tight">${weather.city}</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-black/20 border border-white/10 uppercase">${weather.country}</span>
              </div>

              <div class="flex items-center gap-6">
                <div class="p-5 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-inner">
                  ${getWeatherIconSvg(weather.icon, "w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md")}
                </div>
                <div>
                  <div class="flex items-baseline">
                    <span class="text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-lg">${formatTemp(weather.temp, unit)}°</span>
                    <span class="text-2xl font-bold font-mono text-white/80">${unit}</span>
                  </div>
                  <div class="text-base sm:text-lg font-bold tracking-wide uppercase bg-black/20 px-3 py-1 rounded-full border border-white/15 inline-block mt-1">
                    ${weather.condition}
                  </div>
                </div>
              </div>

              <p class="text-xs sm:text-sm text-white/90 capitalize font-medium bg-black/10 px-4 py-2 rounded-2xl border border-white/10 inline-block">
                Atmospheric overview: ${weather.description}. Coordinates: ${weather.lat ? weather.lat.toFixed(2) : "0.0"}°N, ${weather.lon ? weather.lon.toFixed(2) : "0.0"}°E.
              </p>
            </div>

            <!-- Right Column: Environmental Grid -->
            <div class="grid grid-cols-2 gap-4 bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/15">
              <div class="space-y-1">
                <span class="text-[10px] font-mono uppercase text-white/60">Relative Humidity</span>
                <div class="text-2xl sm:text-3xl font-extrabold font-mono flex items-center gap-2">
                  ${getIcon("droplets", "w-5 h-5 text-sky-300")}
                  <span>${weather.humidity}%</span>
                </div>
                <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div class="h-full bg-sky-300 rounded-full" style="width: ${weather.humidity}%"></div>
                </div>
              </div>

              <div class="space-y-1">
                <span class="text-[10px] font-mono uppercase text-white/60">Wind Velocity</span>
                <div class="text-2xl sm:text-3xl font-extrabold font-mono flex items-center gap-2">
                  ${getIcon("wind", "w-5 h-5 text-sky-300")}
                  <span>${weather.wind_speed} <small class="text-xs font-normal">km/h</small></span>
                </div>
                <span class="text-[11px] text-white/70">Moderate breeze</span>
              </div>

              <div class="space-y-1 pt-3 border-t border-white/10">
                <span class="text-[10px] font-mono uppercase text-white/60">Apparent Temp (Feels Like)</span>
                <div class="text-2xl sm:text-3xl font-extrabold font-mono flex items-center gap-2">
                  ${getIcon("thermometer", "w-5 h-5 text-amber-300")}
                  <span>${formatTemp(weather.feels_like, unit)}°${unit}</span>
                </div>
              </div>

              <div class="space-y-1 pt-3 border-t border-white/10">
                <span class="text-[10px] font-mono uppercase text-white/60">Data Provider</span>
                <div class="text-sm font-bold pt-1 text-emerald-300 flex items-center gap-1.5">
                  ${getIcon("check", "w-4 h-4")}
                  <span>Open-Meteo Live</span>
                </div>
              </div>
            </div>

          </div>
        ` : `
          <div class="py-12 text-center text-white/80 font-semibold">No weather selected. Search a city on the Dashboard!</div>
        `}
      </div>

      <!-- Two-Column Analytics Section: Hourly Chart & 7-Day Outlook -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Hourly Temperature Visualizer -->
        <div class="lg:col-span-1 rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 class="text-base font-extrabold text-foreground flex items-center gap-2">
              ${getIcon("clock", "w-5 h-5 text-primary")}
              <span>24-Hour Temperature Trend</span>
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Hourly forecast simulation based on current atmospheric conditions.</p>
          </div>

          <!-- Custom SVG Bar/Point Chart in Vanilla JS -->
          <div class="pt-4 flex-1 flex flex-col justify-end">
            <div class="grid grid-cols-6 gap-2 items-end h-40 pt-6 pb-2 border-b border-border/60">
              ${hours.map((h, idx) => {
                const t = hourlyTemps[idx];
                const heightPct = Math.max(15, Math.min(100, ((t - minH) / rangeH) * 100));
                return `
                  <div class="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span class="text-[11px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">${formatTemp(t, unit)}°</span>
                    <div class="w-full max-w-[28px] bg-primary/20 group-hover:bg-primary rounded-t-xl transition-all duration-300 relative" style="height: ${heightPct}%;">
                      <div class="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
            <div class="grid grid-cols-6 gap-2 pt-2 text-center">
              ${hours.map((h) => `<span class="text-[10px] font-mono text-muted-foreground">${h}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast Grid -->
        <div class="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div>
            <h3 class="text-base font-extrabold text-foreground flex items-center gap-2">
              ${getIcon("sun", "w-5 h-5 text-amber-500")}
              <span>7-Day Weather Outlook</span>
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">Projected maximum and minimum regional temperatures for the upcoming week.</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            ${forecast7.map((f) => `
              <div class="rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/50 transition-all p-3.5 flex flex-col items-center justify-between gap-3 text-center group">
                <span class="text-xs font-bold text-foreground group-hover:text-primary">${f.day}</span>
                <div class="p-2 rounded-xl bg-card border border-border shadow-xs">
                  ${getWeatherIconSvg(f.icon, "w-7 h-7")}
                </div>
                <div class="space-y-0.5">
                  <div class="text-xs font-extrabold font-mono text-foreground">${formatTemp(f.maxTemp, unit)}°</div>
                  <div class="text-[11px] font-mono text-muted-foreground">${formatTemp(f.minTemp, unit)}°</div>
                </div>
                <span class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/80">${f.condition}</span>
              </div>
            `).join("")}
          </div>
        </div>

      </div>

      <!-- Nearby Global Cities Condensed Gradient Tiles (FR-11 / Design System Section 5) -->
      <div class="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h3 class="text-base font-extrabold text-foreground flex items-center gap-2">
            ${getIcon("globe", "w-5 h-5 text-secondary")}
            <span>Nearby & Global Major Hubs</span>
          </h3>
          <p class="text-xs text-muted-foreground mt-0.5">Click any condensed gradient tile below to immediately switch live monitoring.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          ${Object.entries(nearbyWeather).map(([cityName, data]) => {
            const isCurrent = currentCity.toLowerCase() === cityName.toLowerCase();
            const tileGradient = cityName === "London" ? "from-slate-700 to-slate-900" : cityName === "Tokyo" ? "from-indigo-700 to-purple-900" : "from-sky-600 to-blue-800";
            return `
              <div class="city-tile-btn relative rounded-2xl p-4 bg-gradient-to-r ${tileGradient} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between border ${isCurrent ? "border-amber-400 ring-2 ring-amber-400/50" : "border-white/10"}" data-city="${cityName}">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm font-extrabold tracking-tight">${cityName}</span>
                    ${isCurrent ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black uppercase">Active</span>` : ""}
                  </div>
                  <span class="text-xs text-white/80 capitalize">${data.condition}</span>
                </div>
                <div class="flex items-center gap-3">
                  ${getWeatherIconSvg(data.icon, "w-8 h-8 text-white")}
                  <span class="text-xl font-extrabold font-mono">${formatTemp(data.temp, unit)}°</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

    </div>
  `;

  // Render detail effects layer
  const effectsEl = document.getElementById("detail-effects-layer");
  if (effectsEl && weather) {
    renderWeatherEffects(effectsEl, weather.condition, weather.description);
  }

  // Attach back button listener
  const backBtn = document.getElementById("btn-back-dashboard");
  if (backBtn) backBtn.addEventListener("click", () => store.setState({ currentTab: "dashboard" }));

  // Attach nearby city tile clicks
  const tiles = container.querySelectorAll(".city-tile-btn");
  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const cityVal = tile.getAttribute("data-city");
      if (cityVal) {
        fetchWeather({ city: cityVal });
      }
    });
  });
}
