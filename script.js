'use strict';
// Links remain usable as full-resolution images when JavaScript is unavailable.
const shots = [...document.querySelectorAll('.shot-link')];
const viewer = document.querySelector('.lightbox');
const image = document.querySelector('#lightbox-image');
const caption = document.querySelector('#lightbox-caption');
let current = 0;
let opener;
function displayShot(index) {
  current = (index + shots.length) % shots.length;
  const shot = shots[current];
  image.src = shot.href;
  image.alt = shot.querySelector('img').alt;
  caption.textContent = shot.dataset.caption;
}
if (typeof viewer.showModal === 'function') {
  shots.forEach((shot, index) => {
    shot.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = shot;
      displayShot(index);
      viewer.showModal();
      document.body.classList.add('viewer-open');
    });
  });
  viewer.querySelector('.close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.previous').addEventListener('click', () => displayShot(current - 1));
  viewer.querySelector('.next').addEventListener('click', () => displayShot(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayShot(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    image.removeAttribute('src');
    opener?.focus();
  });
}
