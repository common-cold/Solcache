import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { User as UserDb } from "@/app/src/interfaces";
import { env } from "process";
import axios from "axios";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'email',
            credentials: {
              email: { label: "Email", type: "text" },
              role: { label: "Text", type: "text" }
            },
            async authorize(credentials, req) {
              try{
                console.log(credentials?.email);
                console.log(credentials?.role);
                const res = await axios.post("http://localhost:8080/api/v1/user", {
                    email: credentials?.email,
                    role: credentials?.role
                });
                console.log("after res");
                const user: UserDb = res.data as UserDb;
                return {
                    id: user.userId
                }
              } catch (e) {
                return null;
              }
            },
        }),
    ],
    secret: env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({token, user,}) {
            if (user) {
                token.id = user.id
            }
            return token;
        },
    },
});

export { handler as GET, handler as POST }