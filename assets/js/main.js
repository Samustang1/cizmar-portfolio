/* ============================================================
   Samuel Čižmár — Portfólio · main.js (v34, štýl filipglemba)
   Čistý, minimalistický JavaScript.
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

  /* ---------- scrollspy pre hlavičku ---------- */
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

})();
