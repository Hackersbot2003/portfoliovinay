# EditorialPortfolio — Full Project Documentation

> **AI Context File** — This document describes every layer of the project: stack, file structure, all API routes with request/response formats, all MongoDB schemas, all frontend routes, component responsibilities, auth flow, and env setup. Feed this to any AI to give it complete project understanding.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Backend — Server Setup](#5-backend--server-setup)
6. [Backend — Middleware](#6-backend--middleware)
7. [Backend — MongoDB Models (Schemas)](#7-backend--mongodb-models-schemas)
8. [Backend — API Routes (Full Reference)](#8-backend--api-routes-full-reference)
9. [Frontend — Routing](#9-frontend--routing)
10. [Frontend — Pages](#10-frontend--pages)
11. [Frontend — Components](#11-frontend--components)
12. [Frontend — Auth Context & API Utility](#12-frontend--auth-context--api-utility)
13. [Data Flow Diagrams](#13-data-flow-diagrams)
14. [Auth Flow](#14-auth-flow)
15. [Image Upload Flow](#15-image-upload-flow)
16. [Admin Panel Sections Map](#16-admin-panel-sections-map)

---

## 1. Project Overview

**EditorialPortfolio** (internal name: `LEDGER_OS`) is a full-stack personal portfolio application with:

- A **public-facing portfolio** page (`/`) that displays the developer's profile, experience, projects, achievements, blogs, platforms, and contact info.
- A **protected admin panel** (`/admin/*`) where the owner can CRUD every piece of content.
- A **Node.js/Express REST API** backed by MongoDB, with image uploads to Cloudinary and JWT-based auth.
- A **React + Vite** frontend styled with Tailwind CSS and a custom editorial/ledger design system.

**Version:** 1.0.4  
**Design Theme:** "LEDGER_OS" — brutalist-editorial, black/white/orange/gold palette, JetBrains Mono + Space Grotesk + Cormorant Garamond fonts.

---

## 2. Tech Stack

### Backend
| Concern | Technology |
|---|---|
| Runtime | Node.js (ES Modules, `"type": "module"`) |
| Framework | Express 4.x |
| Database | MongoDB via Mongoose 8.x |
| Auth | JSON Web Tokens (`jsonwebtoken`), bcrypt hashing (`bcryptjs`) |
| File Uploads | Multer (memory storage) → Cloudinary v1 |
| CORS | `cors` package, open by default |
| Config | `dotenv` |
| Dev Server | `nodemon` |

### Frontend
| Concern | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router DOM v6 |
| HTTP Client | Axios (with interceptors for auth token) |
| Styling | Tailwind CSS 3 + custom CSS variables |
| Icons | Lucide React |
| Toast Notifications | react-hot-toast |

---

## 3. Folder Structure

```
portfolio/
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   ├── .gitignore
│   ├── models/
│   │   ├── Achievement.js
│   │   ├── Blog.js
│   │   ├── Category.js
│   │   ├── Experience.js
│   │   ├── Platform.js
│   │   ├── Profile.js
│   │   ├── Project.js
│   │   ├── Tech.js
│   │   └── User.js
│   ├── routes/
│   │   ├── achievements.js
│   │   ├── auth.js
│   │   ├── blogs.js
│   │   ├── experience.js
│   │   ├── platforms.js
│   │   ├── profile.js
│   │   ├── projects.js
│   │   └── tech.js
│   └── middleware/
│       ├── auth.js                # JWT protect middleware
│       └── upload.js              # Multer + Cloudinary upload helpers
│
└── frontend/
    ├── index.html
    ├── vite.config.js             # Proxy /api → http://localhost:5000
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vercel.json
    ├── src/
    │   ├── main.jsx               # React root mount
    │   ├── App.jsx                # Router + AuthProvider + routes
    │   ├── index.css              # Global styles, CSS variables, Tailwind
    │   ├── context/
    │   │   └── AuthContext.jsx    # isAdmin state, login/logout
    │   ├── utils/
    │   │   └── api.js             # Axios instance with auth interceptor
    │   ├── pages/
    │   │   ├── PortfolioPage.jsx  # Public portfolio (/)
    │   │   ├── AdminLogin.jsx     # /admin/login
    │   │   └── AdminDashboard.jsx # /admin/* shell + nested routes
    │   └── components/
    │       ├── portfolio/
    │       │   ├── Sidebar.jsx        # Fixed left sidebar on portfolio page
    │       │   ├── Sections.jsx       # About, Experience, TechStack, Projects, Achievements, Blogs, Resume, Contact sections
    │       │   ├── Platforms.jsx      # Coding platform stats cards
    │       │   └── ProjectModal.jsx   # Project detail modal
    │       └── admin/
    │           ├── AdminOverview.jsx
    │           ├── AdminProfile.jsx
    │           ├── AdminExperience.jsx
    │           ├── AdminAchievements.jsx
    │           ├── AdminProjects.jsx
    │           ├── AdminPlatforms.jsx
    │           ├── AdminBlogs.jsx
    │           ├── AdminTech.jsx
    │           ├── AdminSidebar.jsx
    │           └── FormHelpers.jsx    # Reusable form input components
```

---

## 4. Environment Variables

### Backend (`.env` in `backend/`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend
- No `.env` needed in dev — Vite proxies `/api` to `http://localhost:5000` via `vite.config.js`.
- In production, ensure the backend base URL resolves correctly (Vercel rewrites or same-origin deploy).

---

## 5. Backend — Server Setup

**File:** `backend/server.js`

- Uses DNS override to `8.8.8.8` (Google DNS) for connectivity in some environments.
- Express app with JSON body parser limit of **10MB** (needed for base64 images).
- CORS enabled globally.
- All routes mounted at `/api/<resource>`.
- MongoDB connected via `MONGODB_URI`, then server starts on `PORT` (default 5000).

**Health check endpoint:**
```
GET /api/health → { "status": "OK" }
```

**Route mounts:**
```
/api/auth        → routes/auth.js
/api/profile     → routes/profile.js
/api/projects    → routes/projects.js
/api/experience  → routes/experience.js
/api/achievements → routes/achievements.js
/api/blogs       → routes/blogs.js
/api/platforms   → routes/platforms.js
/api/tech        → routes/tech.js
```

---

## 6. Backend — Middleware

### `middleware/auth.js` — JWT Protect
- Reads `Authorization: Bearer <token>` header.
- Verifies with `JWT_SECRET`.
- Attaches `req.user = { id, email }` on success.
- Returns `401` if token is missing or invalid.
- Applied to all **write** endpoints (POST, PUT, DELETE).

### `middleware/upload.js` — Multer + Cloudinary
- `upload` = Multer instance using **in-memory storage** (no disk writes).
- `uploadToCloudinary(buffer, folder)` — uploads a buffer to Cloudinary under the given folder path, returns the full Cloudinary result object (use `.secure_url`).
- Cloudinary folders used:
  - `portfolio/avatars` — profile avatar
  - `portfolio/icons` — company icons for experience
  - `portfolio/projects` — project photos
  - `portfolio/blogs` — blog cover images

---

## 7. Backend — MongoDB Models (Schemas)

### `User`
```js
{
  email:    String (required, unique),
  password: String (required, bcrypt-hashed on save),
  // methods: matchPassword(entered) → Boolean
}
// timestamps: true
```

### `Profile`
```js
{
  name:            String  (default: 'Your Name'),
  title:           String  (default: 'Full Stack Developer'),
  bio:             String  (default: 'Hey, I am a Software Developer.'),
  location:        String  (default: 'India'),
  email:           String  (default: ''),
  avatar:          String  (Cloudinary URL, default: ''),
  resume:          String  (URL to resume PDF, default: ''),
  institution:     String  (default: ''),
  institutionIcon: String  (Cloudinary URL, default: ''),
  socials: {
    github:       String,
    linkedin:     String,
    leetcode:     String,
    twitter:      String,
    discord:      String,
    codeforces:   String,
    hackerrank:   String,
    hackerearth:  String,
  },
  skills: [
    {
      category: String,
      items: [{ name: String, icon: String }]
    }
  ]
}
// timestamps: true
// Note: Only ONE profile document exists (singleton pattern)
```

### `Experience`
```js
{
  company:     String  (required),
  companyIcon: String  (Cloudinary URL),
  role:        String  (required),
  duration:    String  (e.g. "Jan 2023 – Present"),
  description: String,
  link:        String  (company URL),
  techStack:   [{ name: String, icon: String }],
  points:      [String],   // bullet points of responsibilities
  order:       Number  (for manual sorting, default: 0),
}
// timestamps: true
```

### `Achievement`
```js
{
  title:       String  (required),
  description: String,
  date:        String,
  link:        String,
  icon:        String,   // emoji or icon name
  order:       Number  (default: 0),
}
// timestamps: true
```

### `Project`
```js
{
  title:        String  (required),
  description:  String  (required),
  features:     [String],
  photos:       [String],  // array of Cloudinary URLs (max 5)
  techStack:    [{ name: String, icon: String }],
  deployedLink: String,
  githubLink:   String,
  extraLinks:   [{ label: String, url: String }],
  topic:        String  (maps to a Category, default: 'Other'),
  status:       String  (enum: 'completed' | 'in-progress' | 'archived', default: 'completed'),
  featured:     Boolean (default: false),
  order:        Number  (default: 0),
}
// timestamps: true
```

### `Category`
```js
{
  name:  String  (required, unique),  // project topic/category name
  order: Number  (default: 0),
}
// timestamps: true
// Auto-created via upsert when a project is created/updated with a new topic
```

### `Platform`
```js
{
  name:        String  (required),   // e.g. "LeetCode"
  username:    String  (required),
  url:         String  (required),   // profile URL
  icon:        String,               // icon name or URL
  color:       String  (default: '#6366f1'),
  showHeatmap: Boolean (default: false),
  showStats:   Boolean (default: true),
  order:       Number  (default: 0),
}
// timestamps: true
```

### `Blog`
```js
{
  title:       String  (required),
  description: String,
  topic:       String,
  coverImage:  String  (Cloudinary URL),
  platforms:   [{ name: String, url: String, icon: String }],  // where published
  publishedAt: String  (date string),
  published:   Boolean (default: true),
  order:       Number  (default: 0),
}
// timestamps: true
```

### `Tech`
```js
{
  name: String  (required, unique),  // technology name e.g. "React"
  icon: String,                      // icon URL or class name
}
// timestamps: true
// Acts as a global tech registry used for autocomplete in forms
```

---

## 8. Backend — API Routes (Full Reference)

> 🔒 = requires `Authorization: Bearer <jwt_token>` header  
> 📎 = accepts `multipart/form-data` with file upload  
> All successful responses are `200`/`201` JSON. Errors return `{ "message": "..." }`.

---

### AUTH — `/api/auth`

#### `POST /api/auth/seed`
Bootstraps the admin user from env vars. Safe to call once; idempotent.
- **Body:** none
- **Response:**
  ```json
  { "message": "Admin created!", "email": "admin@example.com" }
  // or
  { "message": "Admin already exists", "email": "admin@example.com" }
  ```

#### `POST /api/auth/login`
- **Body (JSON):**
  ```json
  { "email": "admin@example.com", "password": "yourpassword" }
  ```
- **Response (200):**
  ```json
  { "token": "<jwt>", "email": "admin@example.com" }
  ```
- **Error (401):**
  ```json
  { "message": "Invalid credentials" }
  ```
- Token expires in **7 days**. Store in `localStorage` as key `p_token`.

---

### PROFILE — `/api/profile`

#### `GET /api/profile`
Returns the single profile document. Creates a default one if none exists.
- **Response:**
  ```json
  {
    "_id": "...",
    "name": "John Doe",
    "title": "Full Stack Developer",
    "bio": "...",
    "location": "India",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "resume": "https://...",
    "institution": "MIT",
    "institutionIcon": "https://...",
    "socials": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "leetcode": "", "twitter": "", "discord": "",
      "codeforces": "", "hackerrank": "", "hackerearth": ""
    },
    "skills": [
      {
        "category": "Frontend",
        "items": [{ "name": "React", "icon": "..." }]
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

#### `PUT /api/profile` 🔒
Updates all text fields of the profile (name, title, bio, socials, skills, etc.). Does NOT update avatar here.
- **Body (JSON):** Any subset of the Profile schema fields.
- **Response:** Updated profile document.

#### `POST /api/profile/avatar` 🔒 📎
Uploads a new avatar image to Cloudinary and saves the URL.
- **Body (multipart/form-data):**
  - `image` — image file (JPEG, PNG, etc.)
- **Response:**
  ```json
  { "avatar": "https://res.cloudinary.com/.../avatar.jpg" }
  ```

---

### EXPERIENCE — `/api/experience`

#### `GET /api/experience`
Returns all experience entries sorted by `order` asc, then `createdAt` desc.
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "company": "Acme Corp",
      "companyIcon": "https://res.cloudinary.com/.../icon.png",
      "role": "Software Engineer",
      "duration": "Jan 2022 – Present",
      "description": "Built scalable APIs...",
      "link": "https://acme.com",
      "techStack": [{ "name": "Node.js", "icon": "..." }],
      "points": ["Led backend architecture", "Reduced latency by 40%"],
      "order": 0,
      "createdAt": "...", "updatedAt": "..."
    }
  ]
  ```

#### `POST /api/experience` 🔒 📎
- **Body (multipart/form-data):**
  - `company` (required)
  - `role` (required)
  - `duration`, `description`, `link`, `order`
  - `techStack` — JSON stringified array: `[{ "name": "...", "icon": "..." }]`
  - `points` — JSON stringified array of strings: `["point 1", "point 2"]`
  - `companyIcon` — image file (optional)
- **Response (201):** Created experience object.

#### `PUT /api/experience/:id` 🔒 📎
Same body as POST. Returns updated object.

#### `DELETE /api/experience/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

### ACHIEVEMENTS — `/api/achievements`

#### `GET /api/achievements`
Returns all achievements sorted by `order` asc, `createdAt` desc.
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "title": "1st Place Hackathon",
      "description": "Won national-level hackathon",
      "date": "March 2023",
      "link": "https://...",
      "icon": "🏆",
      "order": 0,
      "createdAt": "...", "updatedAt": "..."
    }
  ]
  ```

#### `POST /api/achievements` 🔒
- **Body (JSON):** `{ title, description, date, link, icon, order }`
- **Response (201):** Created achievement object.

#### `PUT /api/achievements/:id` 🔒
- **Body (JSON):** Any achievement fields.
- **Response:** Updated object.

#### `DELETE /api/achievements/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

### PROJECTS — `/api/projects`

#### `GET /api/projects`
Returns all projects sorted by `order` asc, `createdAt` desc.
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "title": "My SaaS App",
      "description": "A full-stack SaaS platform...",
      "features": ["Auth", "Dashboard", "Billing"],
      "photos": ["https://res.cloudinary.com/.../photo1.jpg"],
      "techStack": [{ "name": "React", "icon": "..." }],
      "deployedLink": "https://myapp.com",
      "githubLink": "https://github.com/.../myapp",
      "extraLinks": [{ "label": "Demo Video", "url": "https://youtube.com/..." }],
      "topic": "Web App",
      "status": "completed",
      "featured": true,
      "order": 0,
      "createdAt": "...", "updatedAt": "..."
    }
  ]
  ```

#### `GET /api/projects/categories`
Returns all project categories sorted by `order`, then `name`.
- **Response:** `[{ "_id": "...", "name": "Web App", "order": 0 }]`

#### `POST /api/projects/categories` 🔒
- **Body (JSON):** `{ "name": "Mobile App", "order": 1 }`
- **Response (201):** Created category object.

#### `DELETE /api/projects/categories/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

#### `POST /api/projects` 🔒 📎
- **Body (multipart/form-data):**
  - `title` (required), `description` (required)
  - `topic`, `status` (`completed` | `in-progress` | `archived`), `featured`, `order`
  - `deployedLink`, `githubLink`
  - `techStack` — JSON string: `[{ "name": "...", "icon": "..." }]`
  - `features` — JSON string: `["Feature 1", "Feature 2"]`
  - `extraLinks` — JSON string: `[{ "label": "...", "url": "..." }]`
  - `photos` — up to **5** image files (field name: `photos`)
- **Response (201):** Created project object.
- **Note:** If `topic` is new, a Category document is auto-upserted.

#### `PUT /api/projects/:id` 🔒 📎
Same body as POST. Returns updated project object.

#### `DELETE /api/projects/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

### PLATFORMS — `/api/platforms`

#### `GET /api/platforms`
Returns all platforms sorted by `order` asc.
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "name": "LeetCode",
      "username": "johndoe",
      "url": "https://leetcode.com/johndoe",
      "icon": "leetcode",
      "color": "#FFA116",
      "showHeatmap": false,
      "showStats": true,
      "order": 0,
      "createdAt": "...", "updatedAt": "..."
    }
  ]
  ```

#### `POST /api/platforms` 🔒
- **Body (JSON):** `{ name, username, url, icon, color, showHeatmap, showStats, order }`
- **Response (201):** Created platform object.

#### `PUT /api/platforms/:id` 🔒
- **Body (JSON):** Any platform fields.

#### `DELETE /api/platforms/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

### BLOGS — `/api/blogs`

#### `GET /api/blogs`
By default returns only **published** blogs (`published: true`), sorted by `order` asc, `createdAt` desc.  
Pass `?all=true` to return all (used by admin).
- **Response:**
  ```json
  [
    {
      "_id": "...",
      "title": "How I Built X",
      "description": "A deep dive into...",
      "topic": "Tutorial",
      "coverImage": "https://res.cloudinary.com/.../cover.jpg",
      "platforms": [
        { "name": "Medium", "url": "https://medium.com/...", "icon": "medium" }
      ],
      "publishedAt": "April 2024",
      "published": true,
      "order": 0,
      "createdAt": "...", "updatedAt": "..."
    }
  ]
  ```

#### `POST /api/blogs` 🔒 📎
- **Body (multipart/form-data):**
  - `title` (required)
  - `description`, `topic`, `publishedAt`, `published`, `order`
  - `platforms` — JSON string: `[{ "name": "...", "url": "...", "icon": "..." }]`
  - `coverImage` — image file (optional)
- **Response (201):** Created blog object.

#### `PUT /api/blogs/:id` 🔒 📎
Same body as POST. Returns updated blog.

#### `DELETE /api/blogs/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

### TECH REGISTRY — `/api/tech`

#### `GET /api/tech`
Returns all tech entries sorted alphabetically by name.
- **Response:**
  ```json
  [{ "_id": "...", "name": "React", "icon": "https://..." }]
  ```

#### `POST /api/tech` 🔒
Upserts by name (no duplicate tech names).
- **Body (JSON):** `{ "name": "TypeScript", "icon": "https://..." }`
- **Response:** Created or updated tech object.

#### `PUT /api/tech/:id` 🔒
- **Body (JSON):** `{ "name": "...", "icon": "..." }`

#### `DELETE /api/tech/:id` 🔒
- **Response:** `{ "message": "Deleted" }`

---

## 9. Frontend — Routing

### Top-Level Routes (`App.jsx`)

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `PortfolioPage` | No | Public portfolio |
| `/admin/login` | `AdminLogin` | No | Login form |
| `/admin/*` | `AdminDashboard` (via `<Protected>`) | Yes → redirects to `/admin/login` | Admin panel shell |

### Admin Nested Routes (`AdminDashboard.jsx`)
The `/admin/*` route uses nested `<Routes>` inside `AdminDashboard`.

| Sub-path | Full path | Component |
|---|---|---|
| (index) | `/admin` | `AdminOverview` |
| `profile` | `/admin/profile` | `AdminProfile` |
| `experience` | `/admin/experience` | `AdminExperience` |
| `achievements` | `/admin/achievements` | `AdminAchievements` |
| `projects` | `/admin/projects` | `AdminProjects` |
| `platforms` | `/admin/platforms` | `AdminPlatforms` |
| `blogs` | `/admin/blogs` | `AdminBlogs` |
| `tech` | `/admin/tech` | `AdminTech` |

### Route Protection
`<Protected>` component in `App.jsx`:
- Reads `isAdmin` from `AuthContext` (truthy if a JWT token exists in `localStorage`).
- If not admin → `<Navigate to="/admin/login" replace />`.

---

## 10. Frontend — Pages

### `PortfolioPage.jsx` (`/`)
- On mount, fires **6 parallel API calls** via `Promise.allSettled`:
  - `GET /api/profile`
  - `GET /api/experience`
  - `GET /api/achievements`
  - `GET /api/projects`
  - `GET /api/platforms`
  - `GET /api/blogs`
- Shows a spinner (`LEDGER_OS` branded) until all settle.
- Renders layout: `<Sidebar>` (fixed left) + `<main>` with all section components.
- Mobile: shows a topbar with hamburger button to open sidebar.
- Sections rendered in order: About → Experience → TechStack → Projects → Achievements → Platforms → Blogs → Resume → Contact.

### `AdminLogin.jsx` (`/admin/login`)
- Email + password form.
- Calls `AuthContext.login(email, password)` → `POST /api/auth/login`.
- On success: toast "AUTH_SUCCESS", navigate to `/admin`.
- On fail: toast "AUTH_FAILED // INVALID_CREDENTIALS".
- Link to `← EXIT` goes back to `/`.

### `AdminDashboard.jsx` (`/admin/*`)
- Fixed top header bar with LEDGER_OS branding and green "ONLINE" indicator.
- Responsive sidebar: always visible on `md+`, slide-in drawer on mobile.
- Sidebar nav links with Lucide icons for each section.
- Bottom nav has "VIEW_PORTFOLIO" (opens `/` in new tab) and LOGOUT button.
- Logout calls `AuthContext.logout()` then navigates to `/admin/login`.

---

## 11. Frontend — Components

### Portfolio Components (`src/components/portfolio/`)

#### `Sidebar.jsx`
- Fixed left panel (desktop), slide-in on mobile.
- Displays: avatar, name, title, location, institution, bio.
- Social links from `profile.socials`.
- Smooth-scroll navigation links to portfolio sections.

#### `Sections.jsx`
Exports multiple named section components:

| Export | Content |
|---|---|
| `About` | Hero intro, name, title, bio, location. |
| `Experience` | Timeline of work experience with company, role, duration, tech tags, bullet points. |
| `TechStack` | Categorized skills grid from `profile.skills`. |
| `Projects` | Filterable project cards by topic/category. Clicking a project opens `<ProjectModal>`. |
| `Achievements` | Cards with icon, title, description, date, link. |
| `Blogs` | Blog cards with cover image, title, description, platform links. |
| `Resume` | Resume download/view button from `profile.resume` URL. |
| `Contact` | Email and social links for contact. |

#### `Platforms.jsx`
- Renders coding platform stats (LeetCode, Codeforces, HackerRank, etc.).
- Uses `platform.url` / `platform.username` to show stats.
- Conditionally shows heatmap if `showHeatmap === true`.

#### `ProjectModal.jsx`
- Full-screen overlay modal.
- Shows: photo carousel, title, description, features list, tech stack badges, deployed/GitHub/extra links.

### Admin Components (`src/components/admin/`)

#### `AdminOverview.jsx`
- Dashboard overview: counts of projects, experience entries, achievements, blogs.
- Quick-link cards to each admin section.

#### `AdminProfile.jsx`
- Form to edit all profile fields.
- Separate avatar upload section.
- Skills editor with category grouping and add/remove items.
- Social links section.

#### `AdminExperience.jsx`
- List of experience entries with edit/delete.
- Form with company icon upload, tech stack multi-select, bullet point editor.

#### `AdminAchievements.jsx`
- List + form for achievements.
- Fields: title, description, date, link, icon (emoji input).

#### `AdminProjects.jsx`
- Most complex admin component.
- Category manager (add/delete categories).
- Project list with cards showing status badge and featured flag.
- Full project form: multi-photo upload (up to 5), tech stack from tech registry, features list, extra links.

#### `AdminPlatforms.jsx`
- Manage coding platform profiles.
- Form fields: name, username, URL, icon, color picker, showHeatmap toggle, showStats toggle, order.

#### `AdminBlogs.jsx`
- Blog post manager with cover image upload.
- Multi-platform entry (where the blog is published: Medium, Dev.to, etc.).
- Published/draft toggle.

#### `AdminTech.jsx`
- Global tech registry manager.
- Simple name + icon (URL) entries used for autocomplete in Experience and Projects forms.

#### `FormHelpers.jsx`
- Reusable form primitives used across admin components.
- Likely includes: `LedgerInput`, `LedgerTextarea`, `LedgerSelect`, icon pickers, drag-sort helpers.

---

## 12. Frontend — Auth Context & API Utility

### `AuthContext.jsx`

```jsx
// Context value shape:
{
  token: string | null,       // JWT from localStorage('p_token')
  isAdmin: boolean,           // !!token
  login: async (email, password) => data,   // calls POST /api/auth/login
  logout: () => void          // removes p_token, sets token null
}
```

Token is persisted in `localStorage` with key `p_token`.

### `utils/api.js`

Axios instance with:
- `baseURL: '/api'` (Vite proxies to `http://localhost:5000` in dev).
- **Request interceptor:** attaches `Authorization: Bearer <p_token>` if token exists.
- **Response interceptor:** on 401, clears `p_token` and redirects to `/admin/login` if on an admin page.

Usage:
```js
import api from '../utils/api';
api.get('/profile')
api.post('/auth/login', { email, password })
api.put('/projects/:id', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
```

---

## 13. Data Flow Diagrams

### Public Portfolio Load
```
Browser → GET /          → React serves PortfolioPage
PortfolioPage → Promise.allSettled([
  GET /api/profile,
  GET /api/experience,
  GET /api/achievements,
  GET /api/projects,
  GET /api/platforms,
  GET /api/blogs
]) → MongoDB queries → JSON responses → React state → Render
```

### Admin Edit Flow
```
Admin fills form → submit handler
  → api.put('/experience/:id', formData)     [multipart if has file]
      → Axios adds Authorization header
      → Express route → protect middleware checks JWT
      → If file: multer buffers it → uploadToCloudinary()
      → Mongoose findByIdAndUpdate()
      → Returns updated document
  → toast.success() + local state update
```

---

## 14. Auth Flow

```
1. Admin visits /admin/* (not /admin/login)
2. <Protected> checks AuthContext.isAdmin
3. If no token → redirect to /admin/login

4. Admin submits login form
5. POST /api/auth/login { email, password }
6. Server: User.findOne({ email }) → bcrypt.compare(password, hash)
7. If match: jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' })
8. Response: { token, email }
9. Frontend: localStorage.setItem('p_token', token)
10. AuthContext.setToken(token) → isAdmin = true
11. Navigate to /admin

12. All subsequent admin API calls include:
    Authorization: Bearer <token>

13. Server's protect middleware:
    jwt.verify(token, JWT_SECRET) → req.user = { id, email }
    → next()

14. Logout: localStorage.removeItem('p_token') → isAdmin = false → /admin/login
```

---

## 15. Image Upload Flow

```
1. User selects file in admin form
2. FormData built with file appended
3. api.post/put with multipart/form-data Content-Type
4. Express: upload.single('fieldName') or upload.array('photos', 5)
   → Multer stores file in memory (req.file.buffer or req.files[].buffer)
5. uploadToCloudinary(buffer, 'portfolio/<folder>')
   → cloudinary.uploader.upload_stream()
   → Returns { secure_url, public_id, ... }
6. secure_url saved to MongoDB document field
7. URL returned in API response
8. Frontend updates state with new Cloudinary URL
```

**Cloudinary folder structure:**
```
portfolio/
  avatars/    ← profile photos
  icons/      ← company icons (experience)
  projects/   ← project screenshots
  blogs/      ← blog cover images
```

---

## 16. Admin Panel Sections Map

| Nav Label | Route | API Endpoints Used | Model |
|---|---|---|---|
| OVERVIEW | `/admin` | GET all (counts) | All |
| PROFILE | `/admin/profile` | GET/PUT `/api/profile`, POST `/api/profile/avatar` | Profile |
| EXPERIENCE | `/admin/experience` | GET/POST/PUT/DELETE `/api/experience` | Experience |
| ACHIEVEMENTS | `/admin/achievements` | GET/POST/PUT/DELETE `/api/achievements` | Achievement |
| PROJECTS | `/admin/projects` | GET/POST/PUT/DELETE `/api/projects`, GET/POST/DELETE `/api/projects/categories` | Project, Category |
| PLATFORMS | `/admin/platforms` | GET/POST/PUT/DELETE `/api/platforms` | Platform |
| BLOGS | `/admin/blogs` | GET(`?all=true`)/POST/PUT/DELETE `/api/blogs` | Blog |
| TECH_REGISTRY | `/admin/tech` | GET/POST/PUT/DELETE `/api/tech` | Tech |

---

## Appendix — Common Patterns

### JSON fields in multipart forms
When submitting array/object fields via `multipart/form-data`, they must be JSON-stringified on the client and parsed on the server:
```js
// Client
formData.append('techStack', JSON.stringify([{ name: 'React', icon: '...' }]));

// Server (handled automatically in routes)
if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
```

### Sorting convention
All list endpoints return data sorted by `order` (ascending) first, then `createdAt` (descending). This means items with lower `order` values appear first; ties are broken by newest-first.

### Singleton Profile
There is only ever **one** Profile document. The GET endpoint auto-creates a default one if none exists. The PUT endpoint finds the first document and merges fields. There is no profile ID in the URL.

### Tech upsert
`POST /api/tech` uses `findOneAndUpdate` with `{ upsert: true }` matching on `name`, so submitting the same tech name twice is safe — it updates rather than creates a duplicate.

### Category auto-creation
When creating or updating a project, if the `topic` field contains a new category name, it is automatically upserted into the `Category` collection. This keeps categories in sync without requiring manual category pre-creation.