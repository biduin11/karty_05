"use client";

import { useEffect } from "react";

const COUNT_DURATION_MS = 1100;
const STAGGER_STEP_MS = 90;

function formatRub(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n);
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
    const eased = 1 - Math.pow(1 - t, 3);
    // Round to hundreds while counting so the digits don't flicker too much.
    const value = t < 1 ? Math.round((target * eased) / 100) * 100 : target;
    el.textContent = formatRub(value);
    if (t < 1) requestAnimationFrame(tick);
  };
  el.textContent = formatRub(0);
  requestAnimationFrame(tick);
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Scroll-driven effects for the landing page:
// - reveal / staggered reveal of blocks as they enter the viewport;
// - number count-up on prices;
// - top scroll-progress bar, hero parallax, timeline line drawn by scroll;
// - sticky topbar shown once the hero is scrolled away.
// Everything is skipped (content shown as-is) when the user prefers reduced motion.
export default function PageEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;

    document.querySelectorAll<HTMLElement>(".stagger").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--i", String(i));
      });
    });
    document.querySelectorAll<HTMLElement>(".section-head").forEach((head) => {
      head.classList.add("stagger");
      Array.from(head.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--i", String(i));
      });
    });

    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const timeline = document.getElementById("timeline");
    const timelineItems = timeline ? Array.from(timeline.querySelectorAll<HTMLElement>(".tl-item")) : [];

    if (reduceMotion || !hasIO) {
      revealEls.forEach((el) => el.classList.add("in"));
      timeline?.style.setProperty("--tl", "1");
      timelineItems.forEach((item) => item.classList.add("reached"));
    }

    let io: IntersectionObserver | undefined;
    let countIO: IntersectionObserver | undefined;
    if (!reduceMotion && hasIO) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));

      countIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            countIO!.unobserve(el);
            const group = el.closest<HTMLElement>(".stagger > *");
            const i = Number(group?.style.getPropertyValue("--i") || 0);
            window.setTimeout(() => countUp(el), 250 + i * STAGGER_STEP_MS);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => countIO!.observe(el));
    }

    const topbar = document.getElementById("topbar");
    const hero = document.getElementById("hero");
    let heroObserver: IntersectionObserver | undefined;
    if (topbar && hero && hasIO) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          topbar.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0 }
      );
      heroObserver.observe(hero);
    }

    const progressBar = document.getElementById("scrollProgress");
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const max = doc.scrollHeight - vh;
      progressBar?.style.setProperty("--scroll", String(max > 0 ? clamp01(window.scrollY / max) : 0));

      if (reduceMotion) return;

      if (hero) {
        const h = hero.offsetHeight || 1;
        hero.style.setProperty("--hero", String(clamp01(window.scrollY / h)));
      }

      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const line = vh * 0.62;
        timeline.style.setProperty("--tl", String(clamp01((line - rect.top) / rect.height)));
        timelineItems.forEach((item) => {
          item.classList.toggle("reached", item.getBoundingClientRect().top < line);
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io?.disconnect();
      countIO?.disconnect();
      heroObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
