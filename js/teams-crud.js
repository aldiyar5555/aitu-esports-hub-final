/**
 * AITU Esports Hub - Complete CRUD Team Manager (OOP + localStorage)
 */

class CustomTeam {
  constructor(id, name, game, captain) {
    this.id = id;
    this.name = name;
    this.game = game;
    this.captain = captain;
  }
}

class TeamCrudManager {
  constructor() {
    this.storageKey = 'aitu_custom_teams';
    this.teams = this.loadTeams();
  }

  loadTeams() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [
        new CustomTeam(1, "AITU Legends", "CS2", "Aldiyar"),
        new CustomTeam(2, "Nomad Gaming", "Valorant", "Dossymzhan")
      ];
    } catch (e) {
      return [];
    }
  }

  saveTeams() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.teams));
  }

  createTeam(name, game, captain) {
    const newTeam = new CustomTeam(Date.now(), name, game, captain);
    this.teams.push(newTeam);
    this.saveTeams();
    this.renderTable();
  }

  updateTeam(id, name, game, captain) {
    const index = this.teams.findIndex(t => t.id === id);
    if (index > -1) {
      this.teams[index].name = name;
      this.teams[index].game = game;
      this.teams[index].captain = captain;
      this.saveTeams();
      this.renderTable();
    }
  }

  deleteTeam(id) {
    this.teams = this.teams.filter(t => t.id !== id);
    this.saveTeams();
    this.renderTable();
  }

  clearAll() {
    this.teams = [];
    this.saveTeams();
    this.renderTable();
  }

  renderTable() {
    const tbody = document.getElementById('crudTeamsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (this.teams.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No custom teams created yet. Add one above!</td></tr>';
      return;
    }

    this.teams.forEach((team, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td class="fw-bold">${team.name}</td>
        <td><span class="badge bg-primary">${team.game}</span></td>
        <td>${team.captain}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-team-btn me-1" data-id="${team.id}">✏️ Edit</button>
          <button class="btn btn-sm btn-danger delete-team-btn" data-id="${team.id}">🗑️ Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.attachRowEvents();
  }

  attachRowEvents() {
    document.querySelectorAll('.delete-team-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        this.deleteTeam(id);
      });
    });

    document.querySelectorAll('.edit-team-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const team = this.teams.find(t => t.id === id);
        if (team) {
          document.getElementById('editTeamId').value = team.id;
          document.getElementById('crudTeamName').value = team.name;
          document.getElementById('crudGame').value = team.game;
          document.getElementById('crudCaptain').value = team.captain;
          const submitBtn = document.getElementById('crudSubmitBtn');
          submitBtn.textContent = '💾 Update Team';
          submitBtn.classList.replace('btn-success', 'btn-warning');
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const crudManager = new TeamCrudManager();
  crudManager.renderTable();

  const form = document.getElementById('crudTeamForm');
  const clearBtn = document.getElementById('clearAllTeamsBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const editId = document.getElementById('editTeamId').value;
      const name = document.getElementById('crudTeamName').value.trim();
      const game = document.getElementById('crudGame').value;
      const captain = document.getElementById('crudCaptain').value.trim();

      if (!name || !captain) return;

      if (editId) {
        crudManager.updateTeam(parseInt(editId), name, game, captain);
        document.getElementById('editTeamId').value = '';
        const submitBtn = document.getElementById('crudSubmitBtn');
        submitBtn.textContent = '➕ Add Team';
        submitBtn.classList.replace('btn-warning', 'btn-success');
      } else {
        crudManager.createTeam(name, game, captain);
      }

      form.reset();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => crudManager.clearAll());
  }
});
