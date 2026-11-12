/**
 * AITU Esports Hub - Gallery Module (Zero Broken Images Guarantee)
 */

function generateBannerSVG(title, subtitle, bg1, bg2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <circle cx="400" cy="250" r="180" fill="rgba(255,255,255,0.06)"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, sans-serif" font-size="38" font-weight="bold">${title}</text>
    <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#e0e0e0" font-family="Segoe UI, sans-serif" font-size="22">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const galleryItems = [
  { id: 1, title: "CS2 Final Arena Match", category: "cs2", image: generateBannerSVG("CS2 GRAND FINALS", "AITU Main Stage • 5v5 Competitive", "#1e3c72", "#2a5298") },
  { id: 2, title: "Dota 2 Trophy Ceremony", category: "dota", image: generateBannerSVG("DOTA 2 ASTANA CUP", "Championship Trophy Presentation", "#8e0e00", "#1f1c18") },
  { id: 3, title: "MVP Award Presentation", category: "awards", image: generateBannerSVG("TOURNAMENT MVP 2026", "Best Player Recognition Ceremony", "#b79891", "#94716b") },
  { id: 4, title: "Cyber Eagles Clutch Moment", category: "cs2", image: generateBannerSVG("1v4 AWP CLUTCH", "AITU Cyber Eagles Highlight", "#0f2027", "#2c5364") },
  { id: 5, title: "Dota 2 Grand Finals Stage", category: "dota", image: generateBannerSVG("ROSHAN PIT TEAMFIGHT", "Astana Phoenix vs Steppe Kings", "#4b134f", "#c94b4b") },
  { id: 6, title: "Champions Celebration", category: "awards", image: generateBannerSVG("AITU CHAMPIONS 2026", "500,000 KZT Prize Winners", "#134e5e", "#71b280") }
];

function renderGallery(filterCategory = 'all') {
  const container = document.getElementById('galleryContainer');
  if (!container) return;

  container.innerHTML = '';

  const filtered = filterCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filterCategory);

  filtered.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6';
    col.innerHTML = `
      <div class="card h-100 shadow-sm gallery-card">
        <img src="${item.image}" class="card-img-top gallery-img" alt="${item.title}" style="height: 200px; object-fit: cover; cursor: pointer;">
        <div class="card-body">
          <p class="card-text fw-bold text-center mb-0">${item.title}</p>
        </div>
      </div>
    `;

    const img = col.querySelector('img');
    img.addEventListener('click', () => openModal(item.image, item.title));
    
    container.appendChild(col);
  });
}

function openModal(src, caption) {
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  modalImg.src = src;
  modalCaption.textContent = caption;

  const bsModal = new bootstrap.Modal(document.getElementById('imageModal'));
  bsModal.show();
}

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();

  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-category');
      renderGallery(cat);
    });
  });
});
