/**
 * Sticky Navigation Bar component in Vanilla JavaScript
 */
import { store } from "../state.js";
import { getIcon } from "../icons.js";

export function renderNav(container) {
  if (!container) return;

  const state = store.getState();
  
  container.innerHTML = `
    <header class="sticky top-0 z-50 glass border-b border-border bg-card/80 backdrop-blur-xl select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        <!-- Logo Brand -->
        <div class="flex items-center gap-3 cursor-pointer" id="nav-brand-btn">
          <div class="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary animate-pulse">
            ${getIcon("zap", "w-4 h-4 fill-primary text-primary")}
          </div>
          <div class="flex flex-col">
            <span class="font-extrabold text-lg tracking-tight text-foreground uppercase">
              Weather<span class="text-primary">News</span>
            </span>
            <span class="text-[10px] tracking-wider text-muted-foreground font-mono">
              Weather & News, unified.
            </span>
          </div>
        </div>

        <!-- Desktop Nav Items Pill Group -->
        <nav class="hidden md:flex items-center bg-muted/40 p-1 rounded-full border border-border">
          <button id="tab-btn-dashboard" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            state.currentTab === "dashboard"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:text-foreground"
          }">
            Dashboard
          </button>
          <button id="tab-btn-weather" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            state.currentTab === "weather"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:text-foreground"
          }">
            Weather Detail
          </button>
          <button id="tab-btn-news" class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            state.currentTab === "news"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:text-foreground"
          }">
            News Feed
          </button>
        </nav>

        <!-- Right Action Controls -->
        <div class="flex items-center gap-2">
          <!-- Temp Unit Toggle (°C / °F) -->
          <button id="toggle-temp-btn" title="Switch Temperature Unit" class="px-2.5 py-1.5 rounded-xl border border-border bg-muted/30 hover:bg-muted text-xs font-bold font-mono transition-all duration-200 cursor-pointer flex items-center gap-1">
            <span class="${state.tempUnit === "C" ? "text-primary font-extrabold" : "text-muted-foreground"}">°C</span>
            <span class="text-muted-foreground/40">/</span>
            <span class="${state.tempUnit === "F" ? "text-primary font-extrabold" : "text-muted-foreground"}">°F</span>
          </button>

          <!-- Dark Mode Toggle Button -->
          <button id="toggle-theme-btn" title="Toggle Theme" class="p-2 rounded-xl border border-border bg-muted/30 hover:bg-muted text-foreground transition-all duration-200 cursor-pointer">
            ${state.darkMode
              ? getIcon("sun", "w-4 h-4 text-amber-400")
              : getIcon("moon", "w-4 h-4 text-slate-700")
            }
          </button>

          <!-- Mobile Menu Trigger -->
          <button id="toggle-mobile-menu-btn" class="md:hidden p-2 rounded-xl border border-border bg-muted/30 hover:bg-muted text-foreground transition-all duration-200 cursor-pointer">
            ${state.mobileMenuOpen ? getIcon("x", "w-5 h-5") : getIcon("menu", "w-5 h-5")}
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Nav Menu -->
      ${state.mobileMenuOpen ? `
        <div class="md:hidden border-t border-border bg-card/95 backdrop-blur-2xl px-4 pt-3 pb-4 space-y-2 animate-fade-in">
          <button id="mob-tab-dashboard" class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            state.currentTab === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"
          }">
            Dashboard
          </button>
          <button id="mob-tab-weather" class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            state.currentTab === "weather" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"
          }">
            Weather Detail
          </button>
          <button id="mob-tab-news" class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            state.currentTab === "news" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"
          }">
            News Feed
          </button>
        </div>
      ` : ""}
    </header>
  `;

  // Attach event listeners
  const bindClick = (id, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  };

  bindClick("nav-brand-btn", () => store.setState({ currentTab: "dashboard", mobileMenuOpen: false }));
  bindClick("tab-btn-dashboard", () => store.setState({ currentTab: "dashboard" }));
  bindClick("tab-btn-weather", () => store.setState({ currentTab: "weather" }));
  bindClick("tab-btn-news", () => store.setState({ currentTab: "news" }));

  bindClick("mob-tab-dashboard", () => store.setState({ currentTab: "dashboard", mobileMenuOpen: false }));
  bindClick("mob-tab-weather", () => store.setState({ currentTab: "weather", mobileMenuOpen: false }));
  bindClick("mob-tab-news", () => store.setState({ currentTab: "news", mobileMenuOpen: false }));

  bindClick("toggle-temp-btn", () => store.toggleTempUnit());
  bindClick("toggle-theme-btn", () => store.toggleDarkMode());
  bindClick("toggle-mobile-menu-btn", () => store.setState({ mobileMenuOpen: !state.mobileMenuOpen }));
}
