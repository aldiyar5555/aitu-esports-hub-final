/**
 * AITU Esports Hub - OOP Tournament Manager & Public API Integration
 * Uses CheapShark Public Gaming Deals API (no API key required, CORS enabled)
 */

class Tournament {
  constructor({ id, title, game, prizeNumeric, status, date, isExternal = false, externalLink = '#' }) {
    this.id = id;
    this.title = title;
    this.game = game;
    this.prizeNumeric = prizeNumeric;
    this.status = status;
    this.date = date;
    this.isExternal = isExternal;
    this.externalLink = externalLink;
  }

  getFormattedPrize() {
    return `${this.prizeNumeric.toLocaleString()} KZT`;
  }

  createCardHTML(isFavorite) {
    let badgeClass = 'bg-secondary';
    if (this.status === 'Open') badgeClass = 'bg-success';
    if (this.status === 'Upcoming') badgeClass = 'bg-primary';
    if (this.status === 'Closed') badgeClass = 'bg-danger';

    const apiBadge = this.isExternal
      ? `<span class="badge bg-info text-dark ms-1">Live API</span>`
      : '';

    return `
      <div class="card h-100 shadow-sm tournament-card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span class="badge bg-secondary">${this.game}</span>
              ${apiBadge}
            </div>
            <span class="badge ${badgeClass}">${this.status}</span>
          </div>
          <h5 class="card-title">${this.title}</h5>
          <p class="card-text mb-1"><strong>Prize / Value:</strong> ${this.getFormattedPrize()}</p>
          <p class="card-text text-muted small"><strong>Date:</strong> ${this.date}</p>
        </div>
        <div class="card-footer bg-transparent border-top-0 pb-3 d-grid gap-2">
          <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline-warning'} btn-sm fav-btn" data-id="${this.id}">
            ${isFavorite ? '❌ Remove Favorite' : '⭐ Add to Favorites'}
          </button>
        </div>
      </div>
    `;
  }
}

class TournamentManager {
  constructor() {
    this.storageKey = 'aitu_favorites';
    this.localTournaments = [
      new Tournament({ id: 1, title: "CS2 Inter-Faculty Championship", game: "CS2", prizeNumeric: 500000, status: "Open", date: "Nov 20, 2026" }),
      new Tournament({ id: 2, title: "Dota 2 Astana Cup", game: "Dota 2", prizeNumeric: 350000, status: "Open", date: "Nov 25, 2026" }),
      new Tournament({ id: 3, title: "Valorant Student Masters", game: "Valorant", prizeNumeric: 250000, status: "Upcoming", date: "Dec 01, 2026" }),
      new Tournament({ id: 4, title: "FC 24 Campus League", game: "FC 24", prizeNumeric: 100000, status: "Closed", date: "Nov 05, 2026" }),
      new Tournament({ id: 5, title: "CS2 1v1 Aim Showdown", game: "CS2", prizeNumeric: 150000, status: "Open", date: "Dec 05, 2026" })
    ];
    this.allTournaments = [...this.localTournaments];
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Invalid localStorage data, resetting favorites:", error);
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
  }

  setApiState(type, message) {
    const stateBox = document.getElementById('apiStateContainer');
    if (!stateBox) return;

    if (type === 'loading') {
      stateBox.innerHTML = `
        <div class="alert alert-info d-flex align-items-center" role="alert">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          <div>${message}</div>
        </div>`;
    } else if (type === 'error') {
      stateBox.innerHTML = `<div class="alert alert-danger" role="alert">⚠️ ${message}</div>`;
    } else if (type === 'success') {
      stateBox.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
        ✅ ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    } else {
      stateBox.innerHTML = '';
    }
  }

  // Asynchronous Fetch from Public Gaming API (CheapShark API - Free, Public, No Key)
  async fetchLiveEsportsDeals() {
    this.setApiState('loading', 'Fetching live esports & gaming sponsor deals from external API...');
    try {
      const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15&pageSize=3');
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const deals = await response.json();

      if (!Array.isArray(deals) || deals.length === 0) {
        this.setApiState('error', 'API returned empty data.');
        return;
      }

      const apiItems = deals.map((deal, idx) => new Tournament({
        id: 200 + idx,
        title: `Sponsor Cup: ${deal.title}`,
        game: "API Promo",
        prizeNumeric: Math.round(parseFloat(deal.normalPrice || 20) * 5000),
        status: "Open",
        date: "Dec 18, 2026",
        isExternal: true
      }));

      this.allTournaments = [...this.localTournaments, ...apiItems];
      this.setApiState('success', `Loaded ${apiItems.length} live sponsor events from CheapShark Public API.`);
    } catch (err) {
      console.error("API Fetch failed:", err);
      this.allTournaments = [...this.localTournaments];
      this.setApiState('error', 'Could not connect to external API. Showing offline local tournaments.');
    }
  }

