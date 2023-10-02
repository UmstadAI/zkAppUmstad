import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import sha256 from 'crypto-js/sha256'
import Hex from 'crypto-js/enc-hex'

function reduceUserId(userId: string) {
  const hash = BigInt('0x' + Hex.stringify(sha256(userId)));
  console.log(hash)
  const stringHash = (hash % BigInt('9007199254740992')).toString()
  console.log(stringHash)
  return stringHash
}

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    GitHub,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (profile) {
        console.log(user.id)
        token.id = reduceUserId(user.id)
        token.image = profile.avatar_url || profile.picture
      }
      console.log(token)
      return token
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in', // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
    error: '/login'
  }
})
