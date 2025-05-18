import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('userToken')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/products',
    '/dashboard/incoming',
    '/dashboard/outgoing',
    '/dashboard/suppliers',
    '/dashboard/reports',
    '/dashboard/notifications',
    '/dashboard/settings',
  ];

  // Authentication routes - if user is logged in, redirect to dashboard
  const authRoutes = ['/login', '/register'];

  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register',
  ],
}; 