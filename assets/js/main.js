/* ============================================================
   Samuel Čižmár — Fotografia & dizajn
   main.js — interakcie, ktoré majú zmysel.

   Zásady:
   - CSS rieši hover, stlačenie aj reveal tam, kde sa dá.
   - JS rieši len to, čo CSS nevie: menu, modály, rotujúce slovo,
     scrollspy, formulár a jemné doplnky.
   - prefers-reduced-motion rešpektujeme všade.
   ============================================================ */
(function () {
  "use strict";

  const doc = document;
  const win = window;
  const $ = (selector, scope) => (scope || doc).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  const reduceMotion = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- rok v päte ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- hlavička, späť nahor, scrollspy ---------- */
  const header = $("#header");
  const totop = $("#totop");
  const navLinks = $$("#nav a");
  const spySections = ["prace", "o-mne", "zrucnosti", "vzdelanie", "kontakt"]
    .map((id) => doc.getElementById(id))
    .filter(Boolean);

  let ticking = false;

  function updateScrollUI() {
    const y = win.scrollY || win.pageYOffset;

    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (totop) totop.classList.toggle("is-visible", y > 620);

    const line = y + (header ? header.offsetHeight : 68) + 48;
    let currentId = null;

    spySections.forEach((section) => {
      if (section.offsetTop <= line) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      ticking = true;
      win.requestAnimationFrame(updateScrollUI);
    }
  }

  win.addEventListener("scroll", requestScrollUpdate, { passive: true });
  win.addEventListener("resize", requestScrollUpdate, { passive: true });
  win.addEventListener("load", requestScrollUpdate);
  updateScrollUI();

  if (totop) {
    totop.addEventListener("click", () => {
      win.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- mobilné menu ---------- */
  const burger = $("#burger");
  const menu = $("#menu");
  const menuLinks = menu ? $$("a", menu) : [];
  let menuOpen = false;
  let menuCloseTimer = 0;
  let menuReturnFocus = null;

  function getMenuFocusables() {
    if (!menu) return [];
    return [burger].concat($$("a, button", menu)).filter(Boolean);
  }

  function openMenu() {
    if (!menu || !burger || menuOpen) return;
    win.clearTimeout(menuCloseTimer);
    menuOpen = true;
    menuReturnFocus = doc.activeElement;

    menu.hidden = false;
    doc.body.classList.add("is-locked");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Zavrieť menu");
    if (header) header.classList.add("is-menu-open");

    win.requestAnimationFrame(() => menu.classList.add("is-open"));

    win.setTimeout(() => {
      const first = $("a", menu);
      if (first) first.focus();
    }, 70);
  }

  function closeMenu(restoreFocus) {
    if (!menu || !burger || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Otvoriť menu");
    if (header) header.classList.remove("is-menu-open");
    doc.body.classList.remove("is-locked");

    menuCloseTimer = win.setTimeout(() => {
      menu.hidden = true;
    }, reduceMotion ? 0 : 280);

    if (restoreFocus !== false) {
      const target = menuReturnFocus && menuReturnFocus.focus
        ? menuReturnFocus
        : burger;
      if (target && target.focus) target.focus();
    }
  }

  if (burger && menu) {
    burger.addEventListener("click", () => {
      if (menuOpen) closeMenu(true);
      else openMenu();
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    doc.addEventListener("keydown", (event) => {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        const focusables = getMenuFocusables();
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    win.addEventListener("resize", () => {
      if (win.innerWidth > 820 && menuOpen) closeMenu(false);
    });
  }

  /* ---------- reveal pri scrollovaní ---------- */
  const revealEls = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in win)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- rotujúce slovo ---------- */
  const rotateEl = $("#rotate");

  if (rotateEl && !reduceMotion) {
    const words = ["portréty.", "krajinu.", "svetlo.", "detail.", "momenty."];
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = false;
    let rotateTimer = 0;

    function tickRotate() {
      if (doc.hidden) {
        rotateTimer = win.setTimeout(tickRotate, 450);
        return;
      }

      const word = words[wordIndex];

      if (deleting) {
        charIndex -= 1;
        rotateEl.textContent = word.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          charIndex = 0;
          rotateTimer = win.setTimeout(tickRotate, 120);
        } else {
          rotateTimer = win.setTimeout(tickRotate, 38);
        }
      } else {
        charIndex += 1;
        rotateEl.textContent = words[wordIndex].slice(0, charIndex);

        if (charIndex >= words[wordIndex].length) {
          deleting = true;
          rotateTimer = win.setTimeout(tickRotate, 1900);
        } else {
          rotateTimer = win.setTimeout(tickRotate, 68);
        }
      }
    }

    rotateEl.textContent = words[0];
    rotateTimer = win.setTimeout(() => {
      deleting = true;
      tickRotate();
    }, 2800);
  }

  /* ---------- karty zručností: tap / klávesnica ---------- */
  const skillCards = $$(".skill");

  function clearSkillStates(except) {
    skillCards.forEach((card) => {
      if (card !== except) card.classList.remove("is-hover");
    });
  }

  skillCards.forEach((card) => {
    card.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;
      const alreadyOn = card.classList.contains("is-hover");
      clearSkillStates(card);
      card.classList.toggle("is-hover", !alreadyOn);
    });
  });

  doc.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.target.closest(".skill")) clearSkillStates(null);
    },
    true
  );

  win.addEventListener(
    "scroll",
    () => {
      if (skillCards.some((card) => card.classList.contains("is-hover"))) {
        clearSkillStates(null);
      }
    },
    { passive: true }
  );

  /* ---------- modály projektov ---------- */
  const modals = $$(".modal");
  const pageRegions = $$(".header, main, .footer, .totop");
  let activeModal = null;
  let modalReturnFocus = null;
  let modalCloseTimer = 0;

  function setPageInert(isInert) {
    pageRegions.forEach((region) => {
      try {
        region.inert = isInert;
      } catch (error) {
        /* staršie prehliadače — focus trap to istí */
      }
    });
  }

  function openModal(modal) {
    if (!modal || activeModal) return;
    win.clearTimeout(modalCloseTimer);

    /* ak sa práve zatváral iný projekt, okamžite ho schovaj */
    modals.forEach((other) => {
      if (other !== modal) {
        other.hidden = true;
        other.classList.remove("is-open");
      }
    });

    activeModal = modal;
    modalReturnFocus = doc.activeElement;

    modal.hidden = false;
    doc.body.classList.add("is-locked");
    setPageInert(true);

    win.requestAnimationFrame(() => modal.classList.add("is-open"));

    win.setTimeout(() => {
      const closeButton = $(".modal__close", modal);
      if (closeButton && activeModal === modal) closeButton.focus();
    }, 60);
  }

  function closeModal() {
    if (!activeModal) return;

    const modal = activeModal;
    activeModal = null;

    modal.classList.remove("is-open");
    doc.body.classList.remove("is-locked");
    setPageInert(false);

    modalCloseTimer = win.setTimeout(() => {
      modal.hidden = true;
    }, reduceMotion ? 0 : 320);

    if (modalReturnFocus && modalReturnFocus.focus) {
      modalReturnFocus.focus();
    }
    modalReturnFocus = null;
  }

  $$("[data-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const id = trigger.getAttribute("data-open");
      const modal = id ? doc.getElementById(id) : null;
      openModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close]")) closeModal();
    });
  });

  doc.addEventListener("keydown", (event) => {
    if (!activeModal) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      const focusables = $$(
        "button, a[href], input, textarea, [tabindex]:not([tabindex='-1'])",
        activeModal
      ).filter((el) => el.offsetParent !== null);

      if (!focusables.length) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- kontaktný formulár ---------- */
  const form = $("#contactForm");
  const formNote = $("#formNote");

  if (form) {
    const submitButton = $(".form__submit", form);
    const originalLabel = submitButton ? submitButton.textContent : "";

    form.addEventListener("submit", function (event) {
      if (!win.fetch) return; // necháme natívne odoslanie
      event.preventDefault();

      if (form.dataset.busy === "true") return;
      form.dataset.busy = "true";

      if (formNote) {
        formNote.className = "form__note";
        formNote.textContent = "Odosielam správu…";
      }
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Odosielam…";
      }

      fetch(
        form.action.includes("formsubmit.co/ajax/")
          ? form.action
          : form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"),
        {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.text();
        })
        .then((text) => {
          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (error) {
            data = null;
          }
          if (data && String(data.success) === "false") {
            throw new Error("FormSubmit rejected");
          }

          form.reset();
          if (formNote) {
            formNote.className = "form__note is-ok";
            formNote.textContent =
              "Ďakujem! Správa odišla. Ozvem sa čo najskôr.";
          }
          if (submitButton) submitButton.textContent = "Odoslané";

          win.setTimeout(() => {
            if (submitButton) submitButton.textContent = originalLabel;
          }, 4000);
        })
        .catch(() => {
          if (formNote) {
            formNote.className = "form__note is-err";
            formNote.innerHTML =
              'Nepodarilo sa odoslať. Skús znova alebo napíš na <a href="mailto:cizsamko@gmail.com">cizsamko@gmail.com</a>.';
          }
          if (submitButton) submitButton.textContent = originalLabel;
        })
        .finally(() => {
          form.dataset.busy = "false";
          if (submitButton) submitButton.disabled = false;
        });
    });
  }
})();
