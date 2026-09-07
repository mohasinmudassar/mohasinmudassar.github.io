/** Progressive enhancements start after hydration and release their listeners on unmount. */
export function initializeBehaviors() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanup: (() => void)[] = [];
  const query = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));
  document.documentElement.classList.add("js-reveal");
  cleanup.push(() => document.documentElement.classList.remove("js-reveal"));

  const reveals = query(".reveal");
  query(".hero .reveal").forEach((element) => element.classList.add("in"));
  if ("IntersectionObserver" in window && !reduce) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach((element) => observer.observe(element));
    cleanup.push(() => observer.disconnect());
  } else reveals.forEach((element) => element.classList.add("in"));

  const bars = query("[data-bar]");
  const fill = (element: HTMLElement) => { element.style.width = `${element.dataset.bar}%`; };
  if ("IntersectionObserver" in window && !reduce) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { fill(entry.target as HTMLElement); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.35 });
    bars.forEach((element) => { element.style.width = "0%"; observer.observe(element); });
    cleanup.push(() => observer.disconnect());
  } else bars.forEach(fill);

  const nav = document.getElementById("nav");
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle("scrolled", y > 40);
      if (y > 320 && y > last + 4 && !nav.matches(":focus-within")) nav.classList.add("hide");
      else if (y < last - 4 || y < 200) nav.classList.remove("hide");
    }
    last = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  cleanup.push(() => window.removeEventListener("scroll", onScroll));

  const links = query("[data-navlink]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => links.forEach((link) => {
        if (link.dataset.navlink === `#${entry.target.id}`) link.classList.toggle("active", entry.isIntersecting);
      }));
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((link) => {
      const section = document.querySelector(link.dataset.navlink || "main");
      if (section) observer.observe(section);
    });
    cleanup.push(() => observer.disconnect());
  }

  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    let x = 50;
    let y = 0;
    const onMove = (event: PointerEvent) => {
      x = event.clientX / window.innerWidth * 100;
      y = event.clientY / window.innerHeight * 100;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mx", `${x}%`);
        document.documentElement.style.setProperty("--my", `${y}%`);
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    cleanup.push(() => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); });
  }
  return () => cleanup.forEach((release) => release());
}
