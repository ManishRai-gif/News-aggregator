/**
 * Footer component in Vanilla JavaScript
 */
import { store } from "../state.js";
import { getIcon } from "../icons.js";
import { triggerSynchronize } from "../api.js";

export function renderFooter(container) {
  if (!container) return;

  const state = store.getState();
  const { currentTime, countdown, lastSyncStr, isRefreshing, apiConfig } = state;

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  container.innerHTML = `
    <footer class="mt-12 border-t border-border bg-card/60 backdrop-blur-xl py-6 select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <!-- Left: Branding & Clock -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs font-bold font-mono text-foreground">${timeString}</span>
            <span class="text-xs text-muted-foreground font-mono">(${dateString})</span>
          </div>
          <div class="h-4 w-[1px] bg-border"></div>
          <span class="text-xs text-muted-foreground">WeatherNews Dashboard &copy; 2026</span>
        </div>

        <!-- Middle: API Health Badges -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
            apiConfig.hasWeatherKey
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-border"
          }">
            <span class="w-1.5 h-1.5 rounded-full ${apiConfig.hasWeatherKey ? "bg-emerald-500" : "bg-slate-400"}"></span>
            <span>Open-Meteo ${apiConfig.hasWeatherKey ? "Live" : "Ready"}</span>
          </div>

          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
            apiConfig.hasNewsKey
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-muted text-muted-foreground border-border"
          }">
            <span class="w-1.5 h-1.5 rounded-full ${apiConfig.hasNewsKey ? "bg-emerald-500" : "bg-slate-400"}"></span>
            <span>News RSS ${apiConfig.hasNewsKey ? "Live" : "Syndicated"}</span>
          </div>
        </div>

        <!-- Right: Synchronized Refresh Controls -->
        <div class="flex items-center gap-3">
          <span class="text-[11px] font-mono text-muted-foreground hidden md:inline">
            Synced: <strong class="text-foreground">${lastSyncStr}</strong> (${countdown}s)
          </span>

          <button
            id="btn-manual-sync"
            title="Force immediate real-time refresh"
            disabled="${isRefreshing}"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            ${getIcon("refreshCw", `w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`)}
            <span>${isRefreshing ? "Syncing..." : "Sync Now"}</span>
          </button>
        </div>

      </div>
    </footer>
  `;

  const syncBtn = document.getElementById("btn-manual-sync");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => triggerSynchronize());
  }
}
