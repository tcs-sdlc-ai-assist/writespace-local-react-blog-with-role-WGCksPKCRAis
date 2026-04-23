# WriteSpace

A distraction-free writing application built for focus and productivity.

## Tech Stack

- **Framework:** React 18+ with JavaScript (ES6+, JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Storage:** Browser LocalStorage (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm 9+ installed

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Folder Structure

```
writespace/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Editor/          # Writing editor components
│   │   ├── Layout/          # Layout and navigation components
│   │   └── UI/              # Shared UI primitives (buttons, modals, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Route-level page components
│   ├── services/            # Storage and utility services
│   ├── context/             # React context providers
│   ├── utils/               # Helper functions and constants
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # Entry point (renders App)
│   └── index.css            # Global styles and Tailwind directives
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Route Map

| Path               | Page Component   | Description                          |
| ------------------ | ---------------- | ------------------------------------ |
| `/`                | `HomePage`       | Landing / dashboard with document list |
| `/write`           | `WritePage`      | New document editor                  |
| `/write/:id`       | `WritePage`      | Edit existing document               |
| `/settings`        | `SettingsPage`   | User preferences and theme settings  |

## Storage Schema

All data is persisted in the browser's `localStorage`. No server or database is required.

### Documents

**Key:** `writespace_documents`

```json
[
  {
    "id": "uuid-string",
    "title": "Document Title",
    "content": "The full text content of the document...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z",
    "wordCount": 1250
  }
]
```

### Settings

**Key:** `writespace_settings`

```json
{
  "theme": "light",
  "fontFamily": "serif",
  "fontSize": 18,
  "lineHeight": 1.8,
  "autosaveInterval": 5000
}
```

## Deployment (Vercel)

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Git Integration

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel will auto-detect the Vite framework preset.
4. Configure the following build settings (usually auto-detected):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

### SPA Routing

For client-side routing to work on Vercel, add a `vercel.json` file to the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start development server           |
| `npm run build`    | Build for production               |
| `npm run preview`  | Preview production build locally   |
| `npm run lint`     | Run ESLint                         |

## License

Private — All rights reserved.