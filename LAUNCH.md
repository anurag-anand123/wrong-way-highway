# Wrong Way Highway: launch and maintenance

The site is plain HTML, CSS, and JavaScript. Upload the repository's site files and assets; no build step is required. The CNAME, canonical URLs, and sitemap use wrongwayhighway.com.

## Pages
- index.html: main landing page
- ios-beta.html: App Store availability and TestFlight installation guide
- press.html: press information and ZIP download
- showcase.html: secondary preview, intentionally excluded from search indexing
- privacy-policy.html: game privacy policy

## Release checklist
1. Confirm availability independently on each store. Do not activate release wording based only on the calendar.
2. Add official download badge artwork without changing it, and update the corresponding `released`, `url`, and `badge` values in site-config.js. Set the overall `released` value when the game is launched.
3. Update static HTML fallbacks in index.html and showcase.html, including badges, launch wording, FAQ, and availability notes. These must also be correct without JavaScript.
4. Update ios-beta.html when App Store pre-orders or downloads become available. Keep the TestFlight link only while the beta remains open.
5. Update press.html and press/fact-sheet.txt; regenerate the press ZIP after changing facts or artwork.
6. Test store links, beta invitation, image viewer, and mobile layout before publishing.

App Store pre-order artwork is retained at the owner's request, with an explicit note that pre-orders are not open. Apple's guidance says pre-order badges are for apps actually available for pre-order; the compliant pre-order-unavailable alternative is a plain "Try the iOS beta" link. Revisit this when preparing a public release.

## Analytics integration
Analytics is deliberately disabled at the owner’s request. No third-party tracking, cookies, or analytics network collection is installed. Store, TestFlight, trailer, and press actions dispatch `game:engagement` with only `{ name, page }`. Set `GAME_SITE.analytics` in site-config.js to a function for your chosen analytics provider after configuring the provider and appropriate privacy disclosures. Events are not stored or sent anywhere by default. A store click is not a completed pre-registration.

## Media
The 15-second hero loop is a separate compressed H.264 file with no audio and fast-start metadata. The original video is preserved. Gallery thumbnails use responsive JPEG sizes; home lightbox links always use compressed images. The original assets are only in the downloadable press kit and the existing showcase lightbox.

## Content still needing confirmed information
Do not invent price, offline support, control schemes, reviews, or testimonials. Add these to the FAQ or supporting sections once confirmed. User-supplied 50M+ download history is explicitly attributed to Extreme Balancer 3.
