const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(activeTab, focus = false) {
  for (const tab of tabs) {
    const selected = tab === activeTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  }
  if (focus) activeTab.focus();
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const targets = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = targets[event.key];
    if (!Number.isInteger(target)) return;
    event.preventDefault();
    selectTab(tabs[target], true);
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
  if (!reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    document.documentElement.classList.add("motion");
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  }

  const mobileBar = document.querySelector(".mobile-cta");
  const observed = new Map();
  const ctaObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) observed.set(entry.target.id, entry.isIntersecting);
    const isVisible = observed.get("inicio") === false && observed.get("oferta") === false;
    mobileBar.classList.toggle("mobile-cta-visible", isVisible);
    mobileBar.inert = !isVisible;
  });
  mobileBar.inert = true;
  ctaObserver.observe(document.querySelector("#inicio"));
  ctaObserver.observe(document.querySelector("#oferta"));
}
