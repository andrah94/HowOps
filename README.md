# HowOps website

This repository serves [howopsconsulting.com](https://www.howopsconsulting.com/) through GitHub Pages. The public website is the static `index.html`, `styles.css`, `script.js`, `privacy.html`, `terms.html`, `thanks.html`, and `assets/` files at the repository root.

## Preview locally

```bash
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/`. The site has no build step or runtime dependencies. The Google Fonts stylesheet is the only external styling dependency; system fonts provide a fallback.

## Content and links

- Booking: `https://calendar.app.google/SnQB3ANFcue1HCEEA`
- Email: `contact@howopsconsulting.com`
- Founder photo and attributed Glenn Windom II testimonial come from the previous HowOps website. Unsubstantiated quantitative experience/results claims were removed; the degree links to Andra’s published ABLE founder bio.
- ABLE HQ and WISE HQ are featured with Andra's direct confirmation that they are HowOps builds. The ABLE launch and HQ identity videos were supplied by Andra for this site.

The prior repository's app skeleton remains in subdirectories but does not serve the public site. The homepage avoids unsupported performance statistics, stock people, and a newsletter popup. Before publishing, confirm the booking link and testimonial remain current.

## Scroll experience

The opening is a continuous perspective scene rendered with native Canvas 2D. Scroll progress first organizes loose inputs, then advances a camera through capture, connection, and delivery frames into an actual image from the ABLE HQ launch film. The scene illustrates a workflow; it is not a live product interface. It uses no scroll interception, animation libraries, or WebGL dependency.

The chapter links jump directly to each point in the journey. The HQ, expertise, founder, and booking routes are always available. The home link explicitly returns to the document top. Reduced motion, the visible motion control, short viewports, and unavailable canvas use a normal readable document. With JavaScript disabled, the video links open the media directly.

The supplied HowOps brand film loops, muted, when motion is enabled; its final wordmark remains visible. It can be paused or replayed. The ABLE launch plays inline and also opens from the journey portal in a keyboard-accessible dialog with native controls and English captions. The optional 22-second narration uses ElevenLabs' Chris O. stock voice, requires a click, and includes a transcript. Audio is paused when the page is hidden.

Native details elements expose the three service descriptions. The HQ section distinguishes HowOps (company), HQ (product), and the ABLE / WISE builds without adding unsupported results or WISE feature claims.

## Release

GitHub Pages uses the default branch. Review the homepage at common phone and desktop widths, merge a reviewed pull request into the default branch, then check the live domain. The site does not require Vercel or a DNS change.

## Inquiries, pricing, and policies

The native HTML inquiry form submits to the connected Jotform account: https://form.jotform.com/262687308828067. Responses are stored there. Owner editor: https://www.jotform.com/build/262687308828067. New-submission notifications are enabled for contact@howopsconsulting.com. Responses are also available in Jotform; inbox delivery is not independently verified. Browser test submissions were accepted and stored. The confirmation page has a tested Return to HowOps link.

The site offers custom-quoted audits, scoped projects, and monthly retainers. Prices and delivery ranges have not been supplied; no amounts or durations are invented. Timing is agreed during scoping.

Privacy and website terms live at `privacy.html` and `terms.html`, describing the actual hosted form, Google fonts/calendar, and preview/production hosting. Before merging production, update the form’s privacy link and thank-you return link to the production privacy.html and thanks.html pages and confirm operational practices remain accurate.

Verified public founder social link: https://linkedin.com/in/andrabh/ (linked from ABLE’s founder page). No additional social accounts are assumed.

## ABLE HQ story

The ABLE HQ case study uses Andra’s confirmed context: a small team, volunteers, and fragmented work. It connects that need to the visible product capabilities without inventing time savings, growth metrics, or client quotes. The relationship disclosure identifies Andra as founder of both HowOps and ABLE.
