# WedPlan Client

WedPlan is a wedding planning marketplace. Customers discover services and request bookings, vendors publish services and manage requests, and admins moderate the platform.

## Features

- Public catalogue with six assignment categories, keyword and location filters, budget ranges, and price sorting
- Better Auth email and Google authentication, role-protected dashboards, and ImgBB profile and service images
- Booking requests, vendor moderation, and Stripe Test Mode subscriptions and transaction reporting

## Technology

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Motion, and Sonner. The separate API uses Express, MongoDB, Better Auth, ImgBB, and Stripe.

## Run locally

1. Start the [WedPlan API](https://github.com/tonmoybiswas07/wedplan_server) and configure its environment.
2. In this repository, run `npm ci`.
3. Copy `.env.example` to `.env.local`. Set `API_BASE_URL` to the Express origin.
4. Run `npm run dev` and open [WedPlan on localhost](http://localhost:3000).

Run `npm run build` followed by `npm start` to check the production build locally.

| Client variable | Purpose |
| --- | --- |
| `API_BASE_URL` | Server-side Express origin, such as `http://localhost:8000` |
| `WEDPLAN_CONTACT_EMAIL` | Optional public support email for the footer |

Set the server's `CLIENT_URL` to the browser-facing Next.js origin. Use the same local hostname in the browser and OAuth configuration. Keep MongoDB, Better Auth, Google, ImgBB and Stripe credentials on the server. See the [server setup and environment guide](https://github.com/tonmoybiswas07/wedplan_server#wedplan-api).

## Links and submission

- [Client repository](https://github.com/tonmoybiswas07/wedplan_client)
- [Server repository](https://github.com/tonmoybiswas07/wedplan_server)
- Live website link pending deployment and verification.

For deployment, configure the Express origin and support email on the Next.js host, then use its Next.js build and start commands. Check private routes after a hard refresh, Google callback and consent, Stripe Checkout and webhook delivery from the deployed host. Provide the evaluator with the verified live URL and the dedicated Admin credentials through the assignment submission channel.
