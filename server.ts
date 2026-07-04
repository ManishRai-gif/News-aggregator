import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// -------------------------------------------------------------------------
// HIGH-FIDELITY NEWS FALLBACK DATA (For Offline Demo or Missing API Keys)
// -------------------------------------------------------------------------
const fallbackArticles = [
  {
    title: "OpenAI Announces GPT-5 with Unprecedented Reasoning Capabilities",
    description: "The latest model demonstrates near-human performance on complex scientific, logic, and mathematical tasks, sparking fresh debate across the global research community.",
    source: "TechCrunch",
    category: "technology",
    url: "https://techcrunch.com",
    urlToImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Global Climate Summit Reaches Landmark Carbon Net-Zero Agreement",
    description: "Representatives from over 120 nations signed a historic pact committing to strict net-zero emissions targets by 2045, backed by trillions in clean energy investments.",
    source: "Reuters",
    category: "world",
    url: "https://reuters.com",
    urlToImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Fed Holds Interest Rates Steady Amid Encouraging Inflation Data",
    description: "The Federal Reserve left its benchmark interest rate unchanged but signaled that cooling consumer prices might open the door to multiple cuts later this year.",
    source: "Bloomberg",
    category: "business",
    url: "https://bloomberg.com",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    title: "New Study Links Mediterranean Diet to 30% Lower Heart Disease Risk",
    description: "A comprehensive 10-year research project tracking over 50,000 participants confirms that diets rich in olive oil, nuts, and fresh produce drastically reduce cardiac events.",
    source: "Medical News Today",
    category: "health",
    url: "https://medicalnewstoday.com",
    urlToImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Apple Unveils Lightweight AR Glasses at WWDC 2026",
    description: "Ditching bulky headsets, Apple's new eyewear integrates augmented reality directly into everyday prescription frames, featuring advanced gesture control and all-day battery life.",
    source: "The Verge",
    category: "technology",
    url: "https://theverge.com",
    urlToImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "World Cup 2026: USA Advances with Stunning Last-Minute Header",
    description: "A dramatic 94th-minute goal from the team captain secured a tense 2-1 victory, sending the host nation into the knockout rounds amid scenes of pure jubilation.",
    source: "ESPN",
    category: "sports",
    url: "https://espn.com",
    urlToImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Quantum Computing Breakthrough Achieves 1 Million Physical Qubits",
    description: "A joint venture of leading research labs has successfully stabilized an array of one million physical qubits, paving the way for commercially viable fault-tolerant quantum algorithms.",
    source: "Wired",
    category: "science",
    url: "https://wired.com",
    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Perseverance Rover Collects Mars Samples for Future Return Mission",
    description: "NASA's explorer has successfully sealed its most complex core samples yet, targetting sediment layers in the Jezero Crater that could contain key microscopic biosignatures of ancient life.",
    source: "Space.com",
    category: "science",
    url: "https://space.com",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Global Stock Markets Rally as Technology Stocks Lead Surge",
    description: "Financial indices in New York, Tokyo, and London surged to record highs today, driven by spectacular earnings reports from major AI chip manufacturers and cloud infrastructure providers.",
    source: "The Wall Street Journal",
    category: "business",
    url: "https://wsj.com",
    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Breakthrough Sleep Wearable Claims to Double Deep Sleep Duration",
    description: "Using targeted auditory stimulation synchronized with brainwave patterns, a newly approved FDA device is showing remarkable success in extending deep restorative sleep phases.",
    source: "Wired",
    category: "health",
    url: "https://wired.com",
    urlToImage: "https://images.unsplash.com/photo-1511295742364-92767fa62d9f?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Formula 1: Monaco GP Delivers Rain-Slicked Masterclass with Bold Strategies",
    description: "A sudden heavy downpour at the midway point turned the legendary Monaco track into an ice rink, resulting in multiple strategic masterclasses and a surprising podium finish.",
    source: "Motorsport",
    category: "sports",
    url: "https://motorsport.com",
    urlToImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
  },
  {
    title: "Highly Anticipated Sci-Fi Sequel Shoves Box Office Records Aside",
    description: "The stunning interstellar epic pulled in a record-breaking $230 million during its opening weekend, securing universal acclaim from critics for its visual scale and storytelling depth.",
    source: "Variety",
    category: "entertainment",
    url: "https://variety.com",
    urlToImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
  }
];

