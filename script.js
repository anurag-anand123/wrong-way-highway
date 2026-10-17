'use strict';
(() => {
  // Each link defines its own image quality. Home links use compressed JPEGs.
  const shots = [...document.querySelectorAll('.shot-link')];
  const viewer = document.querySelector('.lightbox');
  if (!viewer || !shots.length || typeof viewer.showModal !== 'function') return;
  const image = viewer.querySelector('#lightbox-image');
  const caption = viewer.querySelector('#lightbox-caption');
  const count = viewer.querySelector('#lightbox-count');
  const state = viewer.querySelector('#lightbox-state');
  let current = 0, opener, requestId = 0, startPoint;
  const nextImage = new Image();
  const report = open => document.dispatchEvent(new CustomEvent('game:viewer', { detail: { open } }));
  function displayShot(index) {
    current = (index + shots.length) % shots.length;
    const shot = shots[current];
    const id = ++requestId;
    image.hidden = true;
    image.alt = shot.querySelector('img').alt;
    caption.textContent = shot.dataset.caption;
    if (count) count.textContent = `Image ${current + 1} of ${shots.length}`;
    if (state) { state.hidden = false; state.textContent = 'Loading image…'; }
    const pending = new Image();
    pending.onload = () => {
      if (id !== requestId || !viewer.open) return;
      image.src = shot.href; image.hidden = false;
      if (state) state.hidden = true;
      // Warm only the next compressed asset, after the current image is ready.
      const next = shots[(current + 1) % shots.length].href;
      if (next.includes('/web/')) nextImage.src = next;
    };
    pending.onerror = () => {
      if (id !== requestId) return;
      if (state) { state.hidden = false; state.textContent = 'This image could not load. Try the next image or close the viewer.'; }
      else { caption.textContent = 'This image could not load. Please try another image.'; }
    };
    pending.src = shot.href;
  }
  shots.forEach((shot, index) => shot.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = shot;
    viewer.showModal(); document.body.classList.add('viewer-open'); report(true); displayShot(index);
  }));
  viewer.querySelector('.close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.previous').addEventListener('click', () => displayShot(current - 1));
  viewer.querySelector('.next').addEventListener('click', () => displayShot(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); displayShot(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === viewer.querySelector('.lightbox-stage')) viewer.close();
  });
  const stage = viewer.querySelector('.lightbox-stage');
  stage.addEventListener('touchstart', event => {
    startPoint = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!startPoint || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - startPoint.x;
    const dy = event.changedTouches[0].clientY - startPoint.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) displayShot(current + (dx < 0 ? 1 : -1));
    startPoint = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { startPoint = null; });
  viewer.addEventListener('close', () => {
    requestId++; document.body.classList.remove('viewer-open'); image.removeAttribute('src'); report(false); opener?.focus();
  });
})();
