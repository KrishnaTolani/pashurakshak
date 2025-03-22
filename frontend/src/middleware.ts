import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get the token from the cookies
  const token = request.cookies.get('adminToken')?.value;

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isLoginPage = path === '/admin/login';

  // If trying to access admin routes without token
  if (isAdminRoute && !isLoginPage && !token) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  // If trying to access login page with valid token
  if (isLoginPage && token) {
    const url = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 