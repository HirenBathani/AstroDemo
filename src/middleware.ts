import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
    // Parse the 'Cookie' header
    console.log(request.headers, 'HEADERRRRRRRRRRRRRRRR')
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));

    // Get the value of the 'token' cookie
    const token = cookies['token'];

    console.log('Middleware invoked. Token:', token);

    const isLoggedIn = !!token; // Check if the token is present

    // Define protected routes and public routes
    const protectedRoutes = ['/dashboard', '/logout'];
    const publicRoutes = ['/login', '/'];

    const requestUrl = new URL(request.url);

    // Redirect unauthenticated users away from protected routes
    if (protectedRoutes.includes(requestUrl.pathname)) {
        if (!isLoggedIn) {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/login'
                }
            });
        }
    }

    // Redirect authenticated users away from public routes
    if (publicRoutes.includes(requestUrl.pathname)) {
        if (isLoggedIn) {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/dashboard'
                }
            });
        }
    }

    return next();
});
