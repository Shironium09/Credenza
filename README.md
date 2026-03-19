# CURRENTLY UNDER REFACTORING !!!

# Credenza

Credenza is a web-based certificate automation tool that streamlines the generation and distribution of personalized certificates. Upload a template, align text dynamically with a live preview, import recipient data from a CSV file, and bulk-send completed certificates via email -- all from a single dashboard.

**Live Demo:** [credenza-sigma.vercel.app](https://credenza-sigma.vercel.app/)

---

## Features

- **Bulk Certificate Generation** -- Imprint names from a CSV file directly onto image templates using server-side rendering.
- **Live Alignment Panel** -- Real-time preview to adjust vertical position, font size, font style, and font color for precise text placement.
- **CSV Integration** -- Parse recipient data (names and email addresses) for automated, hands-off processing.
- **Automated Email Distribution** -- Send generated certificates directly to each recipient through the Gmail API, using the sender's own Google account.
- **Google Drive Backup** -- Automatically create a dedicated folder in Google Drive and upload all generated certificates for archival.
- **Event Management** -- Create, view, and delete events from the dashboard with full Firestore persistence.
- **Google OAuth Authentication** -- Secure sign-in via Google, with session management and token refresh support.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI and live alignment preview |
| React Router | Client-side routing across landing, login, dashboard, and event pages |
| Tailwind CSS 4 | Utility-first styling |
| PapaParse | Client-side CSV parsing |
| Vite | Dev server and production bundler |
| Vercel | Frontend hosting and deployment |

### Backend

| Technology | Purpose |
|---|---|
| Node.js / Express 5 | Core server logic, REST API, and session handling |
| node-canvas | Server-side image manipulation and certificate rendering |
| Multer | Middleware for handling template and CSV file uploads |
| Passport.js | Google OAuth 2.0 authentication strategy |
| Firebase Admin SDK | Firestore database for users, events, and tokens |
| Gmail API (googleapis) | Sending certificates as email attachments via the user's account |
| Google Drive API | Creating folders and uploading certificate images |
| Nodemailer | Composing MIME-compliant email messages |
| Render | Backend hosting |

---

## Project Structure

```
Credenza/
├── src/
│   ├── App.jsx                  # Root component with route definitions
│   ├── main.jsx                 # Application entry point
│   ├── index.css                # Global styles
│   ├── landing_page/            # Public landing page
│   ├── login_page/              # Google OAuth login UI
│   ├── dashboard_page/          # Authenticated dashboard and event list
│   └── add_event_page/          # Certificate generation and alignment UI
├── server/
│   ├── server.js                # Express API, OAuth, generation, and mailing logic
│   └── package.json             # Server dependencies
├── index.html                   # Vite HTML entry point
├── vite.config.js               # Vite configuration
├── vercel.json                  # Vercel deployment settings
└── package.json                 # Frontend dependencies and scripts
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- A Google Cloud project with OAuth 2.0 credentials and the Gmail and Drive APIs enabled
- A Firebase project with Firestore enabled and a service account key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shironium09/Credenza.git
   cd Credenza
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Install server dependencies:

   ```bash
   cd server
   npm install
   cd ..
   ```

### Environment Variables

Create a `.env` file in the project root for the frontend (if needed), and a `server/.env.googleOauth` file for the backend with the following variables:

```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
SESSION_SECRET=<your-session-secret>
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json-string>
```

### Running Locally

Start the backend server:

```bash
cd server
npm start
```

In a separate terminal, start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## How It Works

1. **Sign in** with your Google account on the login page.
2. **Navigate to the dashboard** to view existing events or create a new one.
3. **Upload a certificate template** (image) and a **CSV file** containing `Name` and `Email` columns.
4. **Adjust text placement** using the live alignment panel -- set Y-position, font size, font style, and color.
5. **Generate and send** -- the server renders each certificate with the recipient's name, emails it to them via the Gmail API, and backs up all files to a Google Drive folder.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/auth/google` | Initiates Google OAuth sign-in |
| GET | `/auth/google/callback` | OAuth callback handler |
| GET | `/auth/logout` | Destroys session and logs out |
| GET | `/api/me` | Returns the authenticated user's profile |
| GET | `/api/events` | Lists all events for the authenticated user |
| POST | `/api/events` | Creates a new event |
| POST | `/api/generate` | Accepts template and CSV uploads, generates certificates, emails them, and uploads to Drive |
| DELETE | `/api/events/:id` | Deletes an event by ID |

---

## License

This project is provided as-is for educational purposes.