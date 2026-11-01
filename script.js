const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navLinks.classList.remove("is-open");
    }
  });
}

if (navLinks) {
  const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')]
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((item) => item.section);
  let scheduled = false;

  const updateActiveSection = () => {
    const focusPoint = window.innerHeight / 2;
    const activeItem = sectionLinks.find(({ section }) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= focusPoint && bounds.bottom > focusPoint;
    });

    sectionLinks.forEach(({ link }) => {
      const isActive = link === activeItem?.link;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    scheduled = false;
  };

  const scheduleActiveSectionUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  };

  window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", scheduleActiveSectionUpdate);
  updateActiveSection();
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const typingText = document.querySelector(".typing-text");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingText && !reducedMotion) {
  const specialties = [
    "Data Analytics",
    "Cloud Technology",
    "Business Intelligence",
    "Automation","Project Management",
    "Artificial Intelligence","Governance","Sustainability"
  ];
  let specialtyIndex = 0;

  const typeSpecialty = () => {
    const specialty = specialties[specialtyIndex];
    let characterIndex = 0;
    typingText.textContent = "";

    const typeNextCharacter = () => {
      typingText.textContent = specialty.slice(0, characterIndex + 1);
      characterIndex += 1;

      if (characterIndex < specialty.length) {
        window.setTimeout(typeNextCharacter, 75);
        return;
      }

      window.setTimeout(() => {
        const eraseNextCharacter = () => {
          typingText.textContent = specialty.slice(0, characterIndex - 1);
          characterIndex -= 1;

          if (characterIndex > 0) {
            window.setTimeout(eraseNextCharacter, 35);
            return;
          }

          specialtyIndex = (specialtyIndex + 1) % specialties.length;
          window.setTimeout(typeSpecialty, 250);
        };

        eraseNextCharacter();
      }, 1300);
    };

    typeNextCharacter();
  };

  window.setTimeout(typeSpecialty, 1400);
}
