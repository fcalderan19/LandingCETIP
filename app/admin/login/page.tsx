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
    <main className="min-h-screen grid place-items-center bg-[var(--color-petroleo-50)] text-[var(--color-petroleo)] px-4">
      <div className="bg-white rounded-2xl shadow-md border border-[var(--color-petroleo-100)] p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold">Admin CETIP</h1>
        <p className="text-sm text-[var(--color-petroleo)]/70 mt-2">
          Iniciá sesión con tu cuenta de Google autorizada.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 bg-white border border-[var(--color-petroleo-100)] hover:border-[var(--color-petroleo)] text-[var(--color-petroleo)] font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition"
          >
            <GoogleIcon />
            Continuar con Google
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-[var(--color-coral)] bg-[var(--color-coral)]/10 px-3 py-2 rounded-lg">
            No pudimos iniciar sesión. Verificá que tu email esté autorizado.
          </p>
        )}

        <p className="mt-6 text-[11px] text-[var(--color-petroleo)]/60 leading-snug">
          Solo cuentas autorizadas (lista blanca en la base de datos) pueden
          acceder al panel.
        </p>
      </div>
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
