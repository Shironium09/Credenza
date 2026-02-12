# Credenza

Credenza Sigma is a web-based automation tool designed to streamline the generation and distribution of personalized certificates. It allows users to upload a template, align text dynamically, and bulk-send completed certificates via email.

Live Demo: https://credenza-sigma.vercel.app/

# Features

    Bulk Generation: Imprint names from a CSV file directly onto image templates.

    Live Alignment Panel: Real-time rendering to adjust Y-position, font size, and font styles for perfect text placement.

    CSV Integration: Seamlessly parse recipient data (names and emails) for automated processing.

    Automated Distribution: Integrated mailing system to send generated certificates directly to recipients.


# Tech Stack

## Frontend

    React: For the dynamic UI and alignment preview.

    PapaParse: For client-side CSV parsing.

    Vercel: Frontend hosting.

## Backend

    Node.js & Express: Core server logic and API handling.

    node-canvas: Server-side image manipulation and certificate generation.

    Multer: Middleware for handling file uploads.

    Render: Backend hosting.