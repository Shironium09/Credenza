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

## How to Run Locally

### Prerequisites

- Node.js (v18 or later recommended)
- A Google Cloud project with OAuth 2.0 credentials and the Gmail and Drive APIs enabled
- A Firebase project with Firestore enabled and a service account key

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shironium09/Credenza.git
   cd Credenza
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Create a `server/.env.googleOauth` file for the backend with the following variables:
   ```env
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   SESSION_SECRET=<your-session-secret>
   CLIENT_URL=http://localhost:5173
   BACKEND_URL=http://localhost:3001
   NODE_ENV=development
   FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json-string>
   ```

4. **Start the application:**
   - **Backend:** `cd server && node server.js`
   - **Frontend:** `npm run dev` (in a separate terminal)

The app will be available at `http://localhost:5173`.

---

## How it Works

1. **Sign in** with your Google account on the login page.
2. **Navigate to the dashboard** to view existing events or create a new one.
3. **Upload a certificate template** (image) and a **CSV file** containing `Name` and `Email` columns.
4. **Adjust text placement** using the live alignment panel -- set Y-position, font size, font style, and color.
5. **Generate and send** -- the server renders each certificate with the recipient's name, emails it to them via the Gmail API, and backs up all files to a Google Drive folder.
