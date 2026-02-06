# Sitecore Cloud SDK Demo

A Next.js 15 demo application showcasing the power and flexibility of [Sitecore Cloud SDK](https://doc.sitecore.com/xmc/en/developers/sdk/004/cloud-sdk/sitecore-cloud-sdk-for-javascript.html). The app demonstrates how to integrate Sitecore's Events, Personalization, and Search capabilities into a modern React application.

**Live Demo:** [https://cloud-sdk-demo.vercel.app](https://cloud-sdk-demo.vercel.app/)

---

## Features

### Events Tracking
- **Page View Events** - Automatic `VIEW` event tracking on every page load via the `PageView` component and `useEvents` hook.
- **Custom Events** - Click-based event tracking through the `TrackableLink` component (e.g., hero banner CTA clicks, card button clicks).
- **Form Events** - Form lifecycle tracking (`VIEWED`, `SUBMITTED`) on the Contact page using the `form()` API.
- **Identity Events** - User identification through the Newsletter Registration form using the `identity()` API, linking email, name, and custom extension data.

### Personalization
- **Personalizable Components** - The `HeroBanner` and `Card` components support a `personalizable` prop that triggers Sitecore Personalize decisions.
- **Token Replacement** - Dynamic token replacement in personalized content (`{FIRSTNAME}`, `{LASTNAME}`, `{EMAIL}`, `{NUMBER_SESSION}`).
- **Decision Offers** - Components consume `decisionOffers` from personalization responses to swap titles, text, and subtitles at runtime.
- **Session Reset** - A "Reset Session" button in the header clears Sitecore cookies to simulate a new visitor session.

### Search
- **Widget-Based Search** - Full search experience powered by `@sitecore-cloudsdk/search` using widget data requests.
- **Faceted Filtering** - Dynamic facet rendering with checkbox-based filtering (e.g., by `news_type`).
- **Search Suggestions** - Suggestion support with clickable "Did you mean?" recommendations when no results are found.
- **Search Event Tracking** - Automatic `widgetView` and `widgetSuggestionClick` event dispatch for search analytics.

### Server-Side SDK Integration
- **Middleware Initialization** - The Cloud SDK is initialized in Next.js middleware for server-side cookie management, ensuring events, personalize, and search packages are available on every request.
- **Server-Side Search API** - A dedicated API route (`/api/demo`) demonstrates server-side search using `@sitecore-cloudsdk/search/server`.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.5 | React framework (App Router) |
| [React](https://react.dev/) | 19 | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS |
| [Sitecore Cloud SDK](https://doc.sitecore.com/xmc/en/developers/sdk/004/cloud-sdk/sitecore-cloud-sdk-for-javascript.html) | 0.6 | Events, Personalize, Search |
| [Headless UI](https://headlessui.com/) | 2.2 | Accessible UI primitives |
| [Heroicons](https://heroicons.com/) | 2.2 | SVG icons |
| [cookies-next](https://www.npmjs.com/package/cookies-next) | 5.1 | Cookie management |

---

## Project Structure

```
src/
├── app/
│   ├── About/page.tsx            # About page
│   ├── Contact/page.tsx          # Contact page with form event tracking
│   ├── News/page.tsx             # News listing page
│   ├── Search/page.tsx           # Search page with faceted search
│   ├── hooks/page.tsx            # Future features page (route: /Future)
│   ├── api/
│   │   ├── demo/route.ts         # Server-side search API endpoint
│   │   └── hello/route.ts        # Health check endpoint
│   ├── components/
│   │   ├── Cloudsdk/
│   │   │   └── pageView.tsx      # Browser-side SDK init + page view events
│   │   ├── Card.tsx              # Personalizable content card
│   │   ├── ContactForm.tsx       # Contact form with form event tracking
│   │   ├── FeatureList.tsx       # Cloud SDK feature overview
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Header.tsx            # Navigation header with mobile menu
│   │   ├── HeroBanner.tsx        # Personalizable hero banner
│   │   ├── NewsletterRegistration.tsx  # Newsletter signup with identity events
│   │   ├── ResetSessionButton.tsx      # Session/cookie reset utility
│   │   ├── Search.tsx            # Full search interface with facets
│   │   ├── SearchResultCard.tsx  # Individual search result display
│   │   ├── Spinner.tsx           # Loading spinner
│   │   ├── Title.tsx             # Reusable title section
│   │   └── TrackableLink.tsx     # Link with custom event tracking
│   ├── consts/
│   │   └── personalization.ts    # Personalization keys, tokens, and constants
│   ├── hooks/
│   │   ├── useEvents.ts          # Page view event hook
│   │   ├── useHover.ts           # Mouse hover detection hook
│   │   ├── useIsVisible.ts       # Intersection Observer visibility hook
│   │   ├── usePersonalization.ts # Personalization data fetching hook
│   │   └── useSearch.ts          # Search widget data fetching hook
│   ├── types/
│   │   └── search.ts             # Search result type definitions
│   ├── layout.tsx                # Root layout with header, footer, and SDK init
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   └── sitemap.ts                # XML sitemap generation
├── middleware.ts                  # Server-side Cloud SDK initialization
```

---

## Environment Variables

The application requires the following environment variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITECORE_CONTEXT_ID` | Sitecore Edge Context ID (browser-side SDK init) |
| `NEXT_PUBLIC_SITECORE_CDP_CONTEXT_ID` | Sitecore CDP Context ID (server-side middleware init) |
| `NEXT_PUBLIC_SITECORE_POS` | Sitecore Point of Sale / Site Name |
| `NEXT_PUBLIC_IDENTITY_PROVIDER` | Identity provider key for the `identity()` event |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Sitecore XM Cloud or CDP/Personalize tenant with Cloud SDK access

### Installation

```bash
git clone https://github.com/sebastiantecsi/CloudSDK-Demo.git
cd CloudSDK-Demo
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITECORE_CONTEXT_ID=your-context-id
NEXT_PUBLIC_SITECORE_CDP_CONTEXT_ID=your-cdp-context-id
NEXT_PUBLIC_SITECORE_POS=your-site-name
NEXT_PUBLIC_IDENTITY_PROVIDER=your-identity-provider
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Pages Overview

| Route | Page | Key Features |
|---|---|---|
| `/` | Home | Personalizable hero banner, feature list, personalizable card, newsletter signup |
| `/News` | News | Hero banner, news content area (in progress) |
| `/Search` | Search | Full-text search with facets, suggestions, and result cards |
| `/Contact` | Contact | Contact form with form event tracking (VIEW/SUBMIT) |
| `/About` | About | Hero banner with about information |
| `/Future` | Future | Placeholder for upcoming features |

---

## Cloud SDK Integration Points

### Browser-Side (Client Components)

The SDK is initialized in `PageView.tsx` which runs on every page:

```typescript
CloudSDK({
  sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_CONTEXT_ID,
  siteName: process.env.NEXT_PUBLIC_SITECORE_POS,
  enableBrowserCookie: true,
})
  .addEvents()
  .addSearch()
  .initialize();
```

### Server-Side (Middleware)

The SDK is also initialized in `middleware.ts` for server-side operations:

```typescript
CloudSDK(request, response, {
  sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_CDP_CONTEXT_ID,
  siteName: process.env.NEXT_PUBLIC_SITECORE_POS,
  enableServerCookie: true,
})
  .addEvents()
  .addSearch()
  .addPersonalize({ enablePersonalizeCookie: true })
  .initialize();
```

---

## Deployment

The application is deployed on [Vercel](https://vercel.com). Push to the `main` branch to trigger an automatic deployment.

---

## Author

Christian Hahn

---

## License

This project is intended for demonstration and educational purposes.
