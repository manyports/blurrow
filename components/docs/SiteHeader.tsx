"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/CardShell";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Kbd } from "@/components/ui/Kbd";
import { Tabs } from "@/components/ui/Tabs";
import { formatStars } from "@/lib/format";
import { container, repo } from "@/lib/site";
import { docsNav } from "./nav";
import { ThemeToggle, useSiteTheme } from "./ThemeToggle";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "components", href: "/docs/components" },
  { label: "docs", href: "/docs" },
];

/* Which top-level link the current page belongs to */
function currentFor(pathname: string) {
  if (pathname.startsWith("/docs/components")) return 0;
  if (pathname.startsWith("/docs")) return 1;
  return -1;
}

/* One bar, the same on every screen: a floating capsule in the card
   material, the width of the page beneath it. The name on the left;
   on a desk, the links sit in a sunken well in the middle with a raised
   thumb that rests on the current page and follows the pointer, and
   search is a field you can see, with the theme key beside it. On a
   phone the links fold into a menu key, and every key is the same
   small raised key. Once the page scrolls under it, it frosts;
   scrolling down tucks it away, scrolling up brings it back.        */
const barShadow = "var(--card-shadow)";
const barShadowScrolled = "var(--bar-shadow-scrolled)";
const linkClass =
  "relative z-10 inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[9px] text-[13.5px] font-medium tracking-[-0.01em] transition-colors duration-200 cursor-pointer outline-none focus-visible:text-ink";
const keyClass =
  "relative w-9 h-9 rounded-[10px] flex items-center justify-center text-ink-label cursor-pointer active:scale-95 transition-[scale] duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const keyStyle = { background: "var(--face)", boxShadow: "var(--tile-shadow)" };

function SearchIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function SiteHeader({ stars }: { stars: number | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const theme = useSiteTheme();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Small jitters don't toggle it; only a deliberate scroll does
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > lastY && y > 160);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Things pinned under the header (the "how it's made" plate on a phone)
     read this to sit just below it, and glide up when it tucks away   */
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const set = () => {
      // layout height, not the on-screen box: that one is mid-slide when this runs
      const h = tucked && !menuOpen ? 0 : (barRef.current?.offsetHeight ?? 0);
      root.style.setProperty("--site-header-h", `${Math.max(0, Math.round(h))}px`);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [tucked, menuOpen]);

  /* ── Thumb ─────────────────────────────────────────────────────── */
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const currentIndex = currentFor(pathname);
  const [target, setTarget] = useState<number | null>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0, on: false, glide: false });

  const moveTo = (i: number | null) => {
    const el = i === null || i < 0 ? null : linkRefs.current[i];
    setTarget(el ? i : null);
    setThumb((t) =>
      el ? { left: el.offsetLeft, width: el.offsetWidth, on: true, glide: t.on } : { ...t, on: false, glide: false },
    );
  };
  const rest = () => moveTo(currentIndex >= 0 ? currentIndex : null);

  // Navigating moves the resting place; the thumb glides there
  useEffect(() => {
    rest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  /* ── Mobile menu ───────────────────────────────────────────────── */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };
  const closeMenu = () => {
    setVisible(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 320);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    // Growing past the breakpoint swaps to the desktop bar; drop the sheet
    const onResize = () => window.innerWidth >= 768 && closeMenu();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const inDocs = pathname.startsWith("/docs");

  return (
    <>
      <header className="animate-header-in sticky top-0 z-30 pointer-events-none">
        {/* The entrance animation owns the header's transform, so tucking
            happens one level in                                          */}
        <div
          ref={barRef}
          className="relative px-4 sm:px-6 pt-3 pb-2"
          style={{
            transform: tucked && !menuOpen ? "translateY(-110%)" : "none",
            transition: "transform 420ms var(--ease-out-soft)",
          }}
        >
          {/* Content scrolling up fades out before it reaches the bar's gap */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[calc(100%+12px)] bg-gradient-to-b from-page via-page/85 to-transparent transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
          <div
            className="rim relative mx-auto h-[56px] rounded-[18px] pl-5 pr-2.5 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4 pointer-events-auto backdrop-blur-xl backdrop-saturate-150"
            style={{
              maxWidth: (inDocs ? container.docs : container.site) - container.gutter * 2,
              boxShadow: scrolled ? barShadowScrolled : barShadow,
              transition: "max-width 420ms var(--ease-out-soft), box-shadow 300ms ease-out",
            }}
          >
            {/* Solid at rest, frosted once content passes beneath */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-[inherit] transition-opacity duration-300"
              style={{ background: "var(--card)", opacity: scrolled ? 0.74 : 1 }}
            />
            <Link
              href="/"
              className="group/brand relative shrink-0 justify-self-start flex items-center rounded-[6px] outline-none focus-visible:outline-2 focus-visible:outline-ink"
            >
              <span className="text-[16px] font-semibold tracking-[-0.035em] text-ink transition-opacity duration-150 group-hover/brand:opacity-60">
                blurrow<span className="text-ink-faint font-medium">/ui</span>
              </span>
            </Link>

            {/* The links, in a well cut into the bar. The raised thumb rests
                on the page you're on and follows the pointer.             */}
            <nav
              aria-label="main"
              className="relative hidden md:flex items-center gap-0.5 justify-self-center rounded-[12px] p-1"
              style={{ background: "var(--well)", boxShadow: "var(--well-shadow)" }}
              onMouseLeave={rest}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute rounded-[9px]"
                style={{
                  left: thumb.left,
                  width: thumb.width,
                  top: 4,
                  bottom: 4,
                  opacity: thumb.on ? 1 : 0,
                  background: "var(--face)",
                  boxShadow: "var(--thumb-shadow)",
                  transition: thumb.glide
                    ? "left 340ms var(--ease-out-soft), width 340ms var(--ease-out-soft), opacity 200ms ease-out"
                    : "opacity 200ms ease-out",
                }}
              />
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={item.href}
                  aria-current={i === currentIndex ? "page" : undefined}
                  onMouseEnter={() => moveTo(i)}
                  onFocus={() => moveTo(i)}
                  onBlur={rest}
                  className={[linkClass, target === i ? "text-ink" : "text-ink-muted"].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
              <a
                ref={(el) => {
                  linkRefs.current[navItems.length] = el;
                }}
                href={repo.url}
                target="_blank"
                rel="noopener"
                aria-label={stars ? `github, ${stars} stars` : "github"}
                onMouseEnter={() => moveTo(navItems.length)}
                onFocus={() => moveTo(navItems.length)}
                onBlur={rest}
                className={[linkClass, target === navItems.length ? "text-ink" : "text-ink-muted"].join(" ")}
              >
                github
                {stars ? (
                  <span className="flex items-center gap-0.5 text-[12px] tabular-nums text-ink-faint">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2.8l2.83 5.74 6.33.92-4.58 4.46 1.08 6.3L12 17.25l-5.66 2.97 1.08-6.3L2.84 9.46l6.33-.92L12 2.8z" />
                    </svg>
                    {formatStars(stars)}
                  </span>
                ) : null}
              </a>
            </nav>

            {/* Desk: search as a field you can see (it's where you type),
                then the theme key */}
            <div className="relative hidden md:flex items-center gap-2 justify-self-end">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="search components"
                className="group/search h-9 w-[clamp(150px,16vw,210px)] rounded-[11px] flex items-center gap-2 pl-3 pr-1.5 text-[13px] text-ink-faint cursor-pointer outline-none transition-[box-shadow,color] duration-150 hover:text-ink-muted hover:[box-shadow:var(--field-shadow-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                style={{ background: "var(--field)", boxShadow: "var(--field-shadow)" }}
              >
                <SearchIcon />
                <span className="flex-1 text-left">search</span>
                <Kbd>⌘K</Kbd>
              </button>
              <ThemeToggle dark={theme.dark} onToggle={theme.toggle} />
            </div>

            {/* Phone: one wide menu key; search and the theme live inside it.
                Its two bars cross into a close mark.                     */}
            <div className="relative md:hidden justify-self-end flex items-center">
              <button
                type="button"
                className={[keyClass, "w-[58px]!"].join(" ")}
                style={keyStyle}
                onClick={() => (visible ? closeMenu() : openMenu())}
                aria-label={visible ? "close menu" : "open menu"}
                aria-expanded={visible}
                aria-controls="mobile-menu"
              >
                {[-1, 1].map((side) => (
                  <span
                    key={side}
                    aria-hidden
                    className="absolute left-1/2 top-1/2 w-[18px] h-[1.5px] -ml-[9px] -mt-[0.75px] rounded-full bg-ink-soft"
                    style={{
                      transform: visible ? `rotate(${side * 45}deg)` : `translateY(${side * 3}px)`,
                      transition: "transform 360ms var(--ease-out-soft)",
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          {/* The page stays visible behind, softened rather than replaced */}
          <div
            aria-hidden
            onClick={closeMenu}
            className="absolute inset-0 backdrop-blur-md transition-opacity duration-300"
            style={{ background: "var(--menu-scrim)", opacity: visible ? 1 : 0 }}
          />

          <div
            id="mobile-menu"
            className="absolute left-4 right-4 sm:left-6 sm:right-6 top-[74px] origin-top"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(-6px) scale(0.98)",
              // Unfolds top-down out of the bar; the clip's sides reach past
              // the sheet so its shadow is never cut
              clipPath: visible ? "inset(-48px -48px -48px -48px)" : "inset(-48px -48px 70% -48px)",
              transition: visible
                ? "opacity 200ms ease-out, transform 420ms var(--ease-out-soft), clip-path 420ms var(--ease-out-soft)"
                : "opacity 180ms ease-in, transform 240ms ease-in, clip-path 240ms ease-in",
            }}
          >
            <CardShell
              rail={
                <div className="w-full grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      closeMenu();
                      setSearchOpen(true);
                    }}
                  >
                    search
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      closeMenu();
                      router.push("/docs/installation");
                    }}
                  >
                    get started
                  </Button>
                </div>
              }
            >
              <div className="max-h-[calc(100dvh-210px)] overflow-y-auto scroll-thin">
                <nav aria-label="main" className="flex flex-col p-2">
                  {navItems.map((item, i) => (
                    <React.Fragment key={item.href}>
                      {i > 0 && <span aria-hidden className="h-px mx-4 bg-ink/[0.06]" />}
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={i === currentIndex ? "page" : undefined}
                        className="group/row flex items-center justify-between gap-3 px-4 py-3.5 rounded-[12px] text-[22px] font-medium tracking-[-0.035em] text-ink active:bg-ink/[0.04] transition-colors"
                        style={{
                          animation: visible ? `menu-item-in 380ms cubic-bezier(0.22,1,0.36,1) ${90 + i * 50}ms both` : "none",
                        }}
                      >
                        <span className="flex items-center gap-2.5">
                          {i === currentIndex && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-ink" />}
                          {item.label}
                        </span>
                        <svg aria-hidden className="text-ink-ghost" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </React.Fragment>
                  ))}
                  <span aria-hidden className="h-px mx-4 bg-ink/[0.06]" />
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener"
                    onClick={closeMenu}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-[12px] text-[22px] font-medium tracking-[-0.035em] text-ink active:bg-ink/[0.04] transition-colors"
                    style={{
                      animation: visible ? `menu-item-in 380ms cubic-bezier(0.22,1,0.36,1) ${90 + navItems.length * 50}ms both` : "none",
                    }}
                  >
                    star on github
                    <span className="text-[15px] text-ink-faint tabular-nums">{stars ? `★ ${formatStars(stars)}` : "★"}</span>
                  </a>
                </nav>

                {/* The light, chosen here on a phone */}
                <div
                  className="flex items-center justify-between gap-4 border-t border-ink/[0.06] px-6 py-4"
                  style={{ animation: visible ? `menu-item-in 380ms cubic-bezier(0.22,1,0.36,1) ${140 + navItems.length * 50}ms both` : "none" }}
                >
                  <span className="text-[14px] text-ink-muted">theme</span>
                  {/* the sheet mounts fresh each time it opens, so it starts on the current choice */}
                  <Tabs
                    defaultTab={theme.choice}
                    onChange={(k) => theme.choose(k as "light" | "dark" | "system")}
                    tabs={[
                      { key: "light", label: "light" },
                      { key: "dark", label: "dark" },
                      { key: "system", label: "auto" },
                    ]}
                  />
                </div>

                {/* Inside the docs, the sidebar comes along so every page is reachable */}
                {inDocs && (
                  <div
                    className="px-6 pt-4 pb-6 border-t border-ink/[0.06] grid grid-cols-2 gap-x-6 gap-y-5"
                    style={{ animation: visible ? "menu-item-in 380ms cubic-bezier(0.22,1,0.36,1) 260ms both" : "none" }}
                  >
                    {docsNav.slice(1).map((section) => (
                      <div key={section.title} className="flex flex-col gap-1.5">
                        <p className="text-[12px] text-ink-faint">{section.title}</p>
                        {section.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={closeMenu}
                            aria-current={pathname === l.href ? "page" : undefined}
                            className={[
                              "text-[14px] py-0.5",
                              pathname === l.href ? "font-medium text-ink" : "text-ink-body",
                            ].join(" ")}
                          >
                            {l.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardShell>
          </div>
        </div>
      )}

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder="find a component…"
        sections={docsNav.map((section) => ({
          title: section.title,
          items: section.links.map((l) => ({
            key: l.href,
            label: l.title,
            onSelect: () => router.push(l.href),
          })),
        }))}
      />
    </>
  );
}
