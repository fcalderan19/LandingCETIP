import type { CustomBlockProps, CustomBlockElement } from "./schema";

function containerCls(c: CustomBlockProps["container"]) {
  switch (c) {
    case "narrow":
      return "max-w-2xl";
    case "wide":
      return "max-w-6xl";
    case "full":
      return "max-w-none";
    case "medium":
    default:
      return "max-w-4xl";
  }
}

function spacingCls(s: CustomBlockProps["spacing"]) {
  switch (s) {
    case "small":
      return "py-8 sm:py-10";
    case "large":
      return "py-20 sm:py-28";
    case "medium":
    default:
      return "py-14 sm:py-20";
  }
}

function bgStyle(
  bg: CustomBlockProps["background"],
  custom?: string,
): { className: string; style?: React.CSSProperties } {
  switch (bg) {
    case "cream":
      return { className: "bg-[var(--color-crema)]" };
    case "petroleo":
      return { className: "bg-[var(--color-petroleo)] text-white" };
    case "celeste":
      return { className: "bg-[var(--color-celeste)] text-white" };
    case "custom":
      return {
        className: "",
        style: custom ? { backgroundColor: custom } : undefined,
      };
    case "white":
    default:
      return { className: "bg-white" };
  }
}

function alignCls(a?: CustomBlockElement["align"]) {
  switch (a) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

function spacerCls(s?: CustomBlockElement["size"]) {
  switch (s) {
    case "small":
      return "h-4";
    case "large":
      return "h-16";
    default:
      return "h-8";
  }
}

function buttonCls(v?: CustomBlockElement["variant"]) {
  const base =
    "inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-full transition text-sm";
  switch (v) {
    case "outline":
      return `${base} border-2 border-current bg-transparent hover:bg-current hover:text-white`;
    case "ghost":
      return `${base} bg-transparent underline underline-offset-4 decoration-2 hover:decoration-4`;
    case "primary":
    default:
      return `${base} bg-[var(--color-coral)] text-white hover:bg-[var(--color-coral-600)] shadow-sm`;
  }
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

function Element({ el }: { el: CustomBlockElement }) {
  const align = alignCls(el.align);
  switch (el.kind) {
    case "heading_1":
      return (
        <h1
          className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${align}`}
        >
          {el.text || "Título grande"}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${align}`}>
          {el.text || "Título"}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className={`text-xl sm:text-2xl font-bold ${align}`}>
          {el.text || "Subtítulo"}
        </h3>
      );
    case "paragraph":
      return (
        <p className={`text-base sm:text-lg leading-relaxed opacity-90 ${align}`}>
          {el.text || "Escribí acá tu párrafo."}
        </p>
      );
    case "quote":
      return (
        <figure className={`${align}`}>
          <blockquote className="border-l-4 border-[var(--color-celeste)] pl-4 sm:pl-6 italic text-lg sm:text-xl leading-relaxed">
            “{el.text || "Una cita destacada."}”
          </blockquote>
          {el.cite && (
            <figcaption className="mt-2 text-sm opacity-70">
              — {el.cite}
            </figcaption>
          )}
        </figure>
      );
    case "button": {
      const href = el.href || "#";
      return (
        <div className={align}>
          <a href={href} className={buttonCls(el.variant)}>
            {el.text || "Llamado a la acción"}
          </a>
        </div>
      );
    }
    case "image":
      if (!el.src) {
        return (
          <div className="rounded-2xl border-2 border-dashed border-current/20 bg-current/5 py-16 text-center text-sm opacity-60">
            Sin imagen — editá este bloque y pegá una URL o subí una foto.
          </div>
        );
      }
      return (
        <figure className={align}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={el.src}
            alt={el.alt || ""}
            className="rounded-2xl w-full h-auto object-cover"
            loading="lazy"
          />
          {el.caption && (
            <figcaption className="mt-2 text-xs opacity-70">
              {el.caption}
            </figcaption>
          )}
        </figure>
      );
    case "video": {
      const embed = el.embedUrl ? toEmbedUrl(el.embedUrl) : null;
      if (!embed) {
        return (
          <div className="rounded-2xl border-2 border-dashed border-current/20 bg-current/5 py-16 text-center text-sm opacity-60">
            Pegá un link de YouTube o Vimeo para embeber el video.
          </div>
        );
      }
      return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe
            src={embed}
            title={el.text || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
    case "divider":
      return (
        <hr className="border-0 h-px bg-current/15" />
      );
    case "spacer":
      return <div aria-hidden="true" className={spacerCls(el.size)} />;
    case "list": {
      const items = (el.items ?? []).filter((x) => x.trim().length > 0);
      if (items.length === 0) {
        return (
          <p className={`text-sm opacity-60 italic ${align}`}>
            Lista vacía — agregá items en el editor.
          </p>
        );
      }
      const cls = `pl-6 space-y-1.5 text-base sm:text-lg opacity-90 ${align}`;
      return el.ordered ? (
        <ol className={`list-decimal ${cls}`}>
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      ) : (
        <ul className={`list-disc ${cls}`}>
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      );
    }
    default:
      return null;
  }
}

export default function CustomBlockRender(props: CustomBlockProps) {
  const bg = bgStyle(props.background, props.backgroundColor);
  return (
    <section
      className={`${bg.className} ${spacingCls(props.spacing)}`}
      style={bg.style}
    >
      <div
        className={`${containerCls(props.container)} mx-auto px-4 sm:px-6 space-y-6`}
      >
        {props.elements.map((el) => (
          <Element key={el.id} el={el} />
        ))}
      </div>
    </section>
  );
}
