import Link from 'next/link';
import { CopyAlias, Menu, Reveal } from './islands';
import { ACCENT, BTN, CAMERA, CAPS, Divider, Icon, INK, NOISE, SCRIPT, SERIF } from './theme';

const ALIAS = 'casamiento.sofiysan';

const SCHEDULE: { time: string; label: string; icon: React.ReactNode }[] = [
  { time: '11:00', label: 'Ceremonia', icon: <path d="M8 20c0-6 4-8 4-14m0 0c0 6 4 8 4 14M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 20h14" /> },
  { time: '12:00 – 13:00', label: 'Aperitivos y presentación', icon: <path d="M6 3h12l-6 8-6-8Zm6 8v9m-4 0h8M9 6h6" /> },
  { time: '13:30', label: 'Almuerzo', icon: <path d="M7 3v8m-2-8v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 7h3v11" /> },
  { time: '14:30', label: 'Brindis', icon: <path d="M5 3h5l-.5 6a2 2 0 0 1-4 0L5 3Zm2.5 8v9m-2 0h4M14 3h5l.5 6a2 2 0 0 1-4 0L14 3Zm2.5 8v9m-2 0h4" /> },
  { time: '15:00', label: 'Fotos con los invitadxs', icon: CAMERA },
  { time: '15:30', label: 'Baile', icon: <path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> },
  { time: '16:00', label: 'Entretenimiento & café', icon: <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm12 1h2a2 2 0 0 1 0 4h-2M8 3v3m4-3v3" /> },
  { time: '17:00', label: 'Final', icon: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" /> },
];

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#cronograma', label: 'Cronograma' },
  { href: '#regalos', label: 'Regalos' },
  { href: '#fotos', label: 'Fotos' },
];

const GIFT = <path d="M3 9h18v4H3V9Zm2 4h14v8H5v-8Zm7-4v12M12 9c-1.5-4-6-4-6-1.5S10 9 12 9Zm0 0c1.5-4 6-4 6-1.5S14 9 12 9Z" />;

function Title({ caps, scriptText, id }: { caps: string; scriptText: string; id: string }) {
  return (
    <h2 id={id} className="flex flex-col items-center">
      <span className={`${CAPS} text-xs text-[#1f3a6e]/70`}>{caps}</span>
      <span className={`${SCRIPT} ${ACCENT} mt-1 text-5xl leading-tight sm:text-6xl`}>{scriptText}</span>
    </h2>
  );
}

export default function Home() {
  return (
    <main className={`${SERIF} min-h-screen scroll-smooth bg-[#fbf6e9] ${INK} antialiased`}>
      <Menu links={LINKS} />

      {/* HERO */}
      <section id="inicio" aria-label="Sofi & Santi" className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,#fdf9ef_45%,#f6edd6_100%)]">
          <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#3d5f9e]/8 blur-3xl" />
          <div className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-[#e9d9ad]/40 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply" style={{ backgroundImage: NOISE }} />
        </div>

        <Reveal>
          <div aria-hidden className="relative mx-auto h-48 w-44 select-none sm:h-64 sm:w-56">
            <span className="absolute left-0 top-0 text-[10rem] font-normal leading-none sm:text-[13rem]">S</span>
            <span className={`absolute bottom-0 right-0 text-[10rem] font-normal leading-none sm:text-[13rem] ${ACCENT} opacity-70`}>S</span>
          </div>
          <h1 className="mt-8 text-2xl font-normal uppercase tracking-[0.5em] sm:text-4xl">
            Sofi <span className={ACCENT}>&amp;</span> Santi
          </h1>
          <p className={`mt-5 ${CAPS} text-[11px] text-[#1f3a6e]/70`}>15 · 11 · 2026</p>
        </Reveal>

        <a href="#cronograma" aria-label="Ir a la siguiente sección" className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[#1f3a6e]/50 hover:text-[#3d5f9e] focus-visible:outline-2 focus-visible:outline-[#1f3a6e]`}>
          <Icon className="h-7 w-7 motion-safe:animate-bounce"><path d="m6 9 6 6 6-6" /></Icon>
        </a>
      </section>

      {/* CRONOGRAMA */}
      <section aria-labelledby="cronograma" className="bg-white px-6 py-24">
        <Reveal className="mx-auto max-w-md">
          <div className="text-center">
            <Title id="cronograma" caps="Cronograma" scriptText="Los tiempos de nuestra boda" />
          </div>
          <ol className="relative mt-14 border-l border-[#3d5f9e]/30 pl-0">
            {SCHEDULE.map((s) => (
              <li key={s.label} className="relative mb-10 flex items-center gap-5 pl-10 last:mb-0">
                <span aria-hidden className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border border-[#3d5f9e] bg-white" />
                <span className={`text-[#1f3a6e]/80`}><Icon className="h-9 w-9">{s.icon}</Icon></span>
                <div>
                  <p className={`${CAPS} text-[11px] ${ACCENT}`}>{s.time}</p>
                  <p className="mt-1 text-lg">{s.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* REGALOS */}
      <section aria-labelledby="regalos" className="bg-[#fbf6e9] px-6 py-24 text-center">
        <Reveal className="mx-auto max-w-xl">
          <Icon className="mx-auto h-10 w-10">{GIFT}</Icon>
          <div className="mt-6"><Title id="regalos" caps="Regalos" scriptText="Luna de miel" /></div>
          <p className={`mt-8 leading-relaxed text-[#1f3a6e]/80`}>
            Su presencia es el mejor regalo pero, si desean hacernos un obsequio, un aporte para nuestra luna de miel sería ideal…
          </p>
          <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-[#1f3a6e]/10 bg-white px-6 py-8 shadow-sm">
            <p className={`${CAPS} text-[10px] text-[#1f3a6e]/60`}>Alias</p>
            <p className="mt-2 select-all break-all text-xl tracking-wider">{ALIAS}</p>
            <CopyAlias alias={ALIAS} />
          </div>
          <p className={`mt-8 text-sm italic text-[#1f3a6e]/70`}>Si desean dejarlo en un sobre, en el casamiento encontrarán una urna.</p>
        </Reveal>
      </section>

      {/* NOTA DE LOS NOVIOS */}
      <section aria-labelledby="novios" className="bg-white px-6 py-24 text-center">
        <Reveal className="mx-auto max-w-xl">
          <Title id="novios" caps="Unas palabras de" scriptText="Los novios" />
          <p className={`mt-8 text-lg leading-relaxed text-[#1f3a6e]/85`}>
            Gracias por ser parte de nuestra vida y por acompañarnos en este paso tan importante. Tenerlos cerca ese día es lo que más ilusión nos hace. ¡Los esperamos para celebrar juntos!
          </p>
          <p className={`${SCRIPT} ${ACCENT} mt-8 text-4xl`}>Sofi &amp; Santi</p>
        </Reveal>
      </section>

      {/* FOTOS */}
      <section aria-labelledby="fotos" className="bg-[#fbf6e9] px-6 py-24 text-center">
        <Reveal className="mx-auto max-w-xl">
          <Icon className="mx-auto h-10 w-10">{CAMERA}</Icon>
          <div className="mt-6"><Title id="fotos" caps="Compartí tus fotos" scriptText="Nuestro álbum" /></div>
          <p className={`mt-8 leading-relaxed text-[#1f3a6e]/80`}>
            Queremos ver el día a través de tus ojos. Sumate al álbum: subí las fotos que saques durante la boda y ayudanos a guardar cada momento.
          </p>
          <Divider />
          <Link href="/upload" className={BTN}>Subir fotos</Link>
        </Reveal>
      </section>

      <footer className={`bg-[#f6edd6] px-6 py-12 text-center ${CAPS} text-[10px] text-[#1f3a6e]/60`}>
        Sofi &amp; Santi · 15.11.2026
      </footer>
    </main>
  );
}
