/* ============================================================
   Samuel Čižmár — Portfólio · main.js
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

  /* ---------- mobilné menu ---------- */
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
  var header = $("#header");
  var totop = $("#totop");

  function onScroll() {
    var h = doc.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var y = window.scrollY || h.scrollTop;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (totop) totop.classList.toggle("is-visible", y > 600);
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
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- animácia pruhov ---------- */
  var bars = $$(".bar");
  if (bars.length && "IntersectionObserver" in window && !reduce) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-anim"); bio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { bio.observe(b); });
  } else {
    bars.forEach(function (b) { b.classList.add("is-anim"); });
  }

  /* ---------- rotujúce povolanie (typewriter) ---------- */
  var rot = $("#rotate");
  if (rot) {
    var words = ["fotograf.", "kreatívec.", "tvorca videa.", "3D modelár.", "webový nadšenec."];
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
        window.setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- scrollspy ---------- */
  var anchors = $$('#nav a[href^="#"]:not(.btn)');
  var sections = anchors.map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        anchors.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- magnetické tlačidlá ---------- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    $$("[data-magnet]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = "translate(" + (x * 6 - 2) + "px," + (y * 6 - 2) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- kontaktný formulár (AJAX) ---------- */
  var form = $("#contactForm");
  var note = $("#formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      var hp = $(".hp", form);
      if (hp && hp.value) { e.preventDefault(); return; }
      if (!("fetch" in window)) return;

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

  /* ---------- počítadlá ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
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

  onScroll();
})();
