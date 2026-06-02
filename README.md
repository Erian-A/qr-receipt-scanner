# QR Receipt Scanner

Scan Brazilian electronic receipts (NFC-e / SAT) by QR code or paste the receipt URL/HTML manually, then extract the line-item data for tracking and analysis.

The app reads the QR code printed on the receipt, fetches the SEFAZ page it points to through a Supabase Edge Function (to bypass CORS), parses the items, and lists them on a Products page. The UI is available in English and Brazilian Portuguese.

## Stack

- Vite + React 18 + TypeScript + Tailwind CSS
- Supabase Edge Function (`receita-parser`) to fetch receipts server-side
- `@yudiel/react-qr-scanner` for camera capture

## Run locally

Requires Node 20+.

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

`.env`:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Deploy the edge function once:

```bash
supabase functions deploy receita-parser
```

## Scripts

| Command            | Purpose                       |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start the Vite dev server     |
| `npm run build`    | Production build to `dist/`   |
| `npm run preview`  | Preview the built bundle      |
| `npm run lint`     | ESLint                        |
| `npm run typecheck`| TypeScript check, no emit     |
