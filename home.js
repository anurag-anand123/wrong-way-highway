'use strict';
(() => {
  const config = window.GAME_SITE;
  function track(name) {
    // Contains only a named action and page path; no identifiers or form data.
    const detail = { name, page: location.pathname };
    document.dispatchEvent(new CustomEvent('game:engagement', { detail }));
    if (typeof config?.analytics === 'function') config.analytics(detail);
  }
  document.querySelectorAll('[data-event]').forEach(link => link.addEventListener('click', () => track(link.dataset.event)));
  if (config) {
    const label = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(config.launchDate + 'T12:00:00Z'));
    document.querySelectorAll('time[datetime]').forEach(time => { time.dateTime = config.launchDate; time.textContent = label; });
    if (config.released) {
      document.querySelectorAll('[data-launch-heading]').forEach(el => { el.textContent = 'The highway is open.'; });
      document.querySelectorAll('[data-launch-faq]').forEach(el => { el.textContent = 'Wrong Way Highway has launched. Check your store listing for availability on your device.'; });
      document.querySelectorAll('.developer-copy p').forEach(el => { if (el.querySelector('time')) el.textContent = 'Wrong Way Highway is out now. Thanks for taking a look at my game.'; });
    }
    for (const [platform, setting] of Object.entries({ ios: config.ios, android: config.android })) {
      const link = document.querySelector(platform === 'ios' ? '[data-event="ios_details"]' : '[data-event="google_play"]');
      if (!link || !setting.released) continue;
      link.href = setting.url;
      const img = link.querySelector('img');
      img.src = setting.badge;
      img.alt = platform === 'ios' ? 'Download on the App Store' : 'Get it on Google Play';
      link.setAttribute('aria-label', img.alt);
      link.parentElement.querySelector('span').textContent = 'Available now';
    }
  }

  const player = document.getElementById('gameplay-player');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.getElementById('motion-toggle');
  let userPaused = false;
  let inView = true;
  let overlayOpen = false;
  const saveData = navigator.connection?.saveData === true;
  function syncPlayback() {
    if (!player) return;
    const play = !motion.matches && !saveData && !userPaused && inView && !document.hidden && !overlayOpen;
    if (toggle) toggle.hidden = motion.matches || saveData;
    if (!play) { player.pause(); return; }
    if (!player.getAttribute('src')) player.src = player.dataset.src;
    player.muted = true;
    player.play().catch(() => { player.classList.remove('is-playing'); if (toggle) toggle.textContent = 'Play background'; });
  }
  if (player) {
    player.addEventListener('playing', () => { player.classList.add('is-playing'); if (toggle) toggle.textContent = 'Pause background'; });
    player.addEventListener('error', () => { player.classList.remove('is-playing'); if (toggle) toggle.hidden = true; });
    toggle?.addEventListener('click', () => {
      userPaused = !player.paused;
      if (userPaused) toggle.textContent = 'Play background';
      syncPlayback();
    });
    motion.addEventListener('change', () => {
      if (motion.matches) { player.pause(); player.removeAttribute('src'); player.load(); player.classList.remove('is-playing'); }
      syncPlayback();
    });
    document.addEventListener('visibilitychange', syncPlayback);
    document.addEventListener('game:viewer', event => { overlayOpen = event.detail.open; syncPlayback(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncPlayback(); }, { threshold: 0.05 }).observe(player.closest('.hero-banner'));
    } else syncPlayback();
  }

  const trailer = document.getElementById('trailer-dialog');
  const open = document.getElementById('trailer-open');
  if (trailer && open) {
    open.hidden = false;
    open.addEventListener('click', () => {
      if (typeof trailer.showModal !== 'function') { location.href = 'https://youtu.be/5j3gRj9Xhcs'; return; }
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/5j3gRj9Xhcs?autoplay=1&playsinline=1&rel=0';
      iframe.title = 'Wrong Way Highway gameplay video';
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      document.getElementById('trailer-container').replaceChildren(iframe);
      trailer.showModal(); document.body.classList.add('viewer-open');
      overlayOpen = true; syncPlayback(); track('trailer_open');
    });
    document.getElementById('trailer-close').addEventListener('click', () => trailer.close());
    trailer.addEventListener('click', event => { if (event.target === trailer) trailer.close(); });
    trailer.addEventListener('close', () => {
      document.getElementById('trailer-container').replaceChildren();
      document.body.classList.remove('viewer-open'); overlayOpen = false; syncPlayback(); open.focus();
    });
  }
})();
