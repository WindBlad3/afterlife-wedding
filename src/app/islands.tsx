'use client';

import { useEffect, useRef, useState } from 'react';

/* ---------- Copy alias ---------- */

export function CopyAlias({ alias }: { alias: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the alias stays visible to copy by hand.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="mt-5 rounded-full border border-[#1f3a6e]/50 px-7 py-3 text-[11px] uppercase tracking-[0.3em] text-[#1f3a6e] transition hover:bg-[#1f3a6e]/8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a6e]"
    >
      <span aria-live="polite">{copied ? '¡Copiado!' : 'Copiar alias'}</span>
    </button>
  );
}

/* ---------- Reveal on scroll ---------- */

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.hidden = 'true';
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.hidden = 'false';
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Hidden state is only applied after JS runs, so content is visible without JS.
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out data-[hidden=true]:translate-y-6 data-[hidden=true]:opacity-0 motion-reduce:transition-none motion-reduce:data-[hidden=true]:translate-y-0 motion-reduce:data-[hidden=true]:opacity-100 ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Menu ---------- */

export function Menu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-overlay"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setOpen((o) => !o)}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-[#fbf6e9]/80 shadow-sm backdrop-blur focus-visible:outline-2 focus-visible:outline-[#1f3a6e]"
      >
        <span className={`h-px w-5 bg-[#1f3a6e] transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
        <span className={`h-px w-5 bg-[#1f3a6e] transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
      </button>
      {open && (
        <nav
          id="menu-overlay"
          aria-label="Secciones"
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#fbf6e9]/97 backdrop-blur-sm"
        >
          <ul className="flex flex-col items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-(family-name:--font-display) text-sm uppercase tracking-[0.4em] text-[#1f3a6e] hover:text-[#3d5f9e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3a6e]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
