import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get the admin token from the cookies
  const adminToken = request.cookies.get('adminToken')?.value;
  
  // Get the NGO token from cookies (we'll set this during login)
  const ngoToken = request.cookies.get('ngoToken')?.value;

  // Define public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/admin/login'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    // For register, only the exact route is public, not its sub-routes
    if (route === '/register') {
      return path === route;
    }
    // For other public routes, allow their sub-routes as well
    return path === route || path.startsWith(`${route}/`);
  });

  // Define route types
  const isAdminRoute = path.startsWith('/admin');
  const isAdminLoginPage = path === '/admin/login';
  const isNgoLoginPage = path === '/login';
  const isDashboardPage = path === '/dashboard';

  // If it's a public route, allow access
  if (isPublicRoute) {
    // But if we have tokens and trying to access login pages, redirect to dashboard
    if (isNgoLoginPage && ngoToken) {
      console.log('NGO user detected on login page, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (isAdminLoginPage && adminToken) {
      console.log('Admin user detected on login page, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    return NextResponse.next();
  }

  // Admin route protection
  if (isAdminRoute) {
    if (!adminToken && !isAdminLoginPage) {
      console.log('No admin token found, redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // NGO route protection (all other non-public routes)
  if (!ngoToken) {
    console.log('No NGO token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If we have a token and hitting dashboard route, ensure access is allowed
  if (isDashboardPage && ngoToken) {
    console.log('NGO user confirmed for dashboard access');
    // Allow access to dashboard with valid token
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}; 