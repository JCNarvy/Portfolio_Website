// Lightbox, project filters, and scroll reveal for carlosnarvaez portfolio

(function () {
  // ---------- Lightbox ----------
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous image">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" aria-label="Next image">&#8250;</button>' +
    '<div class="lb-caption"></div>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector("img");
  const lbCaption = lb.querySelector(".lb-caption");
  let group = [];
  let idx = 0;

  function show(i) {
    idx = (i + group.length) % group.length;
    const item = group[idx];
    lbImg.src = item.href;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.alt + (group.length > 1 ? "  (" + (idx + 1) + "/" + group.length + ")" : "");
  }
  function open(links, i) {
    group = links.map(function (a) {
      return { href: a.getAttribute("href"), alt: (a.querySelector("img") || {}).alt || "" };
    });
    show(i);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery, .teach-grid").forEach(function (container) {
    const links = Array.prototype.slice.call(container.querySelectorAll("a[href$='.jpg'], a[href$='.png']"));
    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        open(links, i);
      });
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // ---------- Project category filters ----------
  const chips = document.querySelectorAll(".chip");
  const projects = document.querySelectorAll(".project");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      const cat = chip.dataset.filter;
      projects.forEach(function (p) {
        const cats = (p.dataset.cats || "").split(" ");
        p.classList.toggle("hidden", cat !== "all" && cats.indexOf(cat) === -1);
      });
    });
  });

  // ---------- Scroll reveal ----------
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }
})();
