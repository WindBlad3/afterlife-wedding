// Shared look for the home and upload pages: butter/white backgrounds, blue ink.
export const INK = 'text-[#1f3a6e]'; // main blue
export const ACCENT = 'text-[#3d5f9e]'; // lighter blue for script titles and details
export const CAPS = 'uppercase tracking-[0.35em]';
export const SERIF = 'font-(family-name:--font-display)';
export const SCRIPT = 'font-(family-name:--font-script)';
export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a6e]';
export const BTN =
  'inline-flex items-center justify-center gap-3 rounded-full bg-[#1f3a6e] px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-[#fbf6e9] shadow-sm transition hover:bg-[#2b4c8a] cursor-pointer';
export const BTN_OUTLINE =
  'inline-flex items-center justify-center gap-3 rounded-full border border-[#1f3a6e]/50 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-[#1f3a6e] transition hover:bg-[#1f3a6e]/8 cursor-pointer';

// Subtle paper grain as a data URI (allowed by the CSP: img-src data:).
export const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

export function Icon({ children, className = 'h-10 w-10' }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {children}
    </svg>
  );
}

export function Divider({ className = 'my-8' }: { className?: string }) {
  return (
    <div aria-hidden className={`mx-auto flex items-center justify-center gap-3 text-[#3d5f9e]/60 ${className}`}>
      <span className="h-px w-12 bg-current" />
      <svg viewBox="0 0 10 10" className="h-2 w-2 fill-current"><path d="M5 0 10 5 5 10 0 5Z" /></svg>
      <span className="h-px w-12 bg-current" />
    </div>
  );
}

export const CAMERA = <path d="M3 8h4l2-3h6l2 3h4v11H3V8Zm9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />;
