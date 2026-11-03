const D = window.DATA, $ = s => document.querySelector(s);
const tabs = ['home', 'experience', 'portfolio', 'publications', 'cv'];
const links = a => (a || []).map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('');
const span = e => `${e.start}${e.end ? ' to ' + e.end : ' to now'}`;

function route() {
  const h = location.hash.slice(1), t = tabs.includes(h) ? h : 'home';
  document.querySelectorAll('.tab').forEach(e => e.classList.toggle('on', e.id === t));
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + t));
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route); route();

$('#tl').innerHTML = D.experience.map((e, i) =>
  `<button class="node" data-i="${i}"><span class="date">${span(e)}</span><strong>${e.title}</strong><em>${e.org}</em></button>`).join('');
$('#tl').addEventListener('click', ev => {
  const n = ev.target.closest('.node'); if (!n) return;
  const e = D.experience[n.dataset.i];
  $('#d-meta').textContent = `${e.org}, ${span(e)}`;
  $('#d-title').textContent = e.title;
  $('#d-body').innerHTML = e.desc.map(p => `<p>${p}</p>`).join('') +
    (e.links.length ? `<p class="lk">${links(e.links)}</p>` : '') +
    (e.photos.length ? `<div class="shots">${e.photos.map(p => `<img src="${p}" alt="" onerror="this.remove()">`).join('')}</div>` : '');
  $('#dlg').showModal();
});
$('#close').onclick = () => $('#dlg').close();
$('#dlg').addEventListener('click', ev => { if (ev.target.id === 'dlg') ev.target.close(); });

const portfolioSections = $('#portfolio-sections');
portfolioSections.innerHTML = '';

D.categories.forEach(category => {
  const section = document.createElement('section');
  section.className = 'portfolio-group';

  const heading = document.createElement('h3');
  heading.textContent = category;
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'portfolio-grid';

  D.portfolio
    .filter(project => project.cat === category)
    .forEach(project => {
      const hasReport = Boolean(project.file?.trim());
      const card = document.createElement(hasReport ? 'a' : 'div');

      card.className = 'portfolio-item';
      card.setAttribute('aria-label', project.title);

      if (hasReport) {
        card.href = project.file;
        card.target = '_blank';
        card.rel = 'noopener';
      } else {
        card.tabIndex = 0;
card.setAttribute('role', 'button');
card.setAttribute('aria-haspopup', 'dialog');
card.style.cursor = 'zoom-in';

const openImage = () => {
  const viewer = $('#image-viewer');
  const fullImage = $('#image-viewer-img');

  fullImage.src = project.image;
  fullImage.alt = project.title;
  viewer.showModal();
};

card.addEventListener('click', openImage);

card.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openImage();
  }
});
      }

      const image = document.createElement('img');
      image.addEventListener('load', () => {
  card.classList.toggle(
    'landscape',
    image.naturalWidth > image.naturalHeight
  );
});
      image.src = project.image;
      image.alt = project.title;
      image.loading = 'lazy';

      const overlay = document.createElement('span');
      overlay.className = 'portfolio-overlay';
      overlay.textContent = project.title;

      card.append(image, overlay);
      grid.appendChild(card);
    });

  section.appendChild(grid);
  portfolioSections.appendChild(section);
});

const posterCards = $('#poster-cards');

if (posterCards) {
  posterCards.innerHTML = (D.posters || []).map(p => `
    <article class="poster-card">
      <a class="poster-photo" href="${p.image}" target="_blank" rel="noopener">
        <img src="${p.image}" alt="${p.alt}" loading="lazy">
      </a>
      <p class="poster-authors">${p.authors}</p>
      <h4>${p.title}</h4>
      <p class="poster-venue">${p.venue}</p>
    </article>
  `).join('');
}

const types = [...new Set(D.publications.map(p => p.type))];
$('#pubs').innerHTML = types.map(t => `<div class="pubgrp">${t}</div>` +
  D.publications.filter(p => p.type === t).map(p => `<div class="pub"><span class="yr">${p.year}</span><div><p>${p.text}</p>${links(p.links)}</div></div>`).join('')).join('');

$('#yr').textContent = new Date().getFullYear();
addEventListener('pointermove', e => { $('#xy').textContent = `x ${String(e.clientX).padStart(4, '0')} y ${String(e.clientY).padStart(4, '0')}`; });
const imageViewer = $('#image-viewer');

$('#image-viewer-close').addEventListener('click', () => {
  imageViewer.close();
});

imageViewer.addEventListener('click', event => {
  if (event.target === imageViewer) {
    imageViewer.close();
  }
});

imageViewer.addEventListener('close', () => {
  $('#image-viewer-img').removeAttribute('src');
});