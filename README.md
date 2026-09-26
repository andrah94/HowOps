# HowOps website

This repository serves [howopsconsulting.com](https://www.howopsconsulting.com/) through GitHub Pages. The public website is the static `index.html`, `styles.css`, `script.js`, and `assets/` files at the repository root.

## Preview locally

```bash
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/`. The site has no build step or runtime dependencies. The Google Fonts stylesheet is the only external styling dependency; system fonts provide a fallback.

## Content and links

- Booking: `https://calendar.app.google/SnQB3ANFcue1HCEEA`
- Email: `contact@howopsconsulting.com`
- Founder photo, Glenn Windom II testimonial, and the founder's stated 10+ years / 50+ systems experience were carried over from the previous HowOps website.
- ABLE HQ and WISE HQ are featured with Andra's direct confirmation that they are HowOps builds. The ABLE launch and HQ identity videos were supplied by Andra for this site.

The prior repository's app skeleton remains in subdirectories but does not serve the public site. The homepage avoids unsupported performance statistics, stock people, and a newsletter popup. Before publishing, confirm the booking link and testimonial remain current.

## Scroll experience

The opening is a continuous perspective scene rendered with native Canvas 2D. Scroll progress first organizes loose inputs, then advances a camera through capture, connection, and delivery frames into an actual image from the ABLE HQ launch film. The scene illustrates a workflow; it is not a live product interface. It uses no scroll interception, animation libraries, or WebGL dependency.

The chapter links jump directly to each point in the journey. The HQ, expertise, founder, and booking routes are always available. The home link explicitly returns to the document top. Reduced motion, the visible motion control, short viewports, and unavailable canvas use a normal readable document. With JavaScript disabled, the video links open the media directly.

The supplied HowOps brand film plays once, muted, when motion is enabled; its final wordmark remains visible. It can be paused or replayed. The ABLE launch opens in a keyboard-accessible dialog with native controls and English captions. The optional 22-second narration uses ElevenLabs' Chris O. stock voice, requires a click, and includes a transcript. Audio is paused when the page is hidden.

Native details elements expose the three service descriptions. The HQ section distinguishes HowOps (company), HQ (product), and the ABLE / WISE builds without adding unsupported results or WISE feature claims.

## Release

GitHub Pages uses the default branch. Review the homepage at common phone and desktop widths, merge a reviewed pull request into the default branch, then check the live domain. The site does not require Vercel or a DNS change.
