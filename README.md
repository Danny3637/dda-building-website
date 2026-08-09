# DDA Building Ltd — company website

Static, dependency-free site for a specialist drylining workforce supplier. Plain
HTML, one stylesheet, one script. No build step, no framework, no CDN — it runs
straight off the filesystem or any static host, including GitHub Pages.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — hero, stats, workforce overview, featured projects |
| `about.html` | About Us — story, milestones, values, leadership |
| `services.html` | Our Services — the drylining trades supplied plus the five-stage process |
| `projects.html` | Projects — real site photography with sector filtering |
| `certifications.html` | Certifications — worker qualifications |
| `contact.html` | Contact Us — enquiry form (emails via FormSubmit.co), contact details |

Shared assets: `css/styles.css`, `js/main.js`, `images/`.

## Running it locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
# Python 3
python -m http.server 8000

# or Node
npx http-server . -c-1

# or, for live-reload while editing
npx live-server --port=5500 --no-css-inject
```

Then visit http://localhost:8000/ (or :5500).

## The contact form

`contact.html`'s form posts to FormSubmit.co — no backend required. `js/main.js`
intercepts the submit, validates client-side, then `fetch()`s the form data to
that endpoint.

**Currently a stopgap:** `ddabuilding.com` has no mail hosting configured (no MX
records), so the form temporarily posts to `daniilsdmitrijevs@gmail.com` instead
of `timur@ddabuilding.com` / `dmitrij@ddabuilding.com`, which are displayed
elsewhere on the site as the contact addresses but can't yet receive mail. Once
proper email hosting is set up for the domain, update the form's `action` in
`contact.html` back to the real addresses.

**One-time activation required:** the first submission to a new destination address
triggers a confirmation email from FormSubmit. Until that confirmation link is
clicked, submissions are silently dropped. Send a test enquiry through the live
form after deploying and confirm it.

Server-side validation is FormSubmit's responsibility here — the client-side checks
in `main.js` are for user experience, not security.

## Deploying to GitHub Pages with a custom domain

This folder is already a git repo with a `CNAME` file (`ddabuilding.co.uk`) ready
for GitHub Pages, and is pushed to https://github.com/Danny3637/dda-building-website
with Pages already enabled.

1. At your domain registrar for `ddabuilding.co.uk` (Squarespace Domains), add:
   - Four **A** records for the apex (`@`) pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A **CNAME** record for `www` → `danny3637.github.io`
   - Remove the old Squarespace default A records and the `HTTPS @` record —
     they point at Squarespace's own hosting and are no longer needed.
2. Wait for DNS to propagate (usually minutes, can take a few hours), then tick
   **Enforce HTTPS** on the repo's **Settings → Pages** page once it's available.

## Customising the look

All colours, spacing and typography come from custom properties at the top of
`css/styles.css`. Changing `--navy-900` and `--amber-600` re-themes the whole site.