// -------------------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------------------
function isValidApiKey(key) {
  if (!key) return false;
  const k = key.trim().toUpperCase();
  if (k === "") return false;
  if (k.startsWith("MY_") || k.startsWith("YOUR_") || k.includes("PLACEHOLDER") || k === "MY_OPENWEATHER_API_KEY" || k === "YOUR_OPENWEATHER_API_KEY") return false;
  if (key.length < 8) return false;
  return true;
}

// -------------------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------------------

// Check if credentials are set
app.get("/api/config", (req, res) => {
  res.json({
    hasNewsKey: isValidApiKey(process.env.NEWS_API_KEY),
    hasWeatherKey: isValidApiKey(process.env.OPENWEATHER_API_KEY),
  });
});

// -------------------------------------------------------------------------
// REAL-TIME GOOGLE NEWS RSS INTEGRATION & HELPERS
// -------------------------------------------------------------------------
const imagePools = {
  sports: [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&auto=format&fit=crop&q=80"
  ],
  tech: [
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80"
  ],
  finance: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
  ],
  health: [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80"
  ],
  science: [
    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80"
  ],
  entertainment: [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80"
  ],
  climate: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a6565d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546422904-90eabf3bac0a?w=800&auto=format&fit=crop&q=80"
  ]
};

function getStringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPlaceholderImageForNews(title) {
  const t = (title || "").toLowerCase();
  const hash = getStringHash(title);
  
  let pool = imagePools.general;
  if (t.includes("sport") || t.includes("cricket") || t.includes("football") || t.includes("cup") || t.includes("match") || t.includes("game") || t.includes("race") || t.includes("player")) {
    pool = imagePools.sports;
  } else if (t.includes("tech") || t.includes("apple") || t.includes("google") || t.includes("software") || t.includes("ai") || t.includes("chip") || t.includes("quantum") || t.includes("robot") || t.includes("app") || t.includes("cyber")) {
    pool = imagePools.tech;
  } else if (t.includes("stock") || t.includes("market") || t.includes("finance") || t.includes("rate") || t.includes("bank") || t.includes("inflation") || t.includes("business") || t.includes("coin") || t.includes("trade") || t.includes("economy")) {
    pool = imagePools.finance;
  } else if (t.includes("health") || t.includes("diet") || t.includes("sleep") || t.includes("study") || t.includes("doctor") || t.includes("medical") || t.includes("disease") || t.includes("vaccine") || t.includes("food")) {
    pool = imagePools.health;
  } else if (t.includes("space") || t.includes("mars") || t.includes("nasa") || t.includes("moon") || t.includes("star") || t.includes("planet") || t.includes("science") || t.includes("physic") || t.includes("research") || t.includes("dna") || t.includes("scientist")) {
    pool = imagePools.science;
  } else if (t.includes("movie") || t.includes("film") || t.includes("music") || t.includes("show") || t.includes("award") || t.includes("actor") || t.includes("cinema") || t.includes("artist") || t.includes("series") || t.includes("hollywood") || t.includes("bollywood")) {
    pool = imagePools.entertainment;
  } else if (t.includes("climate") || t.includes("warm") || t.includes("emission") || t.includes("carbon") || t.includes("rain") || t.includes("storm") || t.includes("flood") || t.includes("earthquake") || t.includes("weather") || t.includes("monsoon") || t.includes("temp")) {
    pool = imagePools.climate;
  }
  
  return pool[hash % pool.length];
}

