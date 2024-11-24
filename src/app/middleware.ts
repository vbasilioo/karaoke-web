import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET;

const unprotectedRoutes = ['/auth/administrador-entrar', '/auth/entrar-temporariamente', '/auth/esqueci-minha-senha'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isUnprotectedRoute = unprotectedRoutes.some(route => pathname.startsWith(route));

    if (isUnprotectedRoute) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret });

    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/protected/', '/dashboard/'], 
}