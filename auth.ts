import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  pages: { signIn: "/admin/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Defense-in-depth on top of safeCallbackUrl in the login form.
      // Only allow relative paths or same-origin absolute URLs.
      try {
        if (url.startsWith("/") && !url.startsWith("//")) return `${baseUrl}${url}`;
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return baseUrl;
    },
    async signIn({ user }) {
      const email = user.email?.toLowerCase().trim();
      if (!email) return false;
      try {
        const allowed = await db.allowedEmail.findUnique({
          where: { email },
        });
        return Boolean(allowed);
      } catch (err) {
        console.error("[auth] signIn whitelist check failed:", err);
        return false;
      }
    },
    async session({ session, user }) {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: dbUser?.role ?? "admin",
        },
      };
    },
  },
});
