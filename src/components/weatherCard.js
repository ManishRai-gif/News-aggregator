/**
 * Weather Card Component for Vanilla JavaScript App
 */
import { store } from "../state.js";
import { getIcon } from "../icons.js";
import { formatTemp, getWeatherIconSvg, getWeatherGradientClasses } from "../utils.js";
import { fetchWeather } from "../api.js";
import { renderWeatherEffects } from "./weatherEffects.js";

const autocompleteSuggestions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Lucknow", "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat",
  "Pune", "Jaipur", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
  "New York", "London", "Tokyo", "Paris", "Sydney", "Berlin", "Cairo"
];

let bannerSearchText = "";
let showSuggestions = false;

export function renderWeatherCard(container) {
  if (!container) return;

  const state = store.getState();
  const weather = state.weather;
  const loading = state.weatherLoading;
  const error = state.weatherError;
  const unit = state.tempUnit;

  // Filter suggestions
  const filteredSuggestions = bannerSearchText.trim()
    ? autocompleteSuggestions.filter((s) => s.toLowerCase().includes(bannerSearchText.trim().toLowerCase())).slice(0, 6)
    : [];

  const gradientClass = weather ? getWeatherGradientClasses(weather.condition) : "from-sky-500 via-blue-600 to-indigo-700";

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Location Permission Prompt Banner -->
      ${state.showLocationPrompt ? `
        <div class="glass border-l-4 border-l-primary p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm bg-primary/5 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              ${getIcon("mapPin", "w-5 h-5 text-primary")}
            </div>
            <div>
              <h4 class="text-xs font-bold text-foreground">Detect Local Weather?</h4>
              <p class="text-[11px] text-muted-foreground">Allow geolocation to automatically showcase current forecasts for your exact city.</p>
            </div>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button id="btn-dismiss-loc" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer">
              Dismiss
            </button>
            <button id="btn-allow-loc" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              ${getIcon("mapPin", "w-3.5 h-3.5")} Allow Access
            </button>
          </div>
        </div>
      ` : ""}

      <!-- Error Notification -->
      ${error ? `
        <div class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>⚠️ ${error}</span>
          <button id="btn-clear-weather-err" class="underline font-bold hover:opacity-80 cursor-pointer">Dismiss</button>
        </div>
      ` : ""}

      <!-- Main Compact Weather Card Structure -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 bg-gradient-to-br ${gradientClass} text-white min-h-[220px] flex flex-col justify-between p-6 sm:p-7 border border-white/15">
        
        <!-- Animated Background Weather Effects Container -->
        <div id="weather-effects-layer" class="absolute inset-0 pointer-events-none z-0 overflow-hidden"></div>

        <!-- Dot Grid Pattern Texture -->
        <div class="absolute inset-0 dot-grid pointer-events-none opacity-40 z-0"></div>

        <!-- Top Row: Location & Search Controls -->
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div class="flex items-center gap-2">
            ${getIcon("mapPin", "w-5 h-5 text-white/80 animate-bounce-slow")}
            <span class="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-sm">
              ${weather ? weather.city : state.currentCity}
            </span>
            ${weather ? `<span class="text-xs font-mono px-2 py-0.5 rounded-full bg-black/20 border border-white/10 uppercase tracking-widest">${weather.country}</span>` : ""}
          </div>

          <!-- Quick City Search Bar -->
          <div class="relative w-full sm:w-64">
            <form id="weather-search-form" class="flex items-center bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1.5 focus-within:border-white/50 transition-all">
              ${getIcon("search", "w-4 h-4 text-white/60 mr-2 shrink-0")}
              <input
                type="text"
                id="weather-city-input"
                value="${bannerSearchText}"
                placeholder="Search city or state..."
                autocomplete="off"
                class="w-full bg-transparent text-white placeholder-white/50 text-xs font-medium outline-none"
              />
              <button type="button" id="btn-geo-locate" title="Use my current location" class="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer">
                ${getIcon("compass", "w-4 h-4")}
              </button>
            </form>

            <!-- Autocomplete Suggestions Dropdown -->
            ${showSuggestions && filteredSuggestions.length > 0 ? `
              <div class="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50 divide-y divide-white/10 animate-fade-in">
                ${filteredSuggestions.map((sug) => `
                  <div class="sug-item px-3.5 py-2 text-xs text-white/90 hover:bg-white/15 cursor-pointer flex items-center justify-between transition-colors" data-city="${sug}">
                    <span>${sug}</span>
                    <span class="text-[10px] font-mono text-white/40">Select</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Middle Row: Temperature & Condition Presentation -->
        <div class="relative z-10 flex items-center justify-between my-4 sm:my-2">
          ${loading ? `
            <div class="flex items-center gap-4 py-4 animate-pulse">
              <div class="w-16 h-16 rounded-full bg-white/20"></div>
              <div class="space-y-2">
                <div class="w-32 h-10 bg-white/20 rounded-xl"></div>
                <div class="w-20 h-4 bg-white/20 rounded-lg"></div>
              </div>
            </div>
          ` : weather ? `
            <div class="flex items-center gap-4 sm:gap-6">
              <div class="p-3.5 sm:p-4 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-inner flex items-center justify-center">
                ${getWeatherIconSvg(weather.icon, "w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-md")}
              </div>
              <div class="flex flex-col">
                <div class="flex items-baseline gap-1">
                  <span class="text-5xl sm:text-6xl font-black tracking-tighter drop-shadow-lg">
                    ${formatTemp(weather.temp, unit)}°
                  </span>
                  <span class="text-xl font-bold font-mono text-white/80">${unit}</span>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-sm sm:text-base font-bold tracking-wide uppercase bg-black/20 px-2.5 py-0.5 rounded-full border border-white/15">
                    ${weather.condition}
                  </span>
                  <span class="text-xs text-white/80 capitalize hidden sm:inline">
                    ${weather.description}
                  </span>
                </div>
              </div>
            </div>
          ` : `
            <div class="text-sm text-white/80 font-medium py-6">No weather loaded yet. Try searching a city above!</div>
          `}
        </div>

        <!-- Bottom Row: Environmental Telemetry / Stats -->
        ${weather ? `
          <div class="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/15 bg-black/10 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-3 backdrop-blur-md">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-xl bg-white/10">
                ${getIcon("droplets", "w-3.5 h-3.5 text-sky-200")}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-white/70 font-mono uppercase">Humidity</span>
                <span class="text-xs sm:text-sm font-bold font-mono">${weather.humidity}%</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-xl bg-white/10">
                ${getIcon("wind", "w-3.5 h-3.5 text-sky-200")}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-white/70 font-mono uppercase">Wind</span>
                <span class="text-xs sm:text-sm font-bold font-mono">${weather.wind_speed} km/h</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-xl bg-white/10">
                ${getIcon("thermometer", "w-3.5 h-3.5 text-sky-200")}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] text-white/70 font-mono uppercase">Feels Like</span>
                <span class="text-xs sm:text-sm font-bold font-mono">${formatTemp(weather.feels_like, unit)}°${unit}</span>
              </div>
            </div>
          </div>
        ` : ""}

      </div>
    </div>
  `;

  // Render weather background effects inside the card layer
  const effectsLayer = document.getElementById("weather-effects-layer");
  if (effectsLayer && weather) {
    renderWeatherEffects(effectsLayer, weather.condition, weather.description);
  }

  // Attach listeners
  const dismissBtn = document.getElementById("btn-dismiss-loc");
  if (dismissBtn) dismissBtn.addEventListener("click", () => store.dismissLocationPrompt());

  const allowBtn = document.getElementById("btn-allow-loc");
  if (allowBtn) allowBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      store.setState({ weatherError: "Geolocation is not supported by your browser." });
      return;
    }
    store.setState({ weatherLoading: true });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }).then(() => {
          store.dismissLocationPrompt();
        });
      },
      (err) => {
        console.warn("Geolocation denied", err);
        store.setState({ weatherLoading: false, weatherError: "Location permission denied. Showing manual search." });
      }
    );
  });

  const clearErrBtn = document.getElementById("btn-clear-weather-err");
  if (clearErrBtn) clearErrBtn.addEventListener("click", () => store.setState({ weatherError: null }));

  const searchForm = document.getElementById("weather-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputEl = document.getElementById("weather-city-input");
      if (inputEl && inputEl.value.trim()) {
        const cityVal = inputEl.value.trim();
        bannerSearchText = "";
        showSuggestions = false;
        fetchWeather({ city: cityVal });
      }
    });
  }

  const inputEl = document.getElementById("weather-city-input");
  if (inputEl) {
    inputEl.addEventListener("input", (e) => {
      bannerSearchText = e.target.value;
      showSuggestions = bannerSearchText.trim().length > 0;
      renderWeatherCard(container);
      const newInput = document.getElementById("weather-city-input");
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }

  const geoBtn = document.getElementById("btn-geo-locate");
  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if (!navigator.geolocation) return;
      store.setState({ weatherLoading: true });
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => store.setState({ weatherLoading: false, weatherError: "Could not access location." })
      );
    });
  }

  // Bind suggestion click items
  const sugItems = container.querySelectorAll(".sug-item");
  sugItems.forEach((item) => {
    item.addEventListener("click", () => {
      const cityVal = item.getAttribute("data-city");
      if (cityVal) {
        bannerSearchText = "";
        showSuggestions = false;
        fetchWeather({ city: cityVal });
      }
    });
  });
}
