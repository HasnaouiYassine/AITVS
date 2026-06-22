import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || "tilevision-local-development-secret",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");
        if (!email || !password || !process.env.MONGODB_URI) return null;

        await connectDB();
        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) return null;
        const valid = await user.comparePassword(password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "role" in user ? user.role : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = String(token.role || "user");
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && process.env.MONGODB_URI) {
        await connectDB();
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
          await User.create({ name: user.name || "Google User", email: user.email, role: "user" });
        }
      }
      return true;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
});
