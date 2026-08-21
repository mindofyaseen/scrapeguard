import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

export const Logo = () => <svg aria-hidden="true" className="logo" viewBox="0 0 38 38"><path d="M19 2 34 10.5v17L19 36 4 27.5v-17L19 2Z" fill="currentColor"/><path d="m13 19 4 4 8-9" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const ArrowUpRight = () => <Icon><path d="M7 17 17 7M7 7h10v10" /></Icon>;
export const ArrowRight = () => <Icon><path d="M5 12h14m-5-5 5 5-5 5" /></Icon>;
export const Spark = () => <Icon><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Zm6 11 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" /></Icon>;
export const Pulse = () => <Icon><path d="M3 12h4l2-7 4 14 2-7h6" /></Icon>;
export const Wand = () => <Icon><path d="m15 4 5 5L9 20H4v-5L15 4Zm-2-2v3M21 11h-3M19 3l-2 2" /></Icon>;
export const Check = () => <Icon><path d="m6 12 4 4 8-9" /></Icon>;
export const Alert = () => <Icon><path d="M12 9v4m0 4h.01M10 3 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L14 3a2.2 2.2 0 0 0-4 0Z" /></Icon>;
export const Terminal = () => <Icon><path d="m5 7 4 4-4 4m6 0h7" /><rect x="2" y="3" width="20" height="18" rx="2" /></Icon>;
export const Grid = () => <Icon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Icon>;
export const Shield = () => <Icon><path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z"/><path d="m8 12 2.5 2.5L16 9"/></Icon>;
export const LinkIcon = () => <Icon><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></Icon>;
export const Clock = () => <Icon><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></Icon>;
export const Lock = () => <Icon><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></Icon>;
export const Search = () => <Icon><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>;
export const Calendar = () => <Icon><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Icon>;
export const MapPin = () => <Icon><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></Icon>;
export const Spinner = () => <Icon><path d="M21 12a9 9 0 1 1-6.2-8.6"/></Icon>;