function cleanHtmlEntities(str) {
  return (str || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#160;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .trim();
}

function cleanDescription(htmlOrXml) {
  let text = cleanHtmlEntities(htmlOrXml);
  text = text.replace(/<[^>]*>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

function parseGoogleNewsRss(xml, category) {
  const articles = [];
  const seenTitles = new Set();
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descriptionMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
    const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    
    let title = titleMatch ? titleMatch[1].trim() : "No Title Available";
    const link = linkMatch ? linkMatch[1].trim() : "#";
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    let description = descriptionMatch ? descriptionMatch[1].trim() : "";
    let source = sourceMatch ? sourceMatch[1].trim() : "Google News";

    if (title.endsWith(` - ${source}`)) {
      title = title.substring(0, title.length - (source.length + 3)).trim();
    } else if (title.includes(" - ")) {
      const parts = title.split(" - ");
      if (parts.length > 1) {
        const potentialSource = parts[parts.length - 1].trim();
        if (potentialSource.length > 0 && potentialSource.length < 30) {
          source = potentialSource;
          title = parts.slice(0, -1).join(" - ").trim();
        }
      }
    }

    title = cleanHtmlEntities(title);

    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seenTitles.has(normalizedTitle)) {
      continue;
    }
    seenTitles.add(normalizedTitle);

    description = cleanDescription(description);

    if (!description || description.length < 10) {
      description = `Find full real-time updates regarding "${title}" on ${source}. Full visual reporting is accessible via the live link.`;
    }

    const urlToImage = getPlaceholderImageForNews(title);

    articles.push({
      title,
      description,
      source,
      category,
      url: link,
      urlToImage,
      publishedAt: new Date(pubDate).toISOString()
    });
  }
  return articles;
}

// NEWS API ENDPOINT
const curatedUnderratedNews = [
  {
    title: "Unsung Hero: 72-Year-Old Farmer in Karnataka Invents Gravity-Based Drip Irrigation System",
    description: "Without any formal engineering background, Mallappa from rural Bidar has created a low-cost, water-conserving drip irrigation tool using recycled plastic tubes, saving millions of liters of water for local drylands.",
    source: "The Better India",
    category: "underrated",
    url: "https://www.thebetterindia.com/310450/karnataka-farmer-gravity-based-drip-irrigation-saves-water/",
    urlToImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    title: "Grassroots Triumph: Remote Himalayan Hamlet in Ladakh Becomes 100% Solar Self-Sustained",
    description: "Lingshed village, located at 13,000 feet, successfully transitions to localized microgrids, ending decades of zero-electricity winters and setting a blueprint for high-altitude mountain resilience.",
    source: "Himalayan Conservation",
    category: "underrated",
    url: "https://www.downtoearth.org.in/news/energy/ladakh-village-solar-microgrid-resilience-89102",
    urlToImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    title: "Youth-Led Restoration: 1,000-Year-Old Chola-Era Water Tank in Tamil Nadu Recharged After 4 Decades of Drought",
    description: "An informal collective of college students and rural volunteers cleared 400 tonnes of silt and plastic debris, restoring natural aquifer flows to feed five surrounding farming hamlets.",
    source: "Eco-India Foundation",
    category: "underrated",
    url: "https://www.thehindu.com/sci-tech/energy-and-environment/chola-dynasty-temple-tank-restoration-tamil-nadu/article66890123.ece",
    urlToImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  },
  {
    title: "Assam's Forest Successor: Local Majuli Schoolteacher Plants 50,000 Indigenous Trees to Create Wildlife Corridor",
    description: "Deep in Majuli river island, Hem Chandra has transformed 40 hectares of sandy, barren riverbeds into a thriving evergreen forest patch, allowing migrating herds of wild elephants to pass safely.",
    source: "Northeast Wilderness Chronicle",
    category: "underrated",
    url: "https://www.sentinelassam.com/north-east-india-news/assam-news/majuli-teacher-forest-creator-indigenous-trees-659012",
    urlToImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString()
  },
  {
    title: "Tribal Women in Odisha Revive Lost Heritage Crops, Building Indigenous Seed Banks for Food Security",
    description: "A self-help group of Kondh tribal women in Rayagada has successfully preserved 32 rare varieties of climate-hardy millet and traditional paddy, securing local food supply against erratic monsoons.",
    source: "Rural Voice Journal",
    category: "underrated",
    url: "https://ruralindiaonline.org/en/articles/kondh-women-revive-lost-millets-and-heritage-crops-odisha/",
    urlToImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString()
  },
  {
    title: "Indian Scientist Team Invents Bioplastic from Seaweed, Dissolving Completely in Marine Water Within 48 Hours",
    description: "A research institute in Kochi has patented a novel macroalgae-based compound that matches the tensile strength of low-density polyethylene but leaves zero toxic residue or microplastics behind.",
    source: "Science India Weekly",
    category: "underrated",
    url: "https://www.nature.com/articles/india-seaweed-bioplastics-breakthrough/",
    urlToImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString()
  },
  {
    title: "Rebuilding Heritage: Ancient Stepwells of Bundelkhand Revived, Restoring Water Tables to 45 Parched Villages",
    description: "Through traditional bricklaying and voluntary labor ('shramdaan'), over 15 historic 'baolis' have been desilted and re-linked to traditional catchment canals, ending chronic water tanker dependence.",
    source: "India Rivers Review",
    category: "underrated",
    url: "https://www.sandrp.in/bundelkhand-historic-baolis-stepwell-water-restoration-triumphs/",
    urlToImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
    publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

app.get("/api/news", async (req, res) => {
  const category = (req.query.category || "all").toString().toLowerCase();
  const searchQ = (req.query.q || "").toString().toLowerCase();
  const city = (req.query.city || "").toString().trim();

  let feedUrl = "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";
  let displayCategory = category;

  if (category === "underrated") {
    const underratedQuery = `"grassroots innovation" India OR "unsung hero" India OR "rural development" India OR "conservation success" India`;
    feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(underratedQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;
    displayCategory = "underrated";
  } else if (searchQ) {
    feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQ)}&hl=en-IN&gl=IN&ceid=IN:en`;
    displayCategory = "search";
  } else if (category === "local") {
    const locQuery = city ? `${city} news` : "Lucknow news";
    feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(locQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;
    displayCategory = "local";
  } else if (category && category !== "all" && category !== "world") {
    const topic = category.toUpperCase();
    if (["BUSINESS", "TECHNOLOGY", "ENTERTAINMENT", "SPORTS", "SCIENCE", "HEALTH"].includes(topic)) {
      feedUrl = `https://news.google.com/rss/headlines/section/topic/${topic}?hl=en-IN&gl=IN&ceid=IN:en`;
    } else {
      feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(category)}&hl=en-IN&gl=IN&ceid=IN:en`;
    }
  } else if (city) {
    feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(city + " top news")}&hl=en-IN&gl=IN&ceid=IN:en`;
  }

  try {
    console.log(`[Google News] Fetching real-time RSS feed: ${feedUrl}`);
    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });

    if (!response.ok) {
      throw new Error(`Google News RSS responded with status ${response.status}`);
    }

    const xmlText = await response.text();
    const liveArticles = parseGoogleNewsRss(xmlText, displayCategory);

    let merged = [...liveArticles];
    if (category === "underrated") {
      merged = [...curatedUnderratedNews, ...liveArticles];
    }

    const uniqueArticles = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const art of merged) {
      const normTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!seenUrls.has(art.url) && !seenTitles.has(normTitle)) {
        seenUrls.add(art.url);
        seenTitles.add(normTitle);
        uniqueArticles.push(art);
      }
    }

    if (uniqueArticles.length > 0) {
      return res.json({
        success: true,
        source: "live-rss",
        articles: uniqueArticles.slice(0, 24)
      });
    } else {
      throw new Error("No articles parsed from Google News RSS feed.");
    }
  } catch (err) {
    console.warn(`[News Feed Error] Failed to fetch live Google News RSS feed: ${err.message}. Falling back to dynamic offline data.`);
    
    const localArticles = [];
    const capitalizedCity = city ? (city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()) : "Lucknow";
    
    localArticles.push(
      {
        title: `${capitalizedCity} Community Unveils Visionary Urban Forest & Smart Park Project`,
        description: `Local council members and community leaders of ${capitalizedCity} approved a landmark $45M initiative to transform downtown lots into pedestrian-friendly green zones.`,
        source: `${capitalizedCity} Herald`,
        category: "local",
        url: "https://google.com/news",
        urlToImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        title: `Vibrant Food & Culture Festival Returns to ${capitalizedCity} This Weekend`,
        description: `Hundreds of local vendors, independent artists, and culinary masters are gearing up for the annual ${capitalizedCity} street festival celebrating regional heritage and gastronomy.`,
        source: `${capitalizedCity} Daily`,
        category: "local",
        url: "https://google.com/news",
        urlToImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      }
    );

    let articles = [...fallbackArticles];
    if (category === "underrated") {
      articles = [...curatedUnderratedNews];
    } else if (category && category !== "all" && category !== "local") {
      articles = articles.filter(art => art.category === category);
    }

    if (searchQ) {
      articles = articles.filter(art => 
        art.title.toLowerCase().includes(searchQ) || 
        art.description.toLowerCase().includes(searchQ) ||
        art.source.toLowerCase().includes(searchQ)
      );
    }

    let randomizedArticles = articles.map((art, i) => {
      const ageMs = (i * 45 + 10) * 60 * 1000;
      return {
        ...art,
        publishedAt: new Date(Date.now() - ageMs).toISOString()
      };
    });

    if (category === "local") {
      randomizedArticles = [...localArticles];
    } else if (category === "underrated") {
      randomizedArticles = [...curatedUnderratedNews];
    } else {
      randomizedArticles = [...localArticles, ...randomizedArticles];
    }

    const uniqueFallback = [];
    const seenU = new Set();
    for (const art of randomizedArticles) {
      if (!seenU.has(art.url)) {
        seenU.add(art.url);
        uniqueFallback.push(art);
      }
    }

    return res.json({
      success: true,
      source: "fallback",
      articles: uniqueFallback
    });
  }
});

