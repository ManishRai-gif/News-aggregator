/**
 * Weather Effect Overlays in Vanilla JavaScript & CSS
 * Replaces React motion overlays with high-performance CSS animations.
 */

export function renderWeatherEffects(container, condition = "", description = "") {
  if (!container) return;
  container.innerHTML = "";

  const cond = condition.toLowerCase();
  const desc = description.toLowerCase();

  // 1. Thunderstorm / Storm
  if (cond.includes("thunder") || cond.includes("storm") || desc.includes("thunder") || desc.includes("storm")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950/20">
        <div class="absolute inset-0 bg-white/20 animate-lightning-flash"></div>
        <div class="absolute inset-0 flex items-start justify-center opacity-0 text-yellow-100/35 animate-lightning-fork">
          <svg class="w-full h-full max-h-64 drop-shadow-[0_0_15px_rgba(254,240,138,0.45)]" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M120,0 L100,50 L130,50 L90,110 L115,110 L75,180 L100,180 L80,220" />
            <path d="M100,50 L80,75 L95,85" stroke-width="1" opacity="0.7" />
          </svg>
        </div>
        ${Array.from({ length: 24 }).map((_, i) => `
          <div class="absolute bg-blue-100/35 w-[1.2px] h-5 rounded-full animate-rain-slant"
               style="left: ${(i / 24) * 105}%; top: -20px; animation-delay: ${Math.random() * 2}s; animation-duration: ${0.55 + Math.random() * 0.35}s;">
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  // 2. Heavy Rain / Drizzle
  if (cond.includes("rain") || cond.includes("drizzle") || desc.includes("rain") || desc.includes("drizzle")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-slate-400/15 to-transparent blur-md"></div>
        ${Array.from({ length: 18 }).map((_, i) => `
          <div class="absolute bg-blue-100/25 w-[0.8px] h-3.5 rounded-full animate-rain-drop"
               style="left: ${(i / 18) * 100}%; top: -20px; animation-delay: ${Math.random() * 2.5}s; animation-duration: ${1.1 + Math.random() * 0.5}s;">
          </div>
        `).join("")}
        ${Array.from({ length: 12 }).map((_, i) => `
          <div class="absolute bg-blue-200/40 w-[1.8px] h-6 rounded-full blur-[0.4px] animate-rain-drop"
               style="left: ${5 + (i / 12) * 90}%; top: -20px; animation-delay: ${Math.random() * 2}s; animation-duration: ${0.65 + Math.random() * 0.3}s;">
          </div>
        `).join("")}
        ${Array.from({ length: 6 }).map((_, i) => `
          <div class="absolute border border-blue-200/25 rounded-full animate-splash"
               style="width: 14px; height: 5px; bottom: ${4 + Math.random() * 6}%; left: ${8 + i * 16 + Math.random() * 8}%; animation-delay: ${Math.random() * 2}s; animation-duration: ${0.9 + Math.random() * 0.3}s;">
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  // 3. Snow / Freeze / Ice
  if (cond.includes("snow") || cond.includes("freeze") || cond.includes("ice") || desc.includes("snow") || desc.includes("ice")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-900/10">
        ${Array.from({ length: 24 }).map((_, i) => {
          const size = 3 + (i % 4) * 2;
          return `
            <div class="absolute bg-white/70 rounded-full blur-[0.4px] shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-snow-fall"
                 style="width: ${size}px; height: ${size}px; left: ${(i / 24) * 100}%; top: -20px; animation-delay: ${Math.random() * 5}s; animation-duration: ${6 + Math.random() * 5}s;">
            </div>
          `;
        }).join("")}
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(186,230,253,0.08)_0%,transparent_60%)] pointer-events-none"></div>
      </div>
    `;
    return;
  }

  // 4. Sunny / Clear / Sun
  if (cond.includes("sunny") || cond.includes("clear") || desc.includes("clear") || desc.includes("sunny") || desc.includes("sun")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/15 to-yellow-300/5 blur-3xl animate-pulse-slow"></div>
        ${Array.from({ length: 12 }).map((_, i) => `
          <div class="absolute bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-full shadow-[0_0_4px_rgba(251,191,36,0.4)] animate-float-up"
               style="width: ${1.5 + (i % 3)}px; height: ${1.5 + (i % 3)}px; left: ${10 + i * 8}%; bottom: 5%; animation-delay: ${i * 0.45}s; animation-duration: ${5 + (i % 4) * 1.5}s;">
          </div>
        `).join("")}
        <div class="absolute -top-20 -right-20 w-52 h-52 opacity-25 animate-spin-slow">
          <svg viewBox="0 0 100 100" class="w-full h-full text-amber-300 fill-none stroke-current" stroke-width="0.8">
            <circle cx="50" cy="50" r="16" class="fill-amber-300/5"></circle>
            ${Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              return `<line x1="${50 + 20 * Math.cos(rad)}" y1="${50 + 20 * Math.sin(rad)}" x2="${50 + 44 * Math.cos(rad)}" y2="${50 + 44 * Math.sin(rad)}" stroke-dasharray="4 2"></line>`;
            }).join("")}
          </svg>
        </div>
      </div>
    `;
    return;
  }

  // 5. Partly Cloudy
  if (cond.includes("partly") || desc.includes("partly") || desc.includes("few clouds") || desc.includes("scattered clouds")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        ${Array.from({ length: 3 }).map((_, i) => {
          const size = 110 + i * 30;
          return `
            <div class="absolute bg-white/10 dark:bg-white/5 rounded-full blur-xl animate-cloud-drift"
                 style="width: ${size}px; height: ${size * 0.5}px; bottom: ${20 + i * 18}%; left: ${-30 + i * 15}%; animation-duration: ${32 + i * 10}s; animation-delay: ${i * -8}s;">
            </div>
          `;
        }).join("")}
        <div class="absolute top-4 right-10 w-24 h-24 rounded-full bg-yellow-400/10 blur-xl pointer-events-none"></div>
      </div>
    `;
    return;
  }

  // 6. Overcast / Cloudy
  if (cond.includes("cloud") || desc.includes("cloud") || desc.includes("overcast")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        ${Array.from({ length: 5 }).map((_, i) => {
          const bgClass = i % 2 === 0 ? "bg-slate-200/10 dark:bg-slate-800/10" : "bg-slate-300/15 dark:bg-slate-700/10";
          return `
            <div class="absolute rounded-full blur-xl ${bgClass} animate-cloud-drift"
                 style="width: ${150 + i * 35}px; height: ${75 + i * 15}px; bottom: ${8 + i * 14}%; left: ${-35 + i * 12}%; animation-duration: ${26 + i * 7}s; animation-delay: ${i * -6}s;">
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // 7. Fog / Mist / Haze
  if (cond.includes("fog") || cond.includes("mist") || cond.includes("haze") || desc.includes("fog") || desc.includes("mist")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-400/[0.02]">
        ${Array.from({ length: 4 }).map((_, i) => `
          <div class="absolute bg-white/10 dark:bg-slate-300/5 rounded-full blur-3xl animate-mist-swirl"
               style="width: 150%; height: 65px; bottom: ${-15 + i * 14}px; left: -25%; animation-duration: ${13 + i * 4}s;">
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  // 8. Windy / Breeze
  if (cond.includes("wind") || desc.includes("wind") || desc.includes("breeze") || desc.includes("gust")) {
    container.innerHTML = `
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        ${Array.from({ length: 3 }).map((_, i) => `
          <div class="absolute w-44 h-8 text-white/10 animate-wind-sweep"
               style="top: ${20 + i * 24}%; left: -45%; animation-duration: ${2.1 + Math.random() * 1.3}s; animation-delay: ${i * 0.75}s;">
            <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" class="w-full h-full">
              <path d="M 0,10 C 25,4 65,16 100,10" />
            </svg>
          </div>
        `).join("")}
        ${Array.from({ length: 6 }).map((_, i) => {
          const leafColors = ["text-amber-500/25", "text-orange-400/20", "text-emerald-600/15", "text-yellow-500/20"];
          return `
            <div class="absolute ${leafColors[i % leafColors.length]} animate-leaf-tumble"
                 style="top: ${15 + i * 16}%; left: -30px; animation-duration: ${3.8 + Math.random() * 2.2}s; animation-delay: ${i * 0.8}s;">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L2.18,20.66C4.26,15.49 6.1,8.2 16,6.2C12.4,12.2 12.11,16.8 12.11,16.8C12.11,16.8 10.3,16.15 8.32,16.89C6.33,17.63 5.42,19.38 5.42,19.38C5.42,19.38 6.5,18.06 8.32,17.58C10.14,17.11 11.11,17.5 11.11,17.5C11.11,17.5 11.1,12.2 17,8Z" />
              </svg>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }
}
