import NextAuth, { type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    // Strictly typing token and account interfaces
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Strictly typing session and token parameters without falling back to any
    async session({ session, token }: { session: Session & { accessToken?: string }; token: JWT }): Promise<Session> {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});