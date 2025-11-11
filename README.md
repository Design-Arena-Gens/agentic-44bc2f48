## Lumen — Web Design Lead Generation Agent

Lumen is an autonomous intake specialist tailored for web design teams. It captures and qualifies inbound prospects through a guided conversational flow, validating email, phone, and website details before routing the lead to your dashboard.

### Features
- Conversational lead capture with inline validation and progress tracking
- Dedicated dashboard displaying every captured lead with contact links
- Persistent JSON store (file-based) for simple deployments and demos
- Responsive UI with Tailwind CSS, built to drop into Vercel instantly

### Quick Start
```bash
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to interact with the agent. The dashboard is available at `/dashboard`.

### API
- `POST /api/leads` — Accepts `{ name, email, phone, website, services?, budget? }`, validates input, and stores the lead.
- `GET /api/leads` — Returns all captured leads.

### Deployment
Run a production build before deploying:
```bash
npm run build
npm start
```
To ship to Vercel:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-44bc2f48
```
