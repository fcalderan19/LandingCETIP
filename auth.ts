import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

// One rule decides who reaches /admin: a User row must exist for the
// lowercased Google email AND active === true. There are no roles because
// there are no non-admin users — anyone in the table can edit everything.
//
// Provisioning:   INSERT INTO "User"(email, active) VALUES ('foo@…', true);
// Revoking:       UPDATE "User" SET active=false WHERE email='foo@…';
//
// PrismaAdapter auto-creates a User on first successful sign-in. To keep
// that from turning "any Google account that touches /admin/login" into an
// admin, new rows default to active=false at the DB level. Someone must
// flip active=true by hand.

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
    // Force re-auth every 8h even if the tab stays open — shrinks the
    // window of a stolen session cookie.
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Always show Google's account chooser. Without this, Google
      // auto-picks whichever account is already active in the browser,
      // which is inconvenient when the user's default Google account
      // isn't the one that's allowlisted here.
      authorization: {
        params: { prompt: "select_account" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email?.toLowerCase().trim(),
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Only allow relative paths or same-origin URLs — defense in depth on
      // top of safeCallbackUrl in the login form.
      try {
        if (url.startsWith("/") && !url.startsWith("//")) return `${baseUrl}${url}`;
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        /* fall through */
      }
      return baseUrl;
    },
    async signIn({ user, profile, account }) {
      const email = user.email?.toLowerCase().trim();
      if (!email) return false;
      // Google itself must have verified the address.
      if (account?.provider === "google" && profile && profile.email_verified === false) {
        return false;
      }
      try {
        const row = await db.user.findUnique({
          where: { email },
          select: { id: true, active: true },
        });
        if (!row || !row.active) return false;
        // Audit trail.
        await db.user.update({
          where: { id: row.id },
          data: { lastLoginAt: new Date() },
        });
        return true;
      } catch (err) {
        console.error("[auth] signIn check failed:", err);
        return false;
      }
    },
    async session({ session, user }) {
      // Recheck active on every session read — if someone was deactivated
      // after the cookie was issued, hand back a neutered session so
      // requireAdmin() rejects.
      const row = await db.user.findUnique({
        where: { id: user.id },
        select: { active: true },
      });
      if (!row || !row.active) {
        return { ...session, user: { ...session.user, id: "" } };
      }
      return {
        ...session,
        user: { ...session.user, id: user.id },
      };
    },
  },
  events: {
    async signIn({ user }) {
      console.info("[auth] signIn OK", { email: user.email });
    },
  },
});
