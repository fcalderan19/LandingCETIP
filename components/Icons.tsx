import type { SVGProps } from "react";

const base = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconWhatsapp = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...p}>
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.08.55 4.12 1.59 5.92L0 24l6.4-1.68a11.83 11.83 0 0 0 5.64 1.43h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.43Zm-8.48 18.2a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.85 9.85 0 1 1 8.39 4.66Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

export const IconPhone = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
);

export const IconMail = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
);

export const IconMapPin = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export const IconClock = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
);

export const IconInstagram = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

export const IconFacebook = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/></svg>
);

export const IconMenu = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

export const IconClose = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export const IconChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="6 9 12 15 18 9"/></svg>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><polyline points="20 6 9 17 4 12"/></svg>
);

export const IconBrain = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

export const IconSpeech = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
);

export const IconHand = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
);

export const IconBook = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
);

export const IconMusic = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

export const IconHeart = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>
);

export const IconUsers = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
