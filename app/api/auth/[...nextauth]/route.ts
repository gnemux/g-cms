import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

// Extend NextAuth User type
interface User extends NextAuthUser {
  id: string
  name: string
  email: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {

        if (!credentials?.username || !credentials?.password) {
          return null
        }

        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            name: credentials.username,
            email: 'admin@example.com'
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after login
      return `${baseUrl}/admin`
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }