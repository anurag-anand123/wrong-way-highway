'use strict';
// Change release states only after confirming that each store listing is live.
window.GAME_SITE = Object.freeze({
  launchDate: '2026-10-26',
  released: false,
  ios: { released: false, url: 'ios-beta.html', badge: 'badges/appstorepreord.png' },
  android: { released: false, url: 'https://play.google.com/store/apps/details?id=com.enteriosoft.wrongwayhighway', badge: 'badges/googleplayprereg.png' },
  // Optional privacy-conscious analytics adapter. No data is sent by default.
  analytics: null
});
