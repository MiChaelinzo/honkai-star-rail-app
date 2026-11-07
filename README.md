# Astral Warp Archive

<img width="1536" height="1024" alt="Astral Warp Archive dashboard preview" src="https://github.com/user-attachments/assets/1ad67817-e069-43cb-8d47-ea841cef4cab" />

**Track every pull. Understand your odds. Plan your next warp.**

Astral Warp Archive is a fan-made gacha companion that brings pull tracking, pity and probability insights, planning tools, and community features together across seven games. It pairs deterministic gacha forecasting with an AI-powered planning assistant and a PayPal Sandbox supporter checkout.

> Built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/).

## Try it

- **Live demo:** [honkai-star-rail-app.vercel.app](https://honkai-star-rail-app.vercel.app/)
- **Hackathon:** [PayPal AI Hackathon on Devpost](https://paypalaihackathon.devpost.com/)

## The idea

Players often track pulls and plan for banners across separate games and tools. Astral Warp Archive offers one place to log banner history, keep an eye on pity and spending, estimate future outcomes, and compare progress with the community.

The app combines explainable, deterministic probability calculations with AI-assisted planning summaries. AI can help players interpret their plans, while the underlying pity and probability calculations remain app logic—not opaque AI-generated odds.

## PayPal + AI

- **PayPal Sandbox checkout:** Supporters can start checkout from the Settings supporter card. The server creates and captures PayPal orders; PayPal secrets are not handled in client-side code.
- **Checkout lifecycle:** The app handles successful and cancelled checkout flows.
- **Supporter verification:** Players can submit a receipt for review; approved supporters can unlock premium planning utilities.
- **AI planning assistance:** Google Cloud Vertex AI / Gemini is used for Warp Advisor-style summaries and planning assistance.
- **Clear separation of responsibilities:** AI assists with summaries and planning; deterministic application logic handles pity, probability, and forecasting.

This checkout integration is configured for **PayPal Sandbox testing**. It is not a live payment service. Configure the appropriate production integration and credentials before accepting real payments.

## Features

### Pull tracking and analytics

- Track pulls by game and banner, with banner-specific history and totals
- Monitor soft pity, hard pity, and limited-banner 50/50 outcomes where applicable
- Review five-star totals, progress over time, and cost-per-five-star insights
- Import and export pull data with game-specific mappings and quick-log workflows

### Planning

- Estimate future outcomes over a selected number of pulls
- Plan banner-saving and spending timelines
- Use supporter utilities: Calculator, Forecast, Todo List, Timeline, and data exports

### Community and supporter tools

- Browse public leaderboards and shareable profiles
- Compare game profiles and luck percentiles
- Submit supporter receipts for admin review
- Review receipts with dedicated admin tools

## Supported games

- Honkai: Star Rail
- Genshin Impact
- Zenless Zone Zero
- Honkai Impact 3rd
- Wuthering Waves
- Arknights
- Arknights: Endfield

## Built with

- **App:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Data:** Amazon DynamoDB using a single-table design
- **File storage:** Vercel Blob
- **AI:** Google Cloud Vertex AI / Gemini
- **Payments:** PayPal Orders API Sandbox
- **Analytics and hosting:** Vercel Analytics and Vercel; Render-ready deployment architecture
- **Developer ecosystem:** Postman and APIMatic context tooling; AG Grid-compatible patterns, with Bryntum-ready planning experiences

## Run locally

### Requirements

- Node.js 20.9 or later
- npm or pnpm
- AWS/DynamoDB configuration and Vercel Blob credentials for the features that need them

### Install and start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and lint

```bash
npm run build
npm run lint
```

## Environment configuration

Create `.env.local` for local development. Configure only the integrations you plan to run. The app may require AWS credentials/region and DynamoDB table configuration, Vercel Blob access, and admin configuration for protected review pages. PayPal Sandbox checkout requires server-side credentials:

```bash
DYNAMODB_TABLE_NAME=your-table-name
AWS_REGION=us-east-1
AWS_ROLE_ARN=your-role-arn
ADMIN_EMAILS=you@example.com
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-client-secret
```

Use the deployment's supported AWS credential method; an IAM role is generally preferable to long-lived credentials. Keep all secrets out of source control. PayPal credentials must remain server-side, and local environment files should never be committed.

## Try the supporter checkout

1. Set `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to PayPal Sandbox credentials in the server environment.
2. Open the Settings supporter card in the app.
3. Start checkout and complete the flow with a Sandbox account.
4. Check the success or cancellation handling in the app.

For receipt-based verification, submit a receipt image or PDF through the supporter flow. An administrator can review the submission; approval unlocks the eligible premium utilities.

## Project layout

```text
app/                 # App routes and pages
components/          # Dashboard, dialogs, analytics, and UI shells
lib/                 # Game definitions, probability logic, auth, database access, and types
public/              # Static assets
next.config.mjs       # Next.js configuration
package.json         # Scripts and dependencies
README.md            # Project overview and setup
```

## Notes

Astral Warp Archive is a fan-made companion tool and is not affiliated with or endorsed by HoYoverse, Hypergryph, or their partners. Game names and assets remain the property of their respective owners.

## License

See [LICENSE](LICENSE) for the project license.
