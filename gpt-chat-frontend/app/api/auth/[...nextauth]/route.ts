import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"

import { Prisma } from "@prisma/client";
import { prisma } from '@/app/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }: any) {
            session.user.id = token.sub
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

