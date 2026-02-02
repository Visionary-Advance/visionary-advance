Checklist for Claude Code (OAuth + Supabase wiring)
0) Assumptions / env vars

 Add env vars (Vercel + local .env.local):

 GOOGLE_OAUTH_CLIENT_ID=...

 GOOGLE_OAUTH_CLIENT_SECRET=...

 GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/api/auth/google/callback (local)

 NEXT_PUBLIC_SUPABASE_URL=...

 NEXT_PUBLIC_SUPABASE_ANON_KEY=...

 SUPABASE_SERVICE_ROLE_KEY=... (server-only)

 APP_BASE_URL=http://localhost:3000 and prod equivalent

Rules

Use SUPABASE_SERVICE_ROLE_KEY only in server routes (never shipped to browser).

1) Install packages

 Install dependencies:

 googleapis

 @supabase/supabase-js

2) Create Supabase clients (server + browser)

Create file: lib/db/supabaseServer.ts

 Export a Supabase client initialized with SUPABASE_SERVICE_ROLE_KEY for server-side writes.

Create file: lib/db/supabaseBrowser.ts

 Export a Supabase client with NEXT_PUBLIC_SUPABASE_ANON_KEY for dashboard reads/writes as you (authenticated).

3) Add DB helper functions (TypeScript)

Create file: lib/db/queries/oauth.ts

 upsertGoogleOAuthForClient({ clientId, googleUserId, email, displayName, accessToken, refreshToken, scope, expiresAt })

Upsert into oauth_google_accounts using client_id

Only overwrite refresh_token if the new one is non-null (to avoid losing it)

 getGoogleOAuthForClient(clientId) (server-side use later)

 markOAuthRevoked(clientId)

Create file: lib/db/queries/clients.ts

 getClient(clientId)

 listClients()

 updateClient(clientId, patch)

4) Build OAuth URL generator

Create file: lib/google/oauth.ts

 Create a function getOAuthClient() using google.auth.OAuth2

 Create getGoogleAuthUrl(clientId: string):

scopes: ['https://www.googleapis.com/auth/webmasters.readonly']

include:

access_type: 'offline'

prompt: 'consent'

include_granted_scopes: true

state: signed payload containing clientId (see next step)

5) Add state signing/verification (prevents tampering)

Create file: lib/security/state.ts

 Add STATE_SECRET env var

 Implement:

signState({ clientId, ts }) -> string (HMAC SHA256)

verifyState(state) -> { clientId } | null

 Expire states older than e.g. 10 minutes

6) Create the “start OAuth” route

Create route: app/api/auth/google/start/route.ts

 Require Supabase auth session (you are logged in)

 Read clientId from querystring

 Generate auth URL with signed state

 Redirect to Google auth URL

7) Create the callback route

Create route: app/api/auth/google/callback/route.ts

 Read code and state

 Verify state and extract clientId

 Exchange code for tokens via oauth2Client.getToken(code)

 Capture:

access_token

refresh_token (may be null)

scope

expiry_date → convert to ISO timestamptz (expires_at)

 Fetch Google profile info (optional but helpful):

Either decode id_token (basic), or call oauth2.userinfo.get

Store google_user_id, email, display_name

 Upsert into oauth_google_accounts for that clientId

Ensure refresh_token logic: only replace if non-null

 Redirect back to dashboard client page with success toast param:

/dashboard/clients/{clientId}?connected=1

8) Add “connection status” to dashboard

Add UI to client detail page

 Query oauth_google_accounts by client_id

 Show:

Connected (email + last refreshed)

Not connected (button “Connect Google Search Console”)

 Button hits /api/auth/google/start?clientId=...

9) Add “disconnect” (optional but recommended)

Create route: app/api/auth/google/disconnect/route.ts

 Mark revoked=true + null out access_token (keep refresh_token if you want)

 Dashboard button “Disconnect”

10) Smoke tests

 Local: connect client → row appears in oauth_google_accounts

 Refresh token present (first time should be, with prompt=consent)

 Reconnect does not erase refresh token if new one not returned

 Dashboard shows “Connected” state correctly

Notes Claude Code should follow

Never expose service role key to client

Use server Supabase client for writing tokens

Validate clientId belongs to current auth.uid() before writing

Protect routes behind auth