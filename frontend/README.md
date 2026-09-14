# Training4Impact — Frontend

Modern redevelopment of the [Training4Impact.com](https://training4impact.com) medical
fellowship platform. This frontend is built with **React + Vite + Tailwind CSS + React Router**
and reproduces the existing website's content, courses, testimonials, FAQs, legal pages and
business information in a cleaner, data-driven, responsive architecture.

## Project Overview

Training4Impact (operated by **Future Impact Pvt Ltd**, Lucknow) delivers medical fellowships
for Doctors, Nurses & Perfusionists in Cardiac Critical Care, Echocardiography, ECMO and
Cardio Diabetes, plus open-to-all certificate courses.

This repo contains the **frontend only**. The `backend/` folder at the repository root is
intentionally empty — backend, authentication and payment APIs are **not implemented in this
phase**.

## Technology Stack

- **React 18** + **Vite 5** (build tooling)
- **Tailwind CSS 3** (utility-first styling)
- **React Router 6** (routing)
- **Lucide React** (icons)
- **Framer Motion** available for subtle animations (optional)
- **JavaScript (ESM)** — no TypeScript

## Directory Structure

```
training4impact/
├── backend/                     # Empty on purpose (.gitkeep)
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   │   ├── courses/         # Course imagery (onsite SVG placeholders)
│   │   │   ├── logos/           # (reserved for logo assets)
│   │   │   ├── testimonials/    # (reserved for testimonial photos)
│   │   │   └── misc/            # (reserved for miscellaneous assets)
│   │   └── icons/
│   └── src/
│       ├── assets/              # Imported assets
│       ├── components/
│       │   ├── common/          # WhatsAppButton, SectionHeading, CTA, ScrollToTop
│       │   ├── layout/          # Layout, Header, Footer
│       │   ├── home/            # Hero, Stats, PaymentMethods, AlumniNetwork,
│       │   │                    # TestimonialsSection, FAQSection, FinancialServices,
│       │   │                    # WebDevServices, ShareSection
│       │   ├── course/          # CourseCatalog, CourseCard, CourseHero, CourseOverview,
│       │   │                    # Curriculum, Eligibility, Certification, EnrollmentCard,
│       │   │                    # PaymentPlaceholder
│       │   └── contact/         # ContactForm
│       ├── pages/               # Home, Courses, CourseDetails, Contact, Legal pages
│       ├── data/                # courses.js, testimonials.js, faq.js, siteContent.js, legalContent.js
│       ├── routes/              # Routes definitions
│       ├── utils/               # links.js, hooks.js (formatINR lives in data/courses.js)
│       ├── styles/              # global.css (Tailwind directives + components)
│       ├── App.jsx
│       └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
└── .gitignore
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Vite will start the dev server (default http://localhost:5173) and open the browser.

## Production build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

## Routing

| Route | Page |
|---|---|
| `/` | Home page (all landing sections) |
| `/courses` | Course / fellowship catalog with category filters |
| `/courses/:slug` | Individual course details (dynamic, data-driven) |
| `/contact` | Contact page + form (opens WhatsApp) |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/refund-policy` | Refund Policy |
| `/shipping-delivery-policy` | Shipping & Delivery Policy |

Anchors on the home page (`#programs`, `#payments`, `#testimonials`, `#faq`, `#webdev`,
`#finance`, `#share`) scroll smoothly to their section.

## Course-Data Architecture

All course/fellowship content lives in `src/data/courses.js`.

Each course is a single object shaped like:

```js
{
  id: 'f1',
  slug: 'cardiac-critical-care',
  title: 'One Year Fellowship in Cardiac Critical Care',
  shortTitle: 'Cardiac Critical Care',
  category: 'doc',                 // doc | nrs | prf | crs
  targetAudience: 'Doctors',
  image: '/images/courses/cardiac-critical-care.svg',
  badge: 'Fellowship',
  description: '…',
  duration: '1 Year',
  deliveryMode: 'Hands-On + LIVE Sessions',
  fee: 59000,
  highlights: [ '…' ],
  eligibility: [ '…' ],
  curriculum: [ '…' ],
  certification: '…',
  additionalInformation: { emi: '…', seats: '…', type: '…' },
}
```

- `CourseCatalog` renders `CourseCard`s and reads the category filter.
- `CourseDetailsPage` looks up the course by `slug` from the URL (`/courses/:slug`).
- Changing a course later mostly means editing its object in `courses.js`.

Testimonials, FAQs, site-wide copy and legal content live in `src/data/*.js` the same way.

## Backend — intentionally pending

The `backend/` folder is **empty by design**. No Express server, database, authentication,
REST API or admin panel has been implemented yet. All functionality in this phase is
frontend-only.

## Payments / Razorpay — intentionally pending

The enrollment flow uses `PaymentPlaceholder.jsx` to show the fee and a payment-method
selector (UPI/Stripe/PayPal). Clicking **Proceed** shows a notice instead of processing a
transaction.

No fake payments are simulated, no card data is collected, and **no payment credentials or
secret keys are stored in frontend code**. The `handlePayment` function is deliberately
architected as the single integration point where Razorpay (or another gateway) + backend
order creation and verification will be added later.

## Accessibility & SEO

- Semantic HTML (`header`, `main`, `section`, `nav`, `figure`, `dl`, `ol`).
- One `h1` per page, nested heading hierarchy.
- `alt` text on images, `aria-*` on interactive controls, visible focus states.
- Per-page `document.title` and `meta description` (course pages generate these from data).
- `overflow-x: hidden` and mobile-first Tailwind breakpoints — no horizontal overflow.