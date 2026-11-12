/**
 * AITU Esports Hub - Main Application Controller (OOP + Preferences Persistence)
 */

class AppPreferencesManager {
  constructor() {
    this.themeKey = 'aitu_theme';
    this.fontKey = 'aitu_font_size';
    this.currentFontSize = parseInt(localStorage.getItem(this.fontKey)) || 16;
  }

  init() {
    this.applyTheme(localStorage.getItem(this.themeKey) === 'dark');
    this.applyFontSize(this.currentFontSize);
    this.bindControls();
  }

  applyTheme(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (isDark) {
      document.body.classList.add('dark-theme');
      if (btn) btn.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('dark-theme');
      if (btn) btn.textContent = '🌙 Dark Mode';
    }
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
  }

  toggleTheme() {
    const isCurrentlyDark = document.body.classList.contains('dark-theme');
    this.applyTheme(!isCurrentlyDark);
  }

  applyFontSize(size) {
    // Clamp font size between 13px and 21px
    this.currentFontSize = Math.min(Math.max(size, 13), 21);
    document.documentElement.style.setProperty('--base-font-size', `${this.currentFontSize}px`);
    localStorage.setItem(this.fontKey, this.currentFontSize);
  }

  bindControls() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    const decBtn = document.getElementById('fontDecreaseBtn');
    const resBtn = document.getElementById('fontResetBtn');
    const incBtn = document.getElementById('fontIncreaseBtn');

    if (decBtn) decBtn.addEventListener('click', () => this.applyFontSize(this.currentFontSize - 1));
    if (resBtn) resBtn.addEventListener('click', () => this.applyFontSize(16));
    if (incBtn) incBtn.addEventListener('click', () => this.applyFontSize(this.currentFontSize + 1));
  }
}

// Update Live Dashboard Counters on Home Page
function updateHomeDashboard() {
  const statTotal = document.getElementById('statTotalTournaments');
  const statPrize = document.getElementById('statTotalPrize');
  const statFavs = document.getElementById('statFavoritesCount');
  const statTeams = document.getElementById('statCustomTeams');

  if (!statTotal) return;

  let savedFavs = [];
  let savedTeams = [];
  try {
    savedFavs = JSON.parse(localStorage.getItem('aitu_favorites')) || [];
    savedTeams = JSON.parse(localStorage.getItem('aitu_custom_teams')) || [];
  } catch (e) {
    savedFavs = [];
    savedTeams = [];
  }

  statTotal.textContent = '6+ Live';
  statPrize.textContent = '1,350,000 KZT';
  statFavs.textContent = savedFavs.length;
  statTeams.textContent = savedTeams.length;
}

document.addEventListener('DOMContentLoaded', () => {
  const prefs = new AppPreferencesManager();
  prefs.init();
  updateHomeDashboard();

  // Quick Search on Home Page
  const quickInput = document.getElementById('quickSearchInput');
  const quickResults = document.getElementById('quickSearchResults');

  if (quickInput && quickResults) {
    const quickItems = [
      "CS2 Inter-Faculty Championship",
      "Dota 2 Astana Cup",
      "Valorant Student Masters",
      "FC 24 Campus League",
      "AITU Cyber Eagles",
      "Astana Phoenix"
    ];

    quickInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      quickResults.innerHTML = '';
      if (query === '') return;

      for (const item of quickItems) {
        if (item.toLowerCase().includes(query)) {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.textContent = item;
          quickResults.appendChild(li);
        }
      }
    });
  }
});
