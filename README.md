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

The homepage uses one sticky scene that follows a route from the business vision through operational friction, implementation, and a documented client outcome. The process labels are links, and the booking link stays in the header. JavaScript enables the scroll scene. With JavaScript disabled, reduced motion enabled, or a short phone viewport, the four beats appear as ordinary readable sections. The narrated introduction requires a user click and has a text transcript.

The HowOps brand film plays once, muted, in the opening scene and can be replayed. Its final wordmark remains visible when it stops. The architectural system poster appears as scrolling advances into the route and blueprint. Both HQ films are click-to-play; the ABLE launch video has English WebVTT captions. The optional 22-second narration uses ElevenLabs' Chris O. stock voice and includes a text transcript.

## Release

GitHub Pages uses the default branch. Review the homepage at common phone and desktop widths, merge a reviewed pull request into the default branch, then check the live domain. The site does not require Vercel or a DNS change.
