# License Plate Recognition (LPR) Frontend

A modern web application for license plate recognition and vehicle information management built with Next.js, React, and TypeScript.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Development Guidelines](#development-guidelines)
- [Component Documentation](#component-documentation)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This is the frontend application for the License Plate Recognition (LPR-KNN) system. It provides:

- **Real-time plate detection** via camera or image uploads
- **Vehicle information lookup** and management
- **Scan history tracking** with detailed records
- **Vehicle status management** (Clear, Flagged, Expired, Unregistered)
- **Officer-based scan logging** for accountability

The application connects to a backend API (running on `http://localhost:4000`) to retrieve vehicle data and manage scan records.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with built-in routing and optimization
- **Language**: [TypeScript 5.5](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [@heroui/react 2.8](https://www.heroui.org/) - Premium React UI components
- **Styling**: [Tailwind CSS 4.2](https://tailwindcss.com/) - Utility-first CSS framework
- **Runtime**: Node.js with React 18.3

### Development Tools

- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page with sidebar layout
│   │   ├── layout.tsx       # Dashboard layout wrapper
│   │   └── page.tsx         # Dashboard main page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/landing page
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── UploadCard.tsx   # File upload component
│   │   ├── DetectionResult.tsx  # Result display component
│   │   ├── RecentScan.tsx   # Recent scans list component
│   │   └── VehicleInfo.tsx  # Vehicle information display
│   │
│   └── layout/              # Layout components
│       └── Sidebar.tsx      # Navigation sidebar
│
├── lib/                     # Utility functions and helpers
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
└── .env.local.example       # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or higher
- **npm** or **yarn** package manager
- Backend API running on `http://localhost:4000`

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This command will automatically install:
   - **Tailwind CSS 4.2** - CSS framework
   - **HeroUI 2.8** - React component library
   - **React & Next.js** - Core frameworks
   - All other required dependencies

3. **Configure Tailwind CSS (if needed):**
   
   Tailwind CSS is already configured in the project. The configuration files are:
   - `tailwind.config.js` - Tailwind settings
   - `postcss.config.mjs` - PostCSS processing
   
   Key Tailwind settings already in place:
   - Content paths configured for scanning `.tsx` files
   - Utility classes enabled
   - Dark mode support
   
4. **Configure HeroUI (if needed):**
   
   HeroUI is already integrated and ready to use. Import components like:
   ```tsx
   import { Card, CardBody } from "@heroui/card";
   import { Button } from "@heroui/button";
   import { Input } from "@heroui/input";
   ```

5. **Create environment configuration:**
   ```bash
   cp .env.local.example .env.local
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📜 Available Scripts

### `npm run dev`
Starts the Next.js development server with hot-reload enabled.
- **Port**: `http://localhost:3000`
- **Hot Reload**: Enabled (changes auto-refresh)

### `npm run build`
Creates an optimized production build.
```bash
npm run build
```
This generates `.next` folder with optimized assets.

### `npm start`
Starts the production server (requires `npm run build` first).
```bash
npm run build && npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep sensitive keys server-side only.

### Next.js Configuration

Key settings in `next.config.mjs`:
- Optimized images
- API routes
- Static generation

### TypeScript Configuration

The project uses strict TypeScript mode (`tsconfig.json`):
- `strict: true` - Enforces strict type checking
- Path aliases: `@/*` maps to the root directory
- Module resolution: `bundler` for modern bundling

## 🎨 Tailwind CSS & HeroUI Setup

### Tailwind CSS

Tailwind CSS is a utility-first CSS framework that's already configured in the project.

**Using Tailwind Classes**:

```tsx
// Apply utility classes directly to elements
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-lg font-bold text-blue-600">Title</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
    Action
  </button>
</div>
```

**Common Tailwind Classes Used**:
- Layout: `flex`, `grid`, `p-*`, `m-*`, `gap-*`
- Typography: `text-*`, `font-*`, `text-center`
- Colors: `bg-*`, `text-*`, `border-*`
- Effects: `shadow`, `rounded`, `opacity-*`
- Responsive: `md:`, `lg:`, `sm:` prefixes

**Configuration Files**:
- `tailwind.config.js` - Tailwind settings (theme, plugins)
- `postcss.config.mjs` - PostCSS processing (required by Tailwind)
- `globals.css` - Global styles with Tailwind directives

### HeroUI Components

HeroUI provides pre-built, accessible React components styled with Tailwind CSS.

**Installation**: Already included in `package.json`

**Common HeroUI Components Used**:

```tsx
// Card Component
import { Card, CardBody } from "@heroui/card";
<Card className="gap-4">
  <CardBody>Content here</CardBody>
</Card>

// Button Component
import { Button } from "@heroui/button";
<Button color="primary" size="lg">Click Me</Button>

// Input Component
import { Input } from "@heroui/input";
<Input type="email" placeholder="Enter email" />

// Chip Component (Badge/Tag)
import { Chip } from "@heroui/chip";
<Chip color="success">Active</Chip>

// Checkbox Component
import { Checkbox } from "@heroui/checkbox";
<Checkbox isSelected={isChecked}>Remember me</Checkbox>
```

**Using HeroUI in Projects**:

1. Import the component you need
2. Use it like a regular React component
3. Customize with Tailwind classes and HeroUI props

Example:
```tsx
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

export function MyComponent() {
  return (
    <Card className="w-full max-w-md">
      <CardBody className="gap-4">
        <h2 className="text-xl font-bold">Welcome</h2>
        <Button 
          fullWidth 
          color="primary" 
          className="mt-4"
        >
          Get Started
        </Button>
      </CardBody>
    </Card>
  );
}
```

**HeroUI Documentation**: [https://www.heroui.org/docs](https://www.heroui.org/docs)

**Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 📝 Development Guidelines

### Code Style & Standards

1. **File Naming**:
   - Components: PascalCase (e.g., `RecentScan.tsx`)
   - Utilities: camelCase (e.g., `formatDate.ts`)
   - Directories: kebab-case (e.g., `dashboard/`, `ui-components/`)

2. **React Best Practices**:
   - Use functional components with hooks
   - Use `"use client"` directive for client-side components
   - Keep components focused and single-responsibility
   - Extract reusable logic into custom hooks

3. **TypeScript**:
   - Always define prop types with interfaces
   - Avoid `any` type - use proper typing
   - Use discriminated unions for complex state

4. **Component Structure**:
   ```tsx
   "use client";
   
   import { useState } from "react";
   import type { ComponentProps } from "./types";
   
   // Types
   interface Props {
     title: string;
     onSubmit: () => void;
   }
   
   // Component
   export default function MyComponent({ title, onSubmit }: Props) {
     const [state, setState] = useState(false);
     
     return (
       <div>
         {/* Component JSX */}
       </div>
     );
   }
   ```

5. **Styling**:
   - Use Tailwind CSS utility classes
   - Avoid inline styles when possible
   - Reuse common class combinations as components
   - Maintain consistent spacing and colors

### Git Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and commit: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/feature-name`
4. Create a Pull Request for review

### Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no functional change)
- `refactor:` - Code refactoring
- `chore:` - Dependencies, build config

## 🧩 Component Documentation

### UploadCard
**Path**: `components/dashboard/UploadCard.tsx`

Component for uploading images or capturing live footage for plate detection.

**Features**:
- Drag-and-drop file upload
- Camera capture support
- File validation

### DetectionResult
**Path**: `components/dashboard/DetectionResult.tsx`

Displays the results of license plate detection.

**Props**:
- `plate: string` - Detected license plate
- `confidence: number` - Detection confidence (0-100)
- `vehicleInfo?: VehicleData` - Associated vehicle information

### RecentScan
**Path**: `components/dashboard/RecentScan.tsx`

Shows a list of recent vehicle scans with filtering and search capabilities.

**Features**:
- Searchable scan history
- Status-based filtering (Clear, Flagged, Expired, Unregistered)
- Officer and location information
- Fine tracking

### VehicleInfo
**Path**: `components/dashboard/VehicleInfo.tsx`

Displays detailed information about a detected vehicle.

**Information Displayed**:
- License plate number
- Year, make, model, color
- Owner information
- Registration status
- Outstanding fines

### Sidebar
**Path**: `components/layout/Sidebar.tsx`

Navigation sidebar with collapsible menu.

**Features**:
- Responsive collapse/expand
- Navigation menu items
- Logout functionality
- Logo display

## 🔌 API Integration

### Backend API Base URL

The application communicates with the backend at:
```
http://localhost:4000
```

Configured via the `NEXT_PUBLIC_API_BASE_URL` environment variable.

### Common API Endpoints (Examples)

- `GET /api/vehicles/:plate` - Get vehicle information by plate number
- `GET /api/scans` - Get scan history
- `POST /api/scans` - Create new scan record
- `GET /api/scans/:id` - Get scan details

**Note**: Consult the backend documentation for complete API specifications.

### Making API Calls

Example fetch pattern:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getVehicleInfo(plate: string) {
  const response = await fetch(`${baseUrl}/api/vehicles/${plate}`);
  return response.json();
}
```

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution**: Either stop the conflicting process or specify a different port:
```bash
npm run dev -- -p 3001
```

### Issue: "Cannot find module" errors

**Solution**: Ensure dependencies are installed and cache is cleared:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: TypeScript errors not updating

**Solution**: Restart the development server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Issue: Changes not reflecting

**Solution**: Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Issue: API calls returning 404

**Solution**: Verify the backend is running:
```bash
# Check if backend is running on port 4000
curl http://localhost:4000/health
```

### Issue: Environment variables not loading

**Solution**: Ensure `.env.local` file exists in the frontend root directory with proper values:
```bash
cat .env.local
# Should show: NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [HeroUI Component Library](https://www.heroui.org/docs)

## 🤝 Contributing

When adding new features:

1. Create a new branch for your feature
2. Follow the code style guidelines
3. Write meaningful commit messages
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## 📞 Support

For questions or issues:
- Check the troubleshooting section above
- Review existing issues in the repository
- Contact the development team lead

---

**Last Updated**: May 2026  
**Version**: 1.0.0
