/* ============================================================
   Samuel Čižmár — PROJEKTY · main.js
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- rok ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- menu (mobil) ---------- */
  var burger = $("#burger");
  var nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll: progress, hlavička, totop ---------- */
  var progress = $("#progress");
  var header = $("#siteHeader");
  var totop = $("#totop");

  function onScroll() {
    var h = doc.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = window.scrollY || h.scrollTop;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (totop) totop.classList.toggle("is-visible", y > 700);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  if (totop) totop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- reveal ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- scrollspy ---------- */
  var navAnchors = $$('#nav a[href^="#"]:not(.nav__cta)');
  var watched = navAnchors.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); })
                          .filter(Boolean);
  if ("IntersectionObserver" in window && watched.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute("id");
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + id);
        });
      });
    }, { threshold: 0.4, rootMargin: "-30% 0px -55% 0px" });
    watched.forEach(function (s) { spy.observe(s); });
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
        var start = performance.now(), dur = 1100;
        (function step(now) {
          var p = Math.min(1, (now - start) / dur);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- lightbox ---------- */
  var lb = $("#lightbox");
  var lbImg = $("#lightboxImg");
  var lbCap = $("#lightboxCap");
  var lbClose = $("#lightboxClose");
  var lastFocus = null;

  function openLb(src, caption, alt) {
    if (!lb || !lbImg) return;
    lastFocus = doc.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || caption || "";
    if (lbCap) lbCap.textContent = caption || "";
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    doc.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }
  function closeLb() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("is-open");
    doc.body.style.overflow = "";
    window.setTimeout(function () {
      lb.hidden = true;
      lbImg.src = "";
    }, reduce ? 0 : 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$(".shot").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = $("img", btn);
      openLb(btn.getAttribute("data-lightbox"), btn.getAttribute("data-caption"), img ? img.alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });

  onScroll();
})();
