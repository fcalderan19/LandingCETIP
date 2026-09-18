import Image from "next/image";
import { signIn } from "@/auth";
import { safeCallbackUrl } from "@/lib/safe-redirect";

export const metadata = { title: "Iniciar sesión · CETIP Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const error = params.error;

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-white text-[var(--color-petroleo)]">
      {/* Left: brand panel */}
      <aside className="relative hidden md:flex flex-col justify-between p-10 bg-[var(--color-petroleo)] text-white overflow-hidden">
        {/* Decorative background blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[var(--color-celeste)]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <Image
            src="/img/cetip-logo-dark.png"
            alt="CETIP"
            width={140}
            height={44}
            priority
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight max-w-sm">
            Panel de administración
          </h2>
          <p className="mt-3 text-white/70 max-w-sm text-sm leading-relaxed">
            Editá el contenido del sitio, revisá el buzón de contactos y
            gestioná la información institucional del CETIP.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/50">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-verde)]" />
          Acceso restringido
        </div>
      </aside>

      {/* Right: login card */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Small brand for mobile (left panel is hidden) */}
          <div className="md:hidden mb-8 flex items-center justify-center">
            <Image
              src="/img/cetip-logo-transparent.png"
              alt="CETIP"
              width={120}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold">Ingresar al panel</h1>
          <p className="text-sm text-[var(--color-petroleo)]/70 mt-2">
            Iniciá sesión con tu cuenta de Google autorizada.
          </p>

          {error && (
            <p className="mt-5 text-sm text-[var(--color-coral)] bg-[var(--color-coral)]/10 px-3 py-2 rounded-lg">
              No pudimos iniciar sesión. Verificá que tu email esté autorizado.
            </p>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 bg-white border border-[var(--color-petroleo-100)] hover:border-[var(--color-petroleo)] text-[var(--color-petroleo)] font-semibold px-4 py-3 rounded-full shadow-sm hover:shadow-md transition"
            >
              <GoogleIcon />
              Continuar con Google
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC04"
        d="M5.87 14.12A6.97 6.97 0 0 1 5.5 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.96l3.69-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.13 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.69 2.84C6.73 7.3 9.15 5.38 12 5.38z"
      />
    </svg>
  );
}
