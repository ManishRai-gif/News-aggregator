/**
 * Centralized State Store for Vanilla JavaScript App
 * Manages state persistence and event notifications.
 */

class Store {
  constructor() {
    this.listeners = new Set();
    
    // Load persisted preferences
    let savedDarkMode = true;
    try {
      const dm = localStorage.getItem("nexus_dark_mode");
      if (dm !== null) savedDarkMode = dm === "true";
    } catch {}

    let savedCity = "New York";
    try {
      const sc = localStorage.getItem("nexus_current_city");
      if (sc) savedCity = sc;
    } catch {}

    let savedUnit = "C";
    try {
      const su = localStorage.getItem("nexus_temp_unit");
      if (su === "F" || su === "C") savedUnit = su;
    } catch {}

    let savedBookmarks = [];
    try {
      const sb = localStorage.getItem("nexus_bookmarked_news");
      if (sb) savedBookmarks = JSON.parse(sb);
    } catch {}

    let savedPromptDismissed = false;
    try {
      savedPromptDismissed = localStorage.getItem("nexus_dismiss_location_prompt") === "true";
    } catch {}

    this.state = {
      currentTab: "dashboard", // "dashboard" | "weather" | "news"
      mobileMenuOpen: false,
      
      // Theme & unit
      darkMode: savedDarkMode,
      tempUnit: savedUnit,
      
      // Weather state
      currentCity: savedCity,
      weather: null,
      weatherLoading: false,
      weatherError: null,
      showLocationPrompt: !savedCity && !savedPromptDismissed,
      nearbyWeather: {
        London: { temp: 17, condition: "Drizzle", icon: "09d" },
        Tokyo: { temp: 26, condition: "Clear", icon: "01d" },
        Paris: { temp: 20, condition: "Sunny", icon: "01d" },
      },

      // News state
      articles: [],
      newsCategory: "all",
      newsQuery: "",
      newsLoading: false,
      newsError: null,
      bookmarkedUrls: savedBookmarks,

      // API config status
      apiConfig: {
        hasNewsKey: false,
        hasWeatherKey: false,
      },

      // Timers & sync
      currentTime: new Date(),
      autoRefreshInterval: 300,
      countdown: 300,
      lastSyncStr: new Date().toLocaleTimeString("en-US", { hour12: false }),
      isRefreshing: false,
    };
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...typeof partialState === "function" ? partialState(this.state) : partialState };
    
    // Check if persistence needed
    if (prevState.darkMode !== this.state.darkMode) {
      try {
        localStorage.setItem("nexus_dark_mode", String(this.state.darkMode));
      } catch {}
      this.applyTheme();
    }
    if (prevState.tempUnit !== this.state.tempUnit) {
      try {
        localStorage.setItem("nexus_temp_unit", this.state.tempUnit);
      } catch {}
    }
    if (prevState.currentCity !== this.state.currentCity && this.state.currentCity) {
      try {
        localStorage.setItem("nexus_current_city", this.state.currentCity);
      } catch {}
    }
    if (prevState.bookmarkedUrls !== this.state.bookmarkedUrls) {
      try {
        localStorage.setItem("nexus_bookmarked_news", JSON.stringify(this.state.bookmarkedUrls));
      } catch {}
    }

    // Notify listeners
    this.notify(prevState);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(prevState) {
    for (const listener of this.listeners) {
      try {
        listener(this.state, prevState);
      } catch (err) {
        console.error("Error in store listener:", err);
      }
    }
  }

  applyTheme() {
    const root = document.documentElement;
    if (this.state.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  toggleDarkMode() {
    this.setState({ darkMode: !this.state.darkMode });
  }

  toggleTempUnit() {
    this.setState({ tempUnit: this.state.tempUnit === "C" ? "F" : "C" });
  }

  toggleBookmark(url) {
    const exists = this.state.bookmarkedUrls.includes(url);
    const nextBookmarks = exists
      ? this.state.bookmarkedUrls.filter((u) => u !== url)
      : [...this.state.bookmarkedUrls, url];
    this.setState({ bookmarkedUrls: nextBookmarks });
  }

  dismissLocationPrompt() {
    try {
      localStorage.setItem("nexus_dismiss_location_prompt", "true");
    } catch {}
    this.setState({ showLocationPrompt: false });
  }
}

export const store = new Store();
