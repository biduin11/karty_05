"use client";

import { useEffect } from "react";

// Scroll-reveal animations and the sticky topbar that appears once the hero scrolls away.
export default function PageEffects() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
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
    } else {
      revealEls.forEach((el) => el.classList.add("in"));
    }

    const topbar = document.getElementById("topbar");
    const hero = document.getElementById("hero");
    let heroObserver: IntersectionObserver | undefined;
    if (topbar && hero && "IntersectionObserver" in window) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          topbar.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0 }
      );
      heroObserver.observe(hero);
    }

    return () => {
      io?.disconnect();
      heroObserver?.disconnect();
    };
  }, []);

  return null;
}
