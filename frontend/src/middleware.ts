import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get the admin token from the cookies
  const adminToken = request.cookies.get('adminToken')?.value;
  
  // Get the NGO token from cookies (we'll set this during login)
  const ngoToken = request.cookies.get('ngoToken')?.value;

  // Define route types
  const isAdminRoute = path.startsWith('/admin');
  const isNgoRoute = !isAdminRoute && 
    path !== '/' && 
    !path.startsWith('/login') && 
    !path.startsWith('/register') && 
    !path.startsWith('/register/status');
    
  // Define login/register pages
  const isAdminLoginPage = path === '/admin/login';
  const isNgoLoginPage = path === '/login';
  const isRegisterPage = path === '/register' || path.startsWith('/register/status');

  // Admin route protection
  if (isAdminRoute && !isAdminLoginPage && !adminToken) {
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  // If trying to access admin login page with valid token
  if (isAdminLoginPage && adminToken) {
    const url = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  // NGO route protection
  if (isNgoRoute && !ngoToken) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // If trying to access NGO login page with valid token
  if (isNgoLoginPage && ngoToken) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}; 