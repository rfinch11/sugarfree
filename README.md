# Sugar-Free Family Submission Form

This project contains a simple frontend and an accompanying API endpoint. Users can submit kid-friendly activities which are sent to Airtable and any uploaded photos are stored in Supabase.

## Setup

### Environment variables

Set the following variables before starting the API:

- `AIRTABLE_TOKEN` – your Airtable API token.
- `RECAPTCHA_SECRET` – secret for verifying reCAPTCHA.

The upload script expects `SUPABASE_URL` and `SUPABASE_ANON_KEY` to be
available in the browser environment. Provide them through your build
tool or by defining `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY`
in your page:

```html
<script>
  window.SUPABASE_URL = 'https://your-project.supabase.co';
  window.SUPABASE_ANON_KEY = 'public-anon-key';
</script>
```

### Running the frontend

Serve the `public/` directory with any static file server, for example:

```
npx serve public
```

This hosts `index.html` which loads the form scripts.

The form includes a reCAPTCHA widget using the site key `6LeJTHIrAAAAANJXinmmjlQ__RdHmph6_pCo4H4u`. If you have your own site key, update the `data-sitekey` attribute in `public/index.html` accordingly. Register your domain in the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) to generate a key.

### Running the API

The API handler in `api/submit.js` uses ES module syntax. A minimal
`package.json` in the repository root sets `"type": "module"` so that Node will
load the file correctly. It also uses `micro`'s `json` helper to read the request
body.

You can run the handler locally with a lightweight server such as `micro`:

```
npx micro api/submit.js
```

Node.js 18 or newer is required so that the built-in `fetch` API used in
`api/submit.js` is available.

Ensure all environment variables listed above are available to the process.

