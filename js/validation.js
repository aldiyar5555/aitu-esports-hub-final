/**
 * AITU Esports Hub - Form Validation & Draft Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const teamName = document.getElementById('teamName');
  const captainEmail = document.getElementById('captainEmail');
  const gameSelect = document.getElementById('gameSelect');
  const playerCount = document.getElementById('playerCount');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const successAlert = document.getElementById('successAlert');

  const draftKey = 'aitu_reg_draft';

  // Restore saved form draft from localStorage
  try {
    const savedDraft = JSON.parse(localStorage.getItem(draftKey));
    if (savedDraft) {
      if (savedDraft.teamName) teamName.value = savedDraft.teamName;
      if (savedDraft.captainEmail) captainEmail.value = savedDraft.captainEmail;
      if (savedDraft.gameSelect) gameSelect.value = savedDraft.gameSelect;
      if (savedDraft.playerCount) playerCount.value = savedDraft.playerCount;
    }
  } catch (e) {
    console.error("Failed to load draft:", e);
  }

  // Save draft automatically on input
  const saveDraft = () => {
    const draft = {
      teamName: teamName.value,
      captainEmail: captainEmail.value,
      gameSelect: gameSelect.value,
      playerCount: playerCount.value
    };
    localStorage.setItem(draftKey, JSON.stringify(draft));
  };

  [teamName, captainEmail, gameSelect, playerCount].forEach(el => {
    el.addEventListener('input', saveDraft);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (teamName.value.trim().length < 3) {
      setError(teamName);
      isValid = false;
    } else {
      setSuccess(teamName);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(captainEmail.value.trim())) {
      setError(captainEmail);
      isValid = false;
    } else {
      setSuccess(captainEmail);
    }

    if (gameSelect.value === '') {
      setError(gameSelect);
      isValid = false;
    } else {
      setSuccess(gameSelect);
    }

    const countVal = parseInt(playerCount.value);
    if (isNaN(countVal) || countVal < 1 || countVal > 5) {
      setError(playerCount);
      isValid = false;
    } else {
      setSuccess(playerCount);
    }

    if (password.value.length < 6) {
      setError(password);
      isValid = false;
    } else {
      setSuccess(password);
    }

    if (confirmPassword.value === '' || confirmPassword.value !== password.value) {
      setError(confirmPassword);
      isValid = false;
    } else {
      setSuccess(confirmPassword);
    }

    if (isValid) {
      successAlert.classList.remove('d-none');
      localStorage.removeItem(draftKey);
      form.reset();
      [teamName, captainEmail, gameSelect, playerCount, password, confirmPassword].forEach(el => {
        el.classList.remove('is-valid');
      });
      window.scrollTo({ top: form.offsetTop - 50, behavior: 'smooth' });
    } else {
      successAlert.classList.add('d-none');
    }
  });

  function setError(element) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
  }

  function setSuccess(element) {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
  }
});