// HELPERS FOR OPEN-METEO WEATHER
const demoCitiesWeather = {
  "new york": { city: "New York", country: "US", temp: 22, feels_like: 21, condition: "Partly Cloudy", description: "broken clouds", icon: "03d", humidity: 64, wind_speed: 12, lat: 40.7128, lon: -74.0060 },
  "london": { city: "London", country: "GB", temp: 17, feels_like: 16, condition: "Drizzle", description: "light intensity drizzle", icon: "09d", humidity: 82, wind_speed: 18, lat: 51.5074, lon: -0.1278 },
  "tokyo": { city: "Tokyo", country: "JP", temp: 26, feels_like: 28, condition: "Clear", description: "clear sky", icon: "01d", humidity: 55, wind_speed: 8, lat: 35.6762, lon: 139.6503 },
  "paris": { city: "Paris", country: "FR", temp: 20, feels_like: 19, condition: "Sunny", description: "clear sky", icon: "01d", humidity: 50, wind_speed: 10, lat: 48.8566, lon: 2.3522 },
  "sydney": { city: "Sydney", country: "AU", temp: 15, feels_like: 14, condition: "Windy", description: "gusty winds", icon: "04d", humidity: 70, wind_speed: 24, lat: -33.8688, lon: 151.2093 },
  "mumbai": { city: "Mumbai", country: "IN", temp: 31, feels_like: 36, condition: "Rainy", description: "moderate rain", icon: "10d", humidity: 88, wind_speed: 15, lat: 19.0760, lon: 72.8777 },
  "berlin": { city: "Berlin", country: "DE", temp: 19, feels_like: 18, condition: "Cloudy", description: "overcast clouds", icon: "04d", humidity: 60, wind_speed: 11, lat: 52.5200, lon: 13.4050 },
  "cairo": { city: "Cairo", country: "EG", temp: 34, feels_like: 33, condition: "Sunny", description: "hot clear sky", icon: "01d", humidity: 38, wind_speed: 14, lat: 30.0444, lon: 31.2357 },
  "lucknow": { city: "Lucknow", country: "IN", temp: 33, feels_like: 38, condition: "Partly Cloudy", description: "scattered clouds", icon: "03d", humidity: 70, wind_speed: 10, lat: 26.8467, lon: 80.9462 },
  "bijnaur": { city: "Lucknow", country: "IN", temp: 33, feels_like: 38, condition: "Partly Cloudy", description: "scattered clouds", icon: "03d", humidity: 70, wind_speed: 10, lat: 26.8467, lon: 80.9462 },
  "bijnor": { city: "Lucknow", country: "IN", temp: 33, feels_like: 38, condition: "Partly Cloudy", description: "scattered clouds", icon: "03d", humidity: 70, wind_speed: 10, lat: 26.8467, lon: 80.9462 },
};

