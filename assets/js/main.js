/* ============================================================
   Samuel Čižmár — Osobné portfólio · main.js
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------- Rok v pätičke ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobilné menu ---------- */
  var burger = $("#burger");
  var nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Progress bar ---------- */
  var progress = $("#progress");
  function onScrollProgress() {
    if (!progress) return;
    var h = doc.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    progress.style.transform = "scaleX(" + p + ")";
  }

  /* ---------- Tlačidlo nahor + tieň hlavičky ---------- */
  var toTop = $("#toTop");
  var hud = $("#hud");
  function onScrollMisc() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (toTop) toTop.classList.toggle("is-visible", y > 500);
    if (hud) hud.style.boxShadow = y > 10 ? "0 10px 30px rgba(0,0,0,.45)" : "none";
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Aktívny odkaz v menu ---------- */
  var sections = $$("section[id]");
  var navLinks = $$('#nav a[href^="#"]');
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute("id");
        navLinks.forEach(function (l) {
          l.classList.toggle("is-current", l.getAttribute("href") === "#" + id);
        });
      });
    }, { threshold: 0.4, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Cursor glow + hero parallax ---------- */
  var glow = $("#cursorGlow");
  var tilt = $("#tilt");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  if (glow && fine && !reduce) {
    var gx = 0, gy = 0, cx = 0, cy = 0, running = false;
    var render = function () {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      glow.style.opacity = "1";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
        requestAnimationFrame(render);
      } else {
        running = false;
      }
    };
    doc.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!running) { running = true; requestAnimationFrame(render); }
    });
    doc.addEventListener("mouseleave", function () { if (glow) glow.style.opacity = "0"; });
  }

  if (tilt && fine && !reduce) {
    var host = tilt.closest(".hero__grid") || doc;
    host.addEventListener("mousemove", function (e) {
      var r = host.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "translate3d(" + (-nx * 16) + "px," + (-ny * 16) + "px,0) rotate(" + (nx * 1.5) + "deg)";
    });
    host.addEventListener("mouseleave", function () { tilt.style.transform = "none"; });
  }

  /* ---------- Scroll listeners ---------- */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollProgress();
      onScrollMisc();
      ticking = false;
    });
  }, { passive: true });
  onScrollProgress();
  onScrollMisc();

  /* ---------- Formulár (AJAX → FormSubmit) ---------- */
  var form = $("#contactForm");
  if (form) {
    var note = $("#formNote");
    var submitBtn = $(".form__submit", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (note) { note.textContent = "Odosielam…"; note.className = "form__note"; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Odosielam…"; }

      // AJAX endpoint pre FormSubmit
      var endpoint = form.getAttribute("action").replace("formsubmit.co/", "formsubmit.co/ajax/");

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (r.ok) {
            if (note) { note.textContent = "Hotovo! Správa odoslaná — ozvem sa čo najskôr. ✅"; note.className = "form__note is-success"; }
            form.reset();
          } else {
            throw new Error((r.data && r.data.message) || "Chyba");
          }
        })
        .catch(function () {
          if (note) { note.textContent = "Nepodarilo sa odoslať. Skús to znova alebo napíš na cizsamko@gmail.com."; note.className = "form__note is-error"; }
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Odoslať správu"; }
        });
    });
  }
})();
