/**
 * One-time script to obtain a Google Calendar refresh token.
 *
 * Usage:
 *   node scripts/get-google-refresh-token.js
 *
 * Prerequisites:
 *   1. CALENDAR_GOOGLE_CLIENT_ID and CALENDAR_GOOGLE_CLIENT_SECRET must be set in .env
 *   2. In Google Cloud Console → your OAuth app → Authorized redirect URIs,
 *      add exactly:  http://localhost
 *
 * The script will print an auth URL. Open it, approve access, then copy the
 * `code` value from the redirect URL (the browser will show an error page —
 * that's expected) and paste it back into the terminal.
 */

const https = require('https')
const readline = require('readline')
const path = require('path')

// ── Load .env manually (no dotenv dependency needed) ─────────────────────────
const fs = require('fs')
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) {
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '')
        if (!process.env[key.trim()]) process.env[key.trim()] = val
      }
    })
}

const CLIENT_ID = process.env.CALENDAR_GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.CALENDAR_GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost'
const SCOPE = 'https://www.googleapis.com/auth/calendar'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\n❌  CALENDAR_GOOGLE_CLIENT_ID or CALENDAR_GOOGLE_CLIENT_SECRET not found in .env\n'
  )
  process.exit(1)
}

// ── Build the authorisation URL ───────────────────────────────────────────────
const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // forces refresh_token to be returned every time
  }).toString()

console.log('\n─────────────────────────────────────────────────────────')
console.log('  Google Calendar — Refresh Token Setup')
console.log('─────────────────────────────────────────────────────────')
console.log('\n1. Open this URL in your browser:\n')
console.log('  ' + authUrl)
console.log(
  '\n2. Sign in and approve access.\n' +
  '   Your browser will redirect to http://localhost and show an error — that\'s fine.\n'
)
console.log(
  '3. Copy the full redirect URL from your browser\'s address bar.\n' +
  '   It will look like:  http://localhost/?code=4/0AX...&scope=...\n'
)

// ── Prompt for the redirect URL ───────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question('Paste the full redirect URL here: ', (redirectUrl) => {
  rl.close()

  let code
  try {
    code = new URL(redirectUrl).searchParams.get('code')
  } catch {
    console.error('\n❌  Could not parse that URL. Make sure you pasted the full address bar URL.\n')
    process.exit(1)
  }

  if (!code) {
    console.error('\n❌  No "code" parameter found in the URL.\n')
    process.exit(1)
  }

  // ── Exchange code for tokens ────────────────────────────────────────────────
  const body = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  }).toString()

  const options = {
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  }

  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => (data += chunk))
    res.on('end', () => {
      let tokens
      try {
        tokens = JSON.parse(data)
      } catch {
        console.error('\n❌  Failed to parse response from Google:\n', data)
        process.exit(1)
      }

      if (tokens.error) {
        console.error('\n❌  Google returned an error:', tokens.error, tokens.error_description)
        process.exit(1)
      }

      if (!tokens.refresh_token) {
        console.error(
          '\n⚠️   No refresh_token in the response. This usually means the app was already ' +
          'authorised without "prompt=consent". Revoke access at ' +
          'https://myaccount.google.com/permissions and run this script again.\n'
        )
        process.exit(1)
      }

      console.log('\n─────────────────────────────────────────────────────────')
      console.log('  ✅  Success! Add this to your .env:')
      console.log('─────────────────────────────────────────────────────────')
      console.log(`\nCALENDAR_GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
    })
  })

  req.on('error', (err) => {
    console.error('\n❌  Request failed:', err.message)
    process.exit(1)
  })

  req.write(body)
  req.end()
})
