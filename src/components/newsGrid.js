/**
 * News Grid Component in Vanilla JavaScript
 */
import { store } from "../state.js";
import { getIcon } from "../icons.js";
import { getRelativeTime, debounce } from "../utils.js";
import { fetchNews } from "../api.js";

const newsCategories = [
  { value: "all", label: "All Topics" },
  { value: "local", label: "Local News 📍" },
  { value: "underrated", label: "Underrated India 🇮🇳" },
  { value: "technology", label: "Technology" },
  { value: "world", label: "World" },
  { value: "science", label: "Science" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bookmarks", label: "Bookmarks Saved ⭐" }
];

let localSearchText = "";

export function renderNewsGrid(container, isFullView = false) {
  if (!container) return;

  const state = store.getState();
  const { articles, newsCategory, newsLoading, newsError, bookmarkedUrls, currentCity } = state;

  // Sync local search text with state query if needed
  if (!localSearchText && state.newsQuery) {
    localSearchText = state.newsQuery;
  }

  // Filter articles for bookmarks tab if selected
  const displayedArticles = newsCategory === "bookmarks"
    ? articles.filter((art) => bookmarkedUrls.includes(art.url))
    : articles;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Section Header & Filter Controls -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            ${getIcon("globe", "w-6 h-6 text-primary")}
            <span>Global & Local Headlines</span>
            <span class="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              ${displayedArticles.length} Live
            </span>
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">Real-time syndicated updates and curated grassroots innovation.</p>
        </div>

        <!-- News Search Bar -->
        <div class="w-full md:w-72">
          <form id="news-search-form" class="relative flex items-center">
            ${getIcon("search", "w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none")}
            <input
              type="text"
              id="news-search-input"
              value="${localSearchText}"
              placeholder="Search news topics, keywords..."
              class="w-full bg-card border border-border rounded-2xl pl-10 pr-9 py-2 text-xs font-medium text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
            />
            ${localSearchText ? `
              <button type="button" id="btn-clear-news-search" class="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer">
                ${getIcon("x", "w-3.5 h-3.5")}
              </button>
            ` : ""}
          </form>
        </div>
      </div>

      <!-- Horizontal Category Tabs Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        ${newsCategories.map((cat) => `
          <button
            type="button"
            class="cat-tab-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
              newsCategory === cat.value
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-[1.02]"
                : "bg-card/60 text-muted-foreground border-border hover:bg-card hover:text-foreground hover:border-border/80"
            }"
            data-category="${cat.value}"
          >
            ${cat.label}
            ${cat.value === "bookmarks" && bookmarkedUrls.length > 0 ? `
              <span class="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-slate-950 font-black">${bookmarkedUrls.length}</span>
            ` : ""}
          </button>
        `).join("")}
      </div>

      <!-- Error Message Banner -->
      ${newsError ? `
        <div class="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center justify-between">
          <span>⚠️ News API notice: ${newsError}</span>
          <button id="btn-retry-news" class="underline font-bold hover:opacity-80 cursor-pointer">Retry</button>
        </div>
      ` : ""}

      <!-- Articles Grid or Loading State -->
      ${newsLoading ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${Array.from({ length: 6 }).map(() => `
            <div class="rounded-3xl border border-border bg-card overflow-hidden shadow-sm p-4 space-y-4 animate-pulse">
              <div class="w-full h-44 bg-muted rounded-2xl"></div>
              <div class="space-y-2">
                <div class="w-3/4 h-5 bg-muted rounded-lg"></div>
                <div class="w-full h-4 bg-muted/60 rounded-lg"></div>
                <div class="w-5/6 h-4 bg-muted/60 rounded-lg"></div>
              </div>
              <div class="pt-3 border-t border-border flex justify-between">
                <div class="w-20 h-3 bg-muted rounded"></div>
                <div class="w-16 h-3 bg-muted rounded"></div>
              </div>
            </div>
          `).join("")}
        </div>
      ` : displayedArticles.length === 0 ? `
        <div class="rounded-3xl border border-border bg-card/50 p-12 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto text-muted-foreground">
            ${getIcon("bookmark", "w-6 h-6")}
          </div>
          <h3 class="text-base font-bold text-foreground">No Articles Available</h3>
          <p class="text-xs text-muted-foreground max-w-sm mx-auto">
            ${newsCategory === "bookmarks"
              ? "You haven't bookmarked any articles yet. Click the bookmark icon ⭐ on any headline to save it here!"
              : "We couldn't find any articles matching your search or category filter. Try clearing your keywords."
            }
          </p>
          ${newsCategory !== "all" || localSearchText ? `
            <button id="btn-reset-filters" class="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-sm">
              Reset Filters to All Topics
            </button>
          ` : ""}
        </div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 ${isFullView ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3"} gap-6">
          ${displayedArticles.map((art, idx) => {
            const isBookmarked = bookmarkedUrls.includes(art.url);
            const isUnderrated = art.category === "underrated" || art.source.includes("Better India") || art.title.includes("Farmer");
            
            return `
              <article class="group relative rounded-3xl border border-border bg-card hover:bg-card/95 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                
                <!-- Article Top Image Banner -->
                <div class="relative w-full h-44 overflow-hidden bg-muted">
                  <img
                    src="${art.urlToImage}"
                    alt="${art.title.replace(/"/g, '&quot;')}"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80'"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                  
                  <!-- Top Badges Row -->
                  <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                      isUnderrated
                        ? "bg-emerald-500/90 text-white border border-emerald-400/30 shadow-sm"
                        : "bg-black/60 text-white/90 border border-white/10"
                    }">
                      ${isUnderrated ? "🇮🇳 Grassroots Hero" : art.category || "Headline"}
                    </span>

                    <button
                      type="button"
                      title="${isBookmarked ? "Remove Bookmark" : "Bookmark Article"}"
                      class="btn-bookmark p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isBookmarked
                          ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                          : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white border border-white/10"
                      }"
                      data-url="${art.url}"
                    >
                      ${isBookmarked ? getIcon("bookmarkFilled", "w-3.5 h-3.5") : getIcon("bookmark", "w-3.5 h-3.5")}
                    </button>
                  </div>

                  <!-- Source and Date badge over image bottom -->
                  <div class="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white/90 font-medium font-mono">
                    <span class="truncate max-w-[65%] font-bold">${art.source}</span>
                    <span>${getRelativeTime(art.publishedAt)}</span>
                  </div>
                </div>

                <!-- Article Content Body -->
                <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div class="space-y-2">
                    <h3 class="text-sm sm:text-base font-extrabold text-foreground leading-snug tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                      ${art.title}
                    </h3>
                    <p class="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      ${art.description}
                    </p>
                  </div>

                  <!-- Bottom Link Action -->
                  <div class="pt-3 border-t border-border/60 flex items-center justify-between">
                    <span class="text-[10px] font-mono uppercase text-muted-foreground/80 tracking-wider">Verified Syndication</span>
                    <a
                      href="${art.url}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Full Report</span>
                      ${getIcon("arrowUpRight", "w-3.5 h-3.5")}
                    </a>
                  </div>
                </div>

              </article>
            `;
          }).join("")}
        </div>
      `}

    </div>
  `;

  // Attach event listeners for category tabs
  const catBtns = container.querySelectorAll(".cat-tab-btn");
  catBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const catVal = btn.getAttribute("data-category");
      if (catVal && catVal !== newsCategory) {
        store.setState({ newsCategory: catVal });
      }
    });
  });

  // Attach listener for search form
  const searchForm = container.querySelector("#news-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      store.setState({ newsQuery: localSearchText });
    });
  }

  // Attach debounced listener for search input
  const searchInput = container.querySelector("#news-search-input");
  if (searchInput) {
    const debouncedSearch = debounce((val) => {
      store.setState({ newsQuery: val });
    }, 450);

    searchInput.addEventListener("input", (e) => {
      localSearchText = e.target.value;
      debouncedSearch(localSearchText);
      const clearBtn = container.querySelector("#btn-clear-news-search");
      if (clearBtn) clearBtn.style.display = localSearchText ? "block" : "none";
    });
  }

  // Attach clear search button
  const clearBtn = container.querySelector("#btn-clear-news-search");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localSearchText = "";
      store.setState({ newsQuery: "" });
    });
  }

  // Attach bookmark toggle buttons
  const bkmkBtns = container.querySelectorAll(".btn-bookmark");
  bkmkBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = btn.getAttribute("data-url");
      if (url) {
        store.toggleBookmark(url);
        renderNewsGrid(container, isFullView);
      }
    });
  });

  // Attach retry button
  const retryBtn = container.querySelector("#btn-retry-news");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      fetchNews(newsCategory, state.newsQuery, currentCity);
    });
  }

  // Attach reset filters button
  const resetBtn = container.querySelector("#btn-reset-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localSearchText = "";
      store.setState({ newsCategory: "all", newsQuery: "" });
    });
  }
}
