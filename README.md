# 🎮 AITU Esports Hub — Final Project Submission

## 📌 Project Description
**AITU Esports Hub** is a full-featured client-side web application built as the continuation of the Midterm and Endterm projects for Astana IT University. It enables students to explore esports tournaments, fetch live gaming sponsor events via an external REST API, manage custom team rosters with full CRUD operations, customize accessibility settings, and register teams with persistent storage.

---

## 👥 Group Members & Contributions
- **Aldiyar Aimbetov** (`@aldiyar5555`) — Project Architecture, Object-Oriented JavaScript (`Tournament`, `TournamentManager`, `TeamCrudManager`, `AppPreferencesManager`), Asynchronous Fetch API integration, `localStorage` data persistence, Form Validation, and GitHub Pages Deployment.
- **Dossymzhan** — Responsive HTML5/Bootstrap 5 layout, UI/UX consistency across 5 connected pages, jQuery roster animations, and Gallery module.

---

## 🚀 Final-Stage Features Implemented (5+ Substantial Features)

### 1. Mandatory External API Integration (`js/tournaments.js`)
- Connected to the **CheapShark Public Gaming Deals API** (`https://www.cheapshark.com/api/1.0/deals`) using `fetch()` and `async / await` (no secret API keys exposed).
- Implements explicit **Loading** (spinner), **Success**, **Empty-data**, and **Error** (network fallback) UI states.
- Parses returned JSON objects and dynamically renders them into the tournament grid alongside local events.

### 2. Mandatory Object-Oriented Programming (`js/tournaments.js`, `js/teams-crud.js`, `js/main.js`)
- **`Tournament` & `TournamentManager` classes:** Encapsulate tournament properties, prize formatting, HTML card generation, filtering, sorting, and favorites management.
- **`CustomTeam` & `TeamCrudManager` classes:** Encapsulate full CRUD logic and DOM table rendering.
- **`AppPreferencesManager` class:** Encapsulates theme state and font-size accessibility scaling.

### 3. Mandatory Browser Data Persistence (`localStorage`)
- **Saved Favorites (`aitu_favorites`):** Persists bookmarked tournaments across sessions with individual remove and "Clear All" controls.
- **Custom Squads (`aitu_custom_teams`):** Persists user-created teams in the CRUD manager.
- **User Preferences (`aitu_theme`, `aitu_font_size`):** Restores Dark/Light mode and custom font scaling on every page load.
- **Form Auto-Draft (`aitu_reg_draft`):** Automatically saves incomplete registration form inputs and clears them upon successful submission.

### 4. Additional Feature A — Complete CRUD Team Manager (`teams.html`, `js/teams-crud.js`)
- Users can **Create** new custom esports teams, **Read** them in a structured Bootstrap table, **Update** existing records in-place, and **Delete** individual or all teams.

### 5. Additional Feature B — Advanced Search, Multi-Criteria Filtering & Sorting (`tournaments.html`)
- Real-time search by title/discipline, category filtering (including Live API events), and dynamic sorting by Prize Pool (High-to-Low, Low-to-High) and Alphabetical Title.

### 6. Additional Feature C — Accessibility Font Scaling & Live League Dashboard (`index.html`, `js/main.js`)
- Interactive `A- / A / A+` font-size controls persisted in `localStorage`, plus a live statistics dashboard on the home page reflecting stored favorites and custom teams.

---

## 🧪 Testing Instructions
1. **API Integration:** Open `tournaments.html`. Observe the loading spinner followed by the green success banner confirming live API deals were loaded. Click **"Reload API Data"** to re-trigger the asynchronous `fetch()`.
2. **Sorting & Filtering:** On `tournaments.html`, filter by `"API External Events"` or sort by `"Prize Pool: High to Low"`.
3. **Persistent Favorites:** Click **"Add to Favorites"** on any card, refresh the browser (`F5`), and verify the favorites list and counter remain intact.
4. **CRUD Operations:** Navigate to `teams.html`, scroll to **Custom Squad Manager**, add a team, click **Edit** to modify its name/captain, and refresh the page to confirm persistence.
5. **Accessibility & Theme:** Use `A-`, `A`, `A+` and `Dark Mode` buttons in the top navbar; navigate across pages to verify settings persist.
6. **Form Validation & Drafts:** Go to `register.html`, type partial info, reload the page to verify auto-draft restoration, test invalid inputs for error feedback, and submit valid data.

---

## 🌐 Links
- **GitHub Repository:** `https://github.com/aldiyar5555/aitu-esports-hub`
- **Published Website (GitHub Pages):** `https://aldiyar5555.github.io/aitu-esports-hub/`
