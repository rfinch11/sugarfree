# Sugar-Free Family Submission Form

This project contains a simple frontend and an accompanying API endpoint. Users can submit kid-friendly activities which are sent to Airtable and any uploaded photos are stored in Supabase.

## Setup

### Environment variables

Set the following variables before starting the API:

- AIRTABLE_TOKEN – your Airtable API token.
- RECAPTCHA_SECRET – secret for verifying reCAPTCHA.
- SUPABASE_URL – URL of your Supabase instance.
- SUPABASE_ANON_KEY – anon/public key for Supabase.

Expose these same values to the frontend by defining
`window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` in your page:

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

Replace the `YOUR_SITE_KEY` placeholder in `public/index.html` with a real site key from Google reCAPTCHA. Register your domain in the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) to generate a key.

### Running the API

`api/submit.js` exports a Node handler. You can run it locally with a lightweight server such as `micro`:

```
npx micro api/submit.js
```

Ensure all environment variables listed above are available to the process.

