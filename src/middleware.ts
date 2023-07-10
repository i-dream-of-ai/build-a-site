import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // `/admin` requires admin role
      if (req.nextUrl.pathname === '/admin') {
        return token?.role === 'admin'
      }

      //other pages just a token
      return !!token
    },
  },
})

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/sites', '/sites:id', '/account'],
}
