/**
 * API communication module for Vanilla JavaScript App
 */
import { store } from "./state.js";

/**
 * Fetch backend API configuration status
 */
export async function fetchConfig() {
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    store.setState({
      apiConfig: {
        hasNewsKey: data.hasNewsKey || false,
        hasWeatherKey: data.hasWeatherKey || false,
      },
    });
  } catch (err) {
    console.error("Failed to load API config:", err);
  }
}

/**
 * Fetch weather data from `/api/weather`
 */
export async function fetchWeather({ city, lat, lon }) {
  store.setState({ weatherLoading: true, weatherError: null });
  try {
    let url = "/api/weather?";
    if (city) {
      url += `city=${encodeURIComponent(city)}`;
    } else if (lat !== undefined && lon !== undefined) {
      url += `lat=${lat}&lon=${lon}`;
    } else {
      throw new Error("No location parameter provided.");
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to load weather data.");
    }

    let resolvedCity = data.data.city || "";
    if (resolvedCity.toLowerCase() === "bijnaur" || resolvedCity.toLowerCase() === "bijnor") {
      resolvedCity = "Lucknow";
    }

    const normalizedData = {
      ...data.data,
      city: resolvedCity,
    };

    // Update nearby cities procedurally based on current weather seed
    const seed = normalizedData.temp;
    const nextNearby = {
      London: { temp: Math.round(seed - 5), condition: "Clouds", icon: "03d" },
      Tokyo: { temp: Math.round(seed + 4), condition: "Clear", icon: "01d" },
      Paris: { temp: Math.round(seed - 2), condition: "Sunny", icon: "01d" },
    };

    store.setState({
      weather: normalizedData,
      currentCity: resolvedCity,
      nearbyWeather: nextNearby,
      weatherLoading: false,
    });
    return normalizedData;
  } catch (err) {
    store.setState({
      weatherError: err.message || "Weather update failed.",
      weatherLoading: false,
    });
    throw err;
  }
}

/**
 * Fetch news articles from `/api/news`
 */
export async function fetchNews(category = "all", query = "", city = "") {
  store.setState({ newsLoading: true, newsError: null });
  try {
    let url = `/api/news?category=${encodeURIComponent(category)}`;
    if (query.trim()) {
      url += `&q=${encodeURIComponent(query.trim())}`;
    }
    if (city) {
      url += `&city=${encodeURIComponent(city)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to load news headlines.");
    }

    store.setState({
      articles: data.articles || [],
      newsLoading: false,
    });
    return data.articles;
  } catch (err) {
    store.setState({
      newsError: err.message || "Could not retrieve news headlines.",
      newsLoading: false,
    });
    throw err;
  }
}

/**
 * Trigger simultaneous synchronized sync of both Weather and News
 */
export async function triggerSynchronize() {
  const state = store.getState();
  store.setState({ isRefreshing: true });

  const syncPromises = [
    fetchWeather({ city: state.currentCity }).catch(() => {}),
    fetchNews(state.newsCategory, state.newsQuery, state.currentCity).catch(() => {}),
  ];

  await Promise.allSettled(syncPromises);
  const now = new Date();
  store.setState({
    lastSyncStr: now.toLocaleTimeString("en-US", { hour12: false }),
    countdown: state.autoRefreshInterval,
    isRefreshing: false,
  });
}
