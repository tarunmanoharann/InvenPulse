# InvenPulse Next.js Client

This is the Next.js version of the InvenPulse inventory management system. It provides a modern, server-side rendered frontend with the same features as the React version.

## Tech Stack

- Next.js 13+ (with App Router)
- TypeScript
- Firebase Authentication
- Tailwind CSS
- Shadcn/UI Components
- Redux Toolkit for state management
- React-Toastify for toast notifications
- Framer Motion for animations
- Three.js for 3D visualizations

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invenpulse/client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Setup environment variables:
Create a `.env.local` file in the root of the client directory with the following Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `app/` - Next.js app router pages and components
- `components/` - Reusable UI components
  - `ui/` - Base UI components (button, card, input, etc.)
  - `user/` - User-specific components
  - `admin/` - Admin-specific components
- `lib/` - Utility functions and configuration
  - `firebase.ts` - Firebase configuration
  - `store.ts` - Redux store configuration
  - `utils.ts` - Helper functions
- `contexts/` - React context providers
  - `AuthContext.tsx` - Authentication context
  - `UserContext.tsx` - User data context
  - `ThemeContext.tsx` - Theme management

## Additional Notes

This project uses Next.js App Router, which means that all pages are located in the `app/` directory and follow the file-system based routing convention.

Each page should be a default exported component in a `page.tsx` file. Layout components are defined in `layout.tsx` files. 