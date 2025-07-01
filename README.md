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

`api/submit.js` exports a Node handler. You can run it locally with a lightweight server such as `micro`:

```
npx micro api/submit.js
```

Ensure all environment variables listed above are available to the process.

