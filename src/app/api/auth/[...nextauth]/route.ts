import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { users } from '@/helpers/userApi'
import { User } from '@/types/user'

declare module 'next-auth' {
  interface Session {
    session: {
      user: User
    }
    authenticated: boolean
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('You must include your email and password!')
        }

        if (!credentials.email) {
          throw new Error('You must include your email.')
        }

        if (!credentials.password) {
          throw new Error('You must include your password.')
        }

        console.log('credentials email', credentials.email)

        const user = await users.authenticate({
          email: credentials.email,
          password: credentials.password,
        })

        //Not found - send error res
        if (!user) {
          throw new Error('Wrong email or password.')
        }

        return { _id: user._id, email: user.email, role: user.role } as any
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        delete user.password
        token.user = user
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
  },
} as any

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
