import type { SVGProps, ReactElement } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function IconSlideshow(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M10 9l4 3-4 3z" fill="currentColor" />
    </svg>
  );
}

export function IconGrid(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconArticle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

export function IconCards(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="6" width="6" height="12" rx="1.5" />
      <rect x="10.5" y="6" width="6" height="12" rx="1.5" />
      <rect x="18" y="6" width="3" height="12" rx="1.5" opacity="0.5" />
    </svg>
  );
}

export function IconHero(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10h10M7 14h6" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconInfo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M11 12h1v5h1" />
    </svg>
  );
}

export function IconGallery(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 15l-5-5-8 8" />
    </svg>
  );
}

export function IconMail(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconForm(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.5c3 .2 5 2 5.5 5" />
    </svg>
  );
}

export function IconBriefcase(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </svg>
  );
}

export function IconBlock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function IconChevronUp(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

export function IconChevronDown(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconDrag(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconEye(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.4 4.1M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.4-1.1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function IconTrash(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export function IconEdit(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="M14.5 6.5l3 3" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconUndo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7v6h6" />
      <path d="M3.5 13a9 9 0 1 0 2.6-8" />
    </svg>
  );
}

export function IconRefresh(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 21" />
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 3" />
      <path d="M21 3v6h-6M3 21v-6h6" />
    </svg>
  );
}

export function IconExternal(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconClose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconUpload(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
    </svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}

/* --- Primitive icons (for CustomBlock element picker) --- */

export function IconH1(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6v12M12 6v12M4 12h8" />
      <path d="M17 9l2-1v10" strokeWidth={1.75} />
    </svg>
  );
}

export function IconH2(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6v12M12 6v12M4 12h8" />
      <path d="M16 10a2 2 0 1 1 4 0c0 2-4 3-4 6h4" />
    </svg>
  );
}

export function IconH3(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6v12M12 6v12M4 12h8" />
      <path d="M16 9h4l-2.5 3a2 2 0 1 1-1.5 3.5" />
    </svg>
  );
}

export function IconParagraph(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 10h16M4 14h12M4 18h8" />
    </svg>
  );
}

export function IconQuote(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 7C5 8 4 10 4 12v5h5v-5H6c0-1.5.7-3 2-4zM17 7c-2 1-3 3-3 5v5h5v-5h-3c0-1.5.7-3 2-4z" />
    </svg>
  );
}

export function IconButton(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconVideo(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="15" height="14" rx="2" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
      <path d="M18 9l3-2v10l-3-2" />
    </svg>
  );
}

export function IconDivider(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 12h18" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSpacer(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" />
    </svg>
  );
}

export function IconList(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconArrowLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export function IconInbox(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 12l3-7h12l3 7v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M3 12h5l1 3h6l1-3h5" />
    </svg>
  );
}

export function IconMailOpen(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 9l9 6 9-6" />
    </svg>
  );
}

export function IconArchive(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
    </svg>
  );
}

export function IconPublish(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 21V9M6 15l6-6 6 6M4 4h16" />
    </svg>
  );
}

export function IconDraft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M9 13h6M9 17h4" />
    </svg>
  );
}

export function IconSitemap(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <rect x="3" y="17" width="6" height="4" rx="1" />
      <rect x="15" y="17" width="6" height="4" rx="1" />
      <path d="M12 7v4M6 17v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function IconZoomIn(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3M8 11h6M11 8v6" />
    </svg>
  );
}

export function IconZoomOut(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3M8 11h6" />
    </svg>
  );
}

export function IconFit(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
    </svg>
  );
}

export function IconPages(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 3h9l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M15 3v5h5" />
      <path d="M9 13h7M9 17h5" />
    </svg>
  );
}

export function IconSettings(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function IconMedia(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8" cy="10" r="1.5" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  );
}

export function IconLogout(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconPanelLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

export function IconPanelLeftClose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M15 10l-3 2 3 2" />
    </svg>
  );
}

export function IconBlocks(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="4" rx="1.5" />
      <rect x="14" y="11" width="7" height="10" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconAlignLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />
    </svg>
  );
}

export function IconAlignCenter(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />
    </svg>
  );
}

export function IconAlignRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />
    </svg>
  );
}

const REGISTRY: Record<string, (p: IconProps) => ReactElement> = {
  Slideshow: IconSlideshow,
  Grid: IconGrid,
  Article: IconArticle,
  Cards: IconCards,
  Hero: IconHero,
  Info: IconInfo,
  Gallery: IconGallery,
  Mail: IconMail,
  Form: IconForm,
  Users: IconUsers,
  Briefcase: IconBriefcase,
  Blocks: IconBlocks,
};

export function SectionIcon({ name, size = 20, ...rest }: { name?: string } & IconProps) {
  const Comp = (name && REGISTRY[name]) || IconBlock;
  return <Comp size={size} {...rest} />;
}
