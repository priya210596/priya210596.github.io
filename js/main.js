(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // mobile menu
  var toggle = $(".nav-toggle"), menu = $("#menu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }); });

  // project filter
  var tabs = $$(".filters button"), cards = $$(".proj");
  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.toggle("on", t === b); t.setAttribute("aria-selected", t === b); });
      var f = b.getAttribute("data-f");
      cards.forEach(function (c) { c.hidden = !(f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) > -1); });
    });
  });

  // lightbox
  var lb = $("#lb"), lbImg = null;
  function close() { lb.hidden = true; if (lbImg) { lbImg.remove(); lbImg = null; } }
  $$(".thumb").forEach(function (t) {
    t.addEventListener("click", function () { if (lbImg) lbImg.remove(); lbImg = document.createElement("img"); lbImg.src = t.getAttribute("data-full"); lbImg.alt = $("img", t).alt; lb.appendChild(lbImg); lb.hidden = false; $("button", lb).focus(); });
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.tagName === "BUTTON") close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });

  // highlight current section in nav
  var links = $$("#menu a"), secs = links.map(function (a) { return $(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { if (s) io.observe(s); });
  }

  // contact details are assembled here so they are not sitting in the raw HTML for scrapers
  function dec(v) { try { return atob(v); } catch (e) { return ""; } }
  $$("[data-c]").forEach(function (a) { a.setAttribute("href", dec(a.getAttribute("data-c"))); });
  var cl = $("#c-lines");
  if (cl) {
    var m = dec(cl.getAttribute("data-m")), t = dec(cl.getAttribute("data-t"));
    cl.innerHTML = '<a href="mailto:' + m + '">' + m + '</a><span aria-hidden="true"> &middot; </span><a href="tel:' + t.replace(/\s/g, "") + '">' + t + '</a>';
  }

  $("#yr").textContent = new Date().getFullYear();
})();