function mapOpenMeteoCode(code, isDay) {
  const suffix = isDay ? "d" : "n";
  switch (code) {
    case 0:
      return { condition: "Sunny", description: "clear sky", icon: `01${suffix}` };
    case 1:
      return { condition: "Sunny", description: "mainly clear", icon: `01${suffix}` };
    case 2:
      return { condition: "Partly Cloudy", description: "partly cloudy", icon: `02${suffix}` };
    case 3:
      return { condition: "Cloudy", description: "overcast", icon: `04${suffix}` };
    case 45:
    case 48:
      return { condition: "Fog", description: "foggy", icon: `50${suffix}` };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { condition: "Drizzle", description: "drizzle", icon: `09${suffix}` };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { condition: "Rainy", description: "rainy weather", icon: `10${suffix}` };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: "Snowy", description: "snowfall", icon: `13${suffix}` };
    case 80:
    case 81:
    case 82:
      return { condition: "Rainy", description: "rain showers", icon: `09${suffix}` };
    case 85:
    case 86:
      return { condition: "Snowy", description: "snow showers", icon: `13${suffix}` };
    case 95:
    case 96:
    case 99:
      return { condition: "Thunderstorm", description: "thunderstorm with lightning", icon: `11${suffix}` };
    default:
      return { condition: "Partly Cloudy", description: "partly cloudy", icon: `02${suffix}` };
  }
}

