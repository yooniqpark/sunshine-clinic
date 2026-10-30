# Admin login

The clinic uses the existing Core credentials provider and ADMIN users in its runtime database. Deploying an empty build database must never replace this database. If an existing administrator is missing after moving storage, recover the original user record from a verified backup, including its password hash; do not reset the password or replace the entire current database.

Core limits credentials callbacks to five attempts per IP in fifteen minutes. For Auth.js client requests (`X-Auth-Return-Redirect: 1`), the app proxy converts Core's rate-limit redirect to HTTP 429 JSON with the Auth.js `url` envelope and a `Retry-After` header. The URL contains `error=too-many-attempts` and `code=<seconds>` for the login form. Ordinary form submissions retain Core's redirect behavior.

The app owns its login page and proxy customizations, so they intentionally omit the Core sync generated marker. The form restores its button after failures, reports the remaining wait, and accepts only local admin callback destinations.

After building and starting a local app, verify the real authentication response contract with:

```sh
LOGIN_TEST_ORIGIN=http://127.0.0.1:8097 node scripts/check-admin-login.mjs
```

This check refuses production hosts. It exercises invalid credentials, the sixth attempt's JSON response, the retry interval, and ordinary form fallback without modifying user records.
