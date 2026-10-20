/* ============================================================
   Samuel Čižmár — Portfólio v2 · main.js
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- rok ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- loader ---------- */
  var loader = $("#loader");
  function hideLoader() { if (loader) loader.classList.add("is-done"); }
  window.addEventListener("load", function () { setTimeout(hideLoader, 350); });
  setTimeout(hideLoader, 2600); // poistka

  /* ---------- menu ---------- */
  var burger = $("#burger");
  var links = $("#navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll: progress, nav, totop ---------- */
  var progress = $("#progress");
  var nav = $("#nav");
  var totop = $("#totop");
  function onScroll() {
    var h = doc.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    var y = window.scrollY || h.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 24);
    if (totop) totop.classList.toggle("is-visible", y > 640);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  if (totop) totop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- reveal ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- scrollspy ---------- */
  var sections = $$("main section[id]");
  var navAnchors = $$('#navLinks a[href^="#"]');
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute("id");
        navAnchors.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + id); });
      });
    }, { threshold: 0.35, rootMargin: "-22% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- glow cursor ---------- */
  var glow = $("#glowCursor");
  if (glow && fine && !reduce) {
    var gx = 0, gy = 0, cx = 0, cy = 0, run = false;
    var loop = function () {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      glow.style.opacity = "1";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) requestAnimationFrame(loop); else run = false;
    };
    doc.addEventListener("mousemove", function (e) { gx = e.clientX; gy = e.clientY; if (!run) { run = true; requestAnimationFrame(loop); } });
    doc.addEventListener("mouseleave", function () { glow.style.opacity = "0"; });
  }

  /* ---------- hero tilt ---------- */
  var heroImg = $("#heroVisual");
  if (heroImg && fine && !reduce) {
    var frame = $(".hero__frame", heroImg);
    heroImg.addEventListener("mousemove", function (e) {
      var r = heroImg.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = "rotateY(" + (nx * 8) + "deg) rotateX(" + (-ny * 8) + "deg) translateZ(18px)";
    });
    heroImg.addEventListener("mouseleave", function () { frame.style.transform = "none"; });
  }

  /* ---------- magnetické tlačidlá ---------- */
  if (fine && !reduce) {
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (mx * 0.28) + "px," + (my * 0.45) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = "none"; });
    });
  }

  /* ---------- spotlight v kartách zručností ---------- */
  if (fine) {
    $$(".skill").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- počítadlá ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        cio.unobserve(el);
        if (isNaN(target) || target > 100) { el.textContent = String(target); return; }
        var start = performance.now(), dur = 1200;
        (function step(now) {
          var p = Math.min(1, (now - start) / dur);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- formulár ---------- */
  var form = $("#contactForm");
  if (form) {
    var note = $("#formNote");
    var btn = $(".form__submit", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (note) { note.textContent = "Odosielam…"; note.className = "form__note"; }
      if (btn) { btn.disabled = true; btn.textContent = "Odosielam…"; }
      var endpoint = form.getAttribute("action").replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(endpoint, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error("chyba");
          if (note) { note.textContent = "Hotovo — správa odoslaná. Ozvem sa čo najskôr. ✅"; note.className = "form__note is-success"; }
          form.reset();
        })
        .catch(function () {
          if (note) { note.textContent = "Nepodarilo sa odoslať. Skús znova alebo napíš na cizsamko@gmail.com."; note.className = "form__note is-error"; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = "Odoslať správu"; } });
    });
  }

  onScroll();
})();
