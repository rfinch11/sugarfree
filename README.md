# Sugar-Free Family Submission Form

This project contains a simple frontend and an accompanying API endpoint. Users can submit kid-friendly activities which are sent to Airtable and any uploaded photos are stored in Supabase.

## Setup

### Environment variables

Set the following variables before starting the API:

- AIRTABLE_TOKEN – your Airtable API token.
- RECAPTCHA_SECRET – secret for verifying reCAPTCHA.
- SUPABASE_URL – URL of your Supabase instance.
- SUPABASE_ANON_KEY – anon/public key for Supabase.

### Running the frontend

Serve the `public/` directory with any static file server, for example:

```
npx serve public
```

This hosts `index.html` which loads the form scripts. Update `scripts/upload.js` with your Supabase credentials if necessary.

### Running the API

The API handler in `api/submit.js` uses ES module syntax. A minimal
`package.json` in the repository root sets `"type": "module"` so that Node will
load the file correctly.

You can run the handler locally with a lightweight server such as `micro`:

```
npx micro api/submit.js
```

Ensure all environment variables listed above are available to the process.

