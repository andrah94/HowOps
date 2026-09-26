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
- Founder photo and Glenn Windom II testimonial were carried over from the previous HowOps website.

The prior repository's app skeleton remains in subdirectories but does not serve the public site. The homepage avoids unsupported performance statistics, stock people, and a newsletter popup. Before publishing, confirm the booking link and testimonial remain current.

## Release

GitHub Pages uses the default branch. Review the homepage at common phone and desktop widths, merge a reviewed pull request into the default branch, then check the live domain. The site does not require Vercel or a DNS change.
