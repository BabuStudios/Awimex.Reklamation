# Awimex Reklamationsformulär

A customer-facing complaint/claims form for Awimex (automotive parts). Customers
enter their details and describe a product defect; on a valid submission an
inline confirmation is shown. The form is entirely in Swedish.

Built with **Next.js (App Router) + TypeScript** and **React Hook Form**,
recreating the high-fidelity design handoff pixel-accurately.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Structure

| Path | Purpose |
|---|---|
| `app/layout.tsx` | Root layout, loads the Space Grotesk font |
| `app/page.tsx` | Page shell: header bar with logo + main content |
| `app/globals.css` | Global resets, animations, submit-button hover |
| `components/ReklamationForm.tsx` | The form (validation, file upload, success view) |
| `public/awimex-logo.png` | Awimex logo asset |

## Behavior

- **Validation** runs on submit (React Hook Form). Each invalid field shows an
  inline Swedish error message and a red border; errors clear on change.
- **File upload** supports clicking the drop zone or drag & drop. Images are
  appended (not replaced) and shown as 80×80 thumbnails, each with a remove
  button. Object URLs are revoked on removal and unmount.
- **Submission**: on a valid submit the view switches to the success card. No
  server call is made yet — wire the `onSubmit` handler in
  `components/ReklamationForm.tsx` to your backend/API before going live.