  getFilteredAndSorted(searchQuery, selectedGame, sortBy) {
    let result = this.allTournaments.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.game.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGame = selectedGame === 'All' || t.game === selectedGame;
      return matchesSearch && matchesGame;
    });

    if (sortBy === 'prizeDesc') {
      result.sort((a, b) => b.prizeNumeric - a.prizeNumeric);
    } else if (sortBy === 'prizeAsc') {
      result.sort((a, b) => a.prizeNumeric - b.prizeNumeric);
    } else if (sortBy === 'titleAsc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }

  renderTournaments(list) {
    const grid = document.getElementById('tournamentsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (list.length === 0) {
      grid.innerHTML = '<div class="col-12"><div class="alert alert-warning">No tournaments match your search or filter criteria.</div></div>';
      return;
    }

    list.forEach(tournament => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';
      const isFav = this.favorites.some(f => f.id === tournament.id);
      col.innerHTML = tournament.createCardHTML(isFav);
      grid.appendChild(col);
    });

    this.attachCardEvents();
  }

  toggleFavorite(id) {
    const found = this.allTournaments.find(t => t.id === id);
    const existingIndex = this.favorites.findIndex(f => f.id === id);

    if (existingIndex > -1) {
      this.favorites.splice(existingIndex, 1);
    } else if (found) {
      this.favorites.push({
        id: found.id,
        title: found.title,
        game: found.game,
        prizeNumeric: found.prizeNumeric
      });
    }

    this.saveFavorites();
    this.renderFavorites();
    this.refreshView();
  }

  clearAllFavorites() {
    this.favorites = [];
    this.saveFavorites();
    this.renderFavorites();
    this.refreshView();
  }

  renderFavorites() {
    const listEl = document.getElementById('favoritesList');
    const countEl = document.getElementById('favCount');
    if (!listEl || !countEl) return;

    countEl.textContent = this.favorites.length;
    listEl.innerHTML = '';

    if (this.favorites.length === 0) {
      listEl.innerHTML = '<li class="list-group-item text-muted">No favorite tournaments added yet.</li>';
      return;
    }

    this.favorites.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span><strong>${item.title}</strong> (${item.game}) — ${item.prizeNumeric.toLocaleString()} KZT</span>
        <button class="btn btn-sm btn-outline-danger remove-fav-btn" data-id="${item.id}">Remove</button>
      `;
      listEl.appendChild(li);
    });

    document.querySelectorAll('.remove-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        this.toggleFavorite(id);
      });
    });
  }

  attachCardEvents() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        this.toggleFavorite(id);
      });
    });
  }

  refreshView() {
    const searchVal = document.getElementById('searchInput')?.value || '';
    const gameVal = document.getElementById('gameFilter')?.value || 'All';
    const sortVal = document.getElementById('sortSelect')?.value || 'default';
    const filtered = this.getFilteredAndSorted(searchVal, gameVal, sortVal);
    this.renderTournaments(filtered);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const manager = new TournamentManager();
  manager.renderFavorites();
  manager.renderTournaments(manager.allTournaments);

  await manager.fetchLiveEsportsDeals();
  manager.refreshView();

  const searchInput = document.getElementById('searchInput');
  const gameFilter = document.getElementById('gameFilter');
  const sortSelect = document.getElementById('sortSelect');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const refreshApiBtn = document.getElementById('refreshApiBtn');
  const clearFavBtn = document.getElementById('clearFavoritesBtn');

  if (searchInput) searchInput.addEventListener('input', () => manager.refreshView());
  if (gameFilter) gameFilter.addEventListener('change', () => manager.refreshView());
  if (sortSelect) sortSelect.addEventListener('change', () => manager.refreshView());

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      gameFilter.value = 'All';
      sortSelect.value = 'default';
      manager.refreshView();
    });
  }

  if (refreshApiBtn) {
    refreshApiBtn.addEventListener('click', async () => {
      await manager.fetchLiveEsportsDeals();
      manager.refreshView();
    });
  }

  if (clearFavBtn) {
    clearFavBtn.addEventListener('click', () => manager.clearAllFavorites());
  }
});
