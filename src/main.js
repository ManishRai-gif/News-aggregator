/**
 * Main application entry point for Vanilla JavaScript Modular App
 * No React, No TypeScript, No JSX - Pure modular DOM architecture.
 */
import "./index.css";
import { store } from "./state.js";
import { fetchConfig, triggerSynchronize } from "./api.js";
import { renderNav } from "./components/nav.js";
import { renderWeatherCard } from "./components/weatherCard.js";
import { renderNewsGrid } from "./components/newsGrid.js";
import { renderWeatherDetail } from "./components/weatherDetail.js";
import { renderFooter } from "./components/footer.js";

// Initialize application DOM structure
function initApp() {
  const root = document.getElementById("root");
  if (!root) {
    console.error("Root element #root not found in DOM!");
    return;
  }

  // Set initial theme
  store.applyTheme();

  // Build main shell
  root.innerHTML = `
    <div class="min-h-screen relative flex flex-col justify-between font-sans transition-colors duration-300">
      
      <!-- Fixed Decorative Gradient Background -->
      <div class="fixed inset-0 pointer-events-none z-0 bg-gradient-to-tr from-[#F1F5F9] via-[#F8FAFC] to-[#EFF6FF] dark:bg-gradient-to-br dark:from-[#090D16] dark:via-[#0F172A] dark:to-[#1E1B4B] transition-colors duration-500">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12)_0%,transparent_50%)] pointer-events-none z-0"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.06)_0%,transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.08)_0%,transparent_45%)] pointer-events-none z-0"></div>
      </div>

      <!-- Header Navigation Bar Container -->
      <div id="nav-container" class="relative z-40"></div>

      <!-- Main Dynamic View Container -->
      <main id="main-content" class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 animate-fade-in"></main>

      <!-- Footer Container -->
      <div id="footer-container" class="relative z-10"></div>
    </div>
  `;

  const navContainer = document.getElementById("nav-container");
  const mainContent = document.getElementById("main-content");
  const footerContainer = document.getElementById("footer-container");

  // Render main screen based on active tab
  function renderMainContent() {
    if (!mainContent) return;
    const state = store.getState();

    if (state.currentTab === "dashboard") {
      mainContent.innerHTML = `
        <div id="dashboard-weather-section"></div>
        <div id="dashboard-news-section" class="pt-4"></div>
      `;
      const wSec = document.getElementById("dashboard-weather-section");
      const nSec = document.getElementById("dashboard-news-section");
      renderWeatherCard(wSec);
      renderNewsGrid(nSec, false);
    } else if (state.currentTab === "weather") {
      mainContent.innerHTML = `<div id="weather-detail-section"></div>`;
      const wdSec = document.getElementById("weather-detail-section");
      renderWeatherDetail(wdSec);
    } else if (state.currentTab === "news") {
      mainContent.innerHTML = `<div id="news-feed-section"></div>`;
      const nfSec = document.getElementById("news-feed-section");
      renderNewsGrid(nfSec, true);
    }
  }

  // Subscribe to store updates
  store.subscribe((state, prevState) => {
    // Re-render navbar if tab, theme, unit, or mobile menu changed
    if (
      state.currentTab !== prevState.currentTab ||
      state.darkMode !== prevState.darkMode ||
      state.tempUnit !== prevState.tempUnit ||
      state.mobileMenuOpen !== prevState.mobileMenuOpen
    ) {
      renderNav(navContainer);
    }

    // Re-render main content if tab changed or underlying data changed
    if (
      state.currentTab !== prevState.currentTab ||
      state.weather !== prevState.weather ||
      state.weatherLoading !== prevState.weatherLoading ||
      state.weatherError !== prevState.weatherError ||
      state.articles !== prevState.articles ||
      state.newsCategory !== prevState.newsCategory ||
      state.newsLoading !== prevState.newsLoading ||
      state.newsError !== prevState.newsError ||
      state.bookmarkedUrls !== prevState.bookmarkedUrls ||
      state.showLocationPrompt !== prevState.showLocationPrompt ||
      state.tempUnit !== prevState.tempUnit ||
      state.currentCity !== prevState.currentCity
    ) {
      renderMainContent();
    }

    // Re-render footer if time, countdown, sync status, or API config changed
    if (
      state.currentTime !== prevState.currentTime ||
      state.countdown !== prevState.countdown ||
      state.lastSyncStr !== prevState.lastSyncStr ||
      state.isRefreshing !== prevState.isRefreshing ||
      state.apiConfig !== prevState.apiConfig
    ) {
      renderFooter(footerContainer);
    }
  });

  // Initial UI Render
  renderNav(navContainer);
  renderMainContent();
  renderFooter(footerContainer);

  // Fetch server configuration & perform initial sync
  fetchConfig();
  triggerSynchronize();

  // Set up 1-second live clock & countdown loop
  setInterval(() => {
    const state = store.getState();
    const nextTime = new Date();
    let nextCountdown = state.countdown - 1;

    if (nextCountdown <= 0 && state.autoRefreshInterval > 0) {
      nextCountdown = state.autoRefreshInterval;
      triggerSynchronize();
    }

    store.setState({
      currentTime: nextTime,
      countdown: nextCountdown,
    });
  }, 1000);
}

// Boot application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
