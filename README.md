
# A Pure Git-based CMS

A modern blog system built with Next.js 13+ App Router, featuring integrated CMS functionality.

## Live Demo

Visit [MythBytes](https://mythbytes.com) for a live preview.


## Key Features 
- ⭐ Deployable on platforms like Netlify and Vercel
- ⭐ Full backend management through GitHub Repository
  - `main` branch for functionality
  - `content` branch for content management
- ⭐ Supports Markdown article writing and management
- ⭐ Resource management for images
- ⭐ Cache management capabilities


## Tech Stack

### Core Framework
- Next.js 13+ (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Content Management
- Contentlayer - MDX content handling
- next-auth - Authentication
- lucide-react - Icon library

### Deployment & Development
- Netlify - App deployment
- ESLint - Code linting
- Prettier - Code formatting

## Features

- 📝 Markdown/MDX article support
- 🔐 Admin authentication with next-auth
- 📊 Integrated CMS management system
- 🎨 Responsive design
- 🌓 Dark theme support
- 🖼️ Resource management
- 💾 Cache management
- 🚀 Auto deployment

## Getting Started

### Setting up the Development Environment

1. Clone the project
    ```bash
    git clone [repository-url]
    cd [project-name]
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Configure environment variables
   Create a `.env.local` file:
   (Refer to `.env.example` for guidance)
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_EMAIL=your-admin-email
   ADMIN_PASSWORD=your-admin-password
   GITHUB_TOKEN=github-token
   GITHUB_OWNER=github-owner
   GITHUB_REPO=your-content-repo
   NEXT_PUBLIC_ENABLE_CACHE=true
   ```

4. Start the development server
    ```bash
    npm run dev
    ```

## Project Structure

```
.
├── app/                    # Next.js 13 App Router directory
│   ├── admin/              # Admin dashboard
│   │   ├── assets/         # Resource management module
│   │   ├── cache/          # Cache management module
│   │   └── posts/          # Article management module
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API
│   │   ├── auth/           # Authentication API
│   │   └── upload/         # Upload API
│   └── page.tsx            # Blog homepage
├── components/             # React components
│   ├── common/             # Common components
│   ├── editor/             # Editor components
│   └── layout/             # Layout components
├── lib/                    # Utility library
│   ├── services/           # Service layer
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── styles/                 # Stylesheets
```

## Main Functionalities

### Article Management
- Markdown/MDX format support
- Article categorization (multi-theme support)
- Draft saving
- Publish/unpublish articles
- Category-based browsing
- Pagination for article list

### Resource Management
- Image upload support
- Resource list viewing
- Resource deletion

### Cache Management
- View system cache
- Cache clearing

## Netlify Deployment

1. Build configuration
    ```toml
    [build]
      command = "npm run build"
      publish = ".next"
    ```

2. Environment variable setup
   Configure the following environment variables in the Netlify dashboard:
   - NEXTAUTH_SECRET for authentication secret
   - NEXTAUTH_URL for authentication URL
   - ADMIN_EMAIL for admin username
   - ADMIN_PASSWORD for admin password
   - GITHUB_TOKEN for GitHub token
   - GITHUB_OWNER for GitHub username
   - GITHUB_REPO for GitHub content repository name
   - NEXT_PUBLIC_ENABLE_CACHE to enable server cache

## Development Notes

### Style Theme
- Built with Tailwind CSS
- Amber as the theme color
- Slate as the background color scheme

### Component Development
- Based on React functional components
- Uses TypeScript for type checking
- Follows React Hooks best practices

### API Routing
- Powered by Next.js API Routes
- RESTful design
- Unified error handling

## License

Apache License 2.0

--- 

This format provides clear sections, detailed instructions, and a professional tone suitable for GitHub. Let me know if you'd like any further adjustments!