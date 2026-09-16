# QuickClip

A minimal online clipboard for sharing text with short clip codes.

## Frontend demo
Open `index.html` in a browser. This version uses `localStorage`, so clips are available only in the same browser.

## Real cross-device backend
1. Install Node.js.
2. Run `npm install`.
3. Run `npm start`.
4. API starts at `http://localhost:3000`.

### API
- `POST /api/clips` with `{ "text": "hello" }`
- `GET /api/clips/:code`
- `DELETE /api/clips/:code`

For production, replace the in-memory `Map` with a database such as Supabase/Postgres, add rate limiting, expiry/TTL, abuse protection, and HTTPS.
