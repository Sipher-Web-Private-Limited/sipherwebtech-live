# Sipher Web CMS API

Laravel API for the React admin workspace and the public website. It manages site profile/contact details, About text, service categories, services, team members, leadership, blog articles, portfolio projects, and product solutions.

## Requirements

- PHP 8.3 or newer with `ctype`, `fileinfo`, `mbstring`, `openssl`, `pdo_mysql`, and `tokenizer` enabled
- Composer 2
- SQLite for local development, or MySQL 8.0 or newer for deployment

## Local setup

From this directory:

```sh
composer install
copy .env.example .env
php artisan key:generate
```

The example `.env` is configured for the `sipherwebtech` MySQL database at `127.0.0.1:3306`, using the `admin` account. Set `DB_PASSWORD` in your local `.env` to the rotated database password; never commit it. If you prefer SQLite for isolated local development, set `DB_CONNECTION=sqlite` and `DB_DATABASE=database/database.sqlite`, and create the file if it does not exist (PowerShell: `New-Item database/database.sqlite -ItemType File`; macOS/Linux: `touch database/database.sqlite`).

For production, configure `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE=sipherwebtech`, `DB_USERNAME`, and `DB_PASSWORD` in the backend server's environment (or hosting secrets). `DB_HOST` is relative to the server running Laravel; `127.0.0.1` is correct only when MySQL is on that same server. Ensure the MySQL account's allowed host matches the Laravel server. The deploy workflow excludes `.env`, so these settings must be configured on the server.

After confirming the target database and taking a backup if it contains data, run:

```sh
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Before running `migrate --seed`, set `CMS_ADMIN_NAME`, `CMS_ADMIN_EMAIL`, and `CMS_ADMIN_PASSWORD` in the backend `.env`. The admin seeder requires a non-empty password, hashes it before storing it, and creates or updates the administrator for that email. You can use `php artisan cms:make-admin` instead to create an admin interactively. No default credentials are included.

The React admin login is served by the frontend at `/admin/login/auth`; after signing in, the workspace lives at `/admin`. Configure the frontend host to route these client-side paths back to its `index.html`. The Laravel backend exposes session-authenticated admin endpoints under `/api/v1/admin`. Login uses Sanctum's CSRF cookie and session authentication; credentials are not stored in browser local storage.

Set `FRONTEND_URL` to the exact frontend origin (comma-separated for multiple origins) and `SANCTUM_STATEFUL_DOMAINS` to the frontend host and port (without scheme) in the backend `.env`. For example, with the default Vite port, use `http://localhost:8443` and `localhost:8443`. Keep the frontend and API on the same hostname (`localhost`, not a mix of `localhost` and `127.0.0.1`) so the browser can share the session and CSRF cookies. For deployments on different subdomains, configure `SESSION_DOMAIN` for the shared parent domain, use HTTPS, and allow the exact frontend origin.

In the frontend root, copy `.env.example` to `.env.local` and set `VITE_CMS_API_URL=/api/v1` to load content from this backend through the Vite development proxy. Start Laravel on port `8000` and Vite on port `8443`; the proxy normalizes both `Origin` and `Referer` to the configured local frontend host so Sanctum starts a session when the site is opened from a LAN IP. If Laravel runs elsewhere, set `CMS_PROXY_TARGET` to its reachable base URL before starting Vite. Restart Vite after changing either variable. If the API is unavailable, the homepage hero and company profile/footer keep basic built-in defaults; CMS-managed content such as editable services and articles still requires a working API.

To serve the Vite site over trusted HTTPS on a LAN, install `mkcert`, run `mkcert -install`, then generate a certificate for the machine's LAN IP and local hostnames, for example: `mkcert -cert-file local-https-cert.pem -key-file local-https-key.pem 192.168.124.1 localhost 127.0.0.1`. Set `VITE_DEV_HTTPS_CERT=local-https-cert.pem` and `VITE_DEV_HTTPS_KEY=local-https-key.pem` in the frontend `.env.local`, then restart Vite and use `https://192.168.124.1:8443`. Keep the private key untracked. Other devices must also trust the mkcert root CA before browsers will consider the connection secure. If using HTTPS for the frontend's Sanctum session login, update backend `FRONTEND_URL` to `https://localhost:8443` and restart Laravel.

## Public API

Public content endpoints are read-only and expose published content only. The contact enquiry endpoint accepts validated form submissions:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/content` | Combined public profile, service categories, services, and published people |
| `GET` | `/api/v1/site-profile` | Company, contact, maps, social links, and About text |
| `GET` | `/api/v1/service-categories` | Published categories and their published services |
| `GET` | `/api/v1/services/{slug}` | One published service, including its category |
| `GET` | `/api/v1/team-members` | Published team members |
| `GET` | `/api/v1/leadership` | Published leadership profiles |
| `GET` | `/api/v1/content-library/{type}` | Published blog, portfolio, or product items (`type` is `blog`, `portfolio`, or `product`) |
| `GET` | `/api/v1/content-library/{type}/{slug}` | One published library item |
| `POST` | `/api/v1/contact-enquiries` | Submit a contact enquiry (rate limited) |

Enquiry submissions are validated by Laravel, including RFC email validation and an alphanumeric phone value of up to 32 characters. Saved enquiries are visible only to authenticated administrators at `GET /api/v1/admin/contact-enquiries`, in the React admin workspace under **Contact enquiries**. Admin changes become public only after the relevant category, service, person, or content-library item is published. The content-library seeder migrates the existing blog and portfolio examples and product solutions into unpublished drafts; review and replace placeholder text, images, metrics, and client claims in **Admin → Content library** before publishing. Seeders fill missing records without overwriting administrator edits. The React site uses the published API content as its source rather than maintaining a second bundled copy.

Images, including the company logo, browser favicon, and loading-screen image, can be uploaded in the dashboard (stored on Laravel's public disk at `storage/app/public/cms/`, exposed at `public/storage/cms/`) or configured with an externally hosted URL or existing root-relative path where supported. Brand images are managed under **Admin → Company profile**; they are used by the public navigation and footer, browser tab, and loading screen. Run `php artisan storage:link` after deployment to expose uploaded media. Public API responses provide the resulting public image URLs.

Admin routes are client-side React routes in the frontend. The backend does not serve a separate Blade admin UI.

## Verification

Run the backend test suite with:

```sh
php artisan test
```