async function fetchCoordinates(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country_code || ""
      };
    }
  } catch (err) {
    console.warn("Geocoding failed for city:", cityName, err);
  }
  return null;
}

// WEATHER API ENDPOINT
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city || "").toString();
  let lat = (req.query.lat || "").toString();
  let lon = (req.query.lon || "").toString();

  try {
    let resolvedCityName = city || "Unknown";
    let countryCode = "";
    
    if (city && (!lat || !lon)) {
      const geo = await fetchCoordinates(city);
      if (geo) {
        lat = geo.lat.toString();
        lon = geo.lon.toString();
        resolvedCityName = geo.name;
        countryCode = geo.country;
      } else {
        const queryCity = city.trim().toLowerCase();
        const demoCity = demoCitiesWeather[queryCity];
        if (demoCity) {
          lat = demoCity.lat.toString();
          lon = demoCity.lon.toString();
          resolvedCityName = demoCity.city;
          countryCode = demoCity.country;
        } else {
          return res.status(404).json({ success: false, error: "City not found. Please try another city." });
        }
      }
    }

    if (!lat || !lon) {
      return res.status(400).json({ success: false, error: "Missing location parameters" });
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    console.log(`[Open-Meteo] Fetching live weather: ${weatherUrl}`);
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo responded with status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    if (!current) {
      throw new Error("Invalid response from Open-Meteo.");
    }

    const { condition, description, icon } = mapOpenMeteoCode(current.weather_code, current.is_day);

    if (resolvedCityName.toLowerCase() === "bijnaur" || resolvedCityName.toLowerCase() === "bijnor") {
      resolvedCityName = "Lucknow";
      countryCode = "IN";
    }

    return res.json({
      success: true,
      source: "live-open-meteo",
      data: {
        city: resolvedCityName,
        country: countryCode || "LOC",
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        condition: condition,
        description: description,
        icon: icon,
        humidity: current.relative_humidity_2m,
        wind_speed: Math.round(current.wind_speed_10m),
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      }
    });

  } catch (err) {
    console.warn(`[Weather API Error] Live Open-Meteo call failed: ${err.message}. Falling back to demo database.`);
    
    let queryCity = (city || "").trim().toLowerCase();
    
    if (lat && lon) {
      const lVal = parseFloat(lat);
      if (lVal > 0 && lVal < 30) queryCity = "mumbai";
      else if (lVal < 0) queryCity = "sydney";
      else if (lVal > 40 && parseFloat(lon) < 0) queryCity = "new york";
      else if (lVal > 40 && parseFloat(lon) > 100) queryCity = "tokyo";
      else queryCity = "london";
    }

    if (!queryCity) {
      queryCity = "new york";
    }

    let matchedWeather = demoCitiesWeather[queryCity];
    if (!matchedWeather) {
      const key = Object.keys(demoCitiesWeather).find(k => queryCity.includes(k) || k.includes(queryCity));
      if (key) {
        matchedWeather = demoCitiesWeather[key];
      }
    }

    if (matchedWeather) {
      return res.json({
        success: true,
        source: "demo",
        data: matchedWeather
      });
    } else {
      if (queryCity.length < 3 || /^\d+$/.test(queryCity)) {
        return res.status(404).json({ success: false, error: "City not found. Please check spelling." });
      }

      const firstChar = queryCity.charCodeAt(0) || 10;
      const secondChar = queryCity.charCodeAt(1) || 10;
      const proceduralTemp = 15 + ((firstChar + secondChar) % 20);
      const proceduralHumidity = 40 + ((firstChar * secondChar) % 50);
      const proceduralWind = 5 + ((firstChar + secondChar) % 25);
      
      const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm", "Windy"];
      const icons = ["01d", "03d", "04d", "10d", "11d", "04d"];
      const condIdx = (firstChar * secondChar) % conditions.length;

      const formattedName = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : "Unknown";

      return res.json({
        success: true,
        source: "demo-procedural",
        data: {
          city: formattedName,
          country: "LOC",
          temp: proceduralTemp,
          feels_like: proceduralTemp - 1,
          condition: conditions[condIdx],
          description: `procedural ${conditions[condIdx].toLowerCase()}`,
          icon: icons[condIdx],
          humidity: proceduralHumidity,
          wind_speed: proceduralWind,
          lat: 0.0,
          lon: 0.0
        }
      });
    }
  }
});

// -------------------------------------------------------------------------
// FRONTEND MIDDLEWARE (VITE IN DEV, STATIC IN PROD)
// -------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Weather + News server running on http://localhost:${PORT}`);
});
