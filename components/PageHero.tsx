
type Crumb = { href: string; label: string };

export default function PageHero({
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=70",
  crumbs = []
}: {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 -z-10 w-full h-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[var(--color-petroleo)]/75" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 text-white">
        {crumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="text-xs text-white/75 mb-3">
            <ol className="flex flex-wrap items-center gap-1">
              <li><a href="/" className="hover:underline">Inicio</a></li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  <span>/</span>
                  {i === crumbs.length - 1 ? (
                    <span className="text-white">{c.label}</span>
                  ) : (
                    <a href={c.href} className="hover:underline">{c.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-3 text-white/85 max-w-2xl text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
