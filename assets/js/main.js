/* ============================================================
   Samuel Čižmár — Portfólio · main.js (v24, WOW)
   Pravidlá:
   - CSS transitions pre hover / stlačenie
   - IntersectionObserver pre reveal (vstup, ease-out)
   - Rotujúce slovo písmeno po písmene
   - Symetrický vstup / výstup modálnych okien
   - Hover efekt na dotyk (tablet / mobil)
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var win = window;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- rok ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- hlavička: pozadie pri scrollovaní ---------- */
  var header = $("#header");
  var lastY = 0;
  var ticking = false;
  win.addEventListener("scroll", function () {
    lastY = win.scrollY || doc.documentElement.scrollTop;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        if (header) header.classList.toggle("is-scrolled", lastY > 24);
        ticking = false;
      });
    }
  }, { passive: true });

  /* ---------- totop ---------- */
  var totop = $("#totop");
  if (totop) {
    totop.addEventListener("click", function () {
      win.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
  win.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        if (totop) totop.classList.toggle("is-visible", (win.scrollY || doc.documentElement.scrollTop) > 700);
        ticking = false;
      });
    }
  }, { passive: true });

  /* ---------- mobilné menu ---------- */
  var burger = $("#burger");
  var menu = $("#menu");
  var menuOpen = false;
  if (burger && menu) {
    burger.addEventListener("click", function () {
      menuOpen = !menuOpen;
      menu.classList.toggle("is-open", menuOpen);
      burger.setAttribute("aria-expanded", menuOpen ? "true" : "false");
      burger.classList.toggle("is-open", menuOpen);
      doc.body.style.overflow = menuOpen ? "hidden" : "";
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menuOpen = false;
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.classList.remove("is-open");
        doc.body.style.overflow = "";
      });
    });
  }

  /* ---------- reveal ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in win && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- rotujúce povolanie ---------- */
  var rot = $("#rotate");
  if (rot) {
    var words = ["fotograf.", "kreatívec.", "retušér.", "webový nadšenec."];
    if (reduce) {
      rot.textContent = words[0];
    } else {
      var wi = 0, ci = 0, deleting = false;
      (function tick() {
        var w = words[wi];
        ci += deleting ? -1 : 1;
        rot.textContent = w.slice(0, ci);
        var delay = deleting ? 45 : 95;
        if (!deleting && ci === w.length) { deleting = true; delay = 1500; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
        win.setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- počítadlá ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in win && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        cio.unobserve(el);
        if (isNaN(target)) return;
        var start = performance.now(), dur = 1200;
        (function step(now) {
          var p = Math.min(1, (now - start) / dur);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- progress bars zručností ---------- */
  var bars = $$(".bar");
  if (bars.length && "IntersectionObserver" in win && !reduce) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-anim"); bio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { bio.observe(b); });
  } else {
    bars.forEach(function (b) { b.classList.add("is-anim"); });
  }

  /* ---------- magnetické tlačidlá ---------- */
  if (!reduce && win.matchMedia("(hover: hover)").matches) {
    $$("[data-magnet]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.setProperty("--mx", (x * 6).toFixed(1) + "px");
        el.style.setProperty("--my", (y * 6).toFixed(1) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  }

  /* ---------- kontaktný formulár (AJAX) ---------- */
  var form = $("#contactForm");
  var note = $("#formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      var hp = $(".hp", form);
      if (hp && hp.value) { e.preventDefault(); return; }
      if (!("fetch" in win)) return;

      e.preventDefault();
      var btn = $(".form__submit", form);
      var label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Odosielam…"; }
      if (note) { note.className = "form__note"; note.textContent = ""; }

      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("bad");
          if (note) { note.className = "form__note is-ok"; note.textContent = "Ďakujem! Správa odišla — ozvem sa čo najskôr."; }
          form.reset();
        })
        .catch(function () {
          if (note) { note.className = "form__note is-err"; note.textContent = "Nepodarilo sa odoslať. Napíš mi priamo na cizsamko@gmail.com."; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  }

  /* ---------- scrollspy ---------- */
  var anchors = $$('#nav a[href^="#"]:not(.btn)');
  var sections = anchors.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
  if ("IntersectionObserver" in win && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        anchors.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- modálne okná projektov ---------- */
  var viewers = $$(".modal");
  if (viewers.length) {
    var openId = null;
    var lastFocus = null;

    var unlock = function () {
      doc.documentElement.classList.remove("is-locked");
      doc.body.style.overflow = "";
    };

    var closeViewer = function () {
      if (!openId) return;
      var m = doc.getElementById(openId);
      if (m) m.hidden = true;
      openId = null;
      unlock();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    };

    var openViewer = function (m, trigger) {
      if (openId) closeViewer();
      lastFocus = trigger || null;
      m.hidden = false;
      openId = m.id;
      doc.documentElement.classList.add("is-locked");
      doc.body.style.overflow = "hidden";
      var btn = $(".modal__close", m);
      if (btn) btn.focus();
    };

    $$("[data-open]").forEach(function (t) {
      t.addEventListener("click", function () {
        var m = doc.getElementById(t.getAttribute("data-open"));
        if (m) openViewer(m, t);
      });
    });

    viewers.forEach(function (m) {
      $$("[data-close]", m).forEach(function (c) {
        c.addEventListener("click", closeViewer);
      });
      m.addEventListener("click", function (e) { if (e.target === m) closeViewer(); });
    });

    doc.addEventListener("keydown", function (e) {
      if (!openId) return;
      if (e.key === "Escape" || e.key === "Esc") { closeViewer(); return; }
      if (e.key !== "Tab") return;
      var m = doc.getElementById(openId);
      if (!m) return;
      var f = $$("a[href], button, input, textarea, select, [tabindex]:not([tabindex='-1'])", m)
        .filter(function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- hover efekt na dotyk (tablet / mobil) ---------- */
  var cardEls = $$(".card");
  if (cardEls.length) {
    var clearCards = function () {
      cardEls.forEach(function (c) { c.classList.remove("is-hover"); });
    };
    cardEls.forEach(function (c) {
      c.addEventListener("pointerdown", function (e) {
        if (e.pointerType !== "touch" && e.pointerType !== "pen") return;
        var wasOn = c.classList.contains("is-hover");
        clearCards();
        if (!wasOn) c.classList.add("is-hover");
      });
    });
    doc.addEventListener("pointerdown", function (e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest(".card")) clearCards();
    }, true);
    win.addEventListener("scroll", clearCards, { passive: true });
  }

})();
