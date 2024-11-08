import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
} 