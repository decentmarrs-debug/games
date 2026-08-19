(function () {
  const pages = [
    { href: "/", label: "首页" },
    { href: "/pages/today.html", label: "Today" },
    { href: "/pages/apps.html", label: "Apps" },
    { href: "/pages/youtube.html", label: "YouTube" },
  ];

  const bar = document.createElement("div");
  bar.id = "local-snapshot-bar";
  const here = location.pathname;
  bar.innerHTML =
    pages
      .map(function (p) {
        const active = here === p.href || (p.href !== "/" && here.endsWith(p.href));
        return '<a class="' + (active ? "is-active" : "") + '" href="' + p.href + '">' + p.label + "</a>";
      })
      .join("") +
    '<span class="hint">本地快照 · 图片走 Apple CDN</span>';
  document.body.insertBefore(bar, document.body.firstChild);

  document.querySelectorAll(".artwork-component").forEach(function (el) {
    el.classList.add("artwork-component--downloaded");
  });

  document.querySelectorAll(".artwork-container").forEach(function (el) {
    if (el.querySelector("img, video, picture, source")) return;
    const item = el.closest(".shelf-grid__list-item");
    if (item) item.style.display = "none";
  });

  document.querySelectorAll("picture").forEach(function (pic) {
    const img = pic.querySelector("img");
    const source = pic.querySelector("source[srcset]");
    if (!img || !source) return;
    const first = source.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0];
    if (first) {
      img.setAttribute("src", first);
    }
    img.style.opacity = "1";
    if (img.closest(".shelf-grid__list--grid-type-ScreenshotPhone")) {
      img.removeAttribute("loading");
      img.loading = "eager";
    }
    img.addEventListener("error", function () {
      const jpg = pic.querySelector('source[type="image/jpeg"]');
      if (!jpg) return;
      const fallback = jpg.getAttribute("srcset").split(",")[0].trim().split(/\s+/)[0];
      if (fallback && img.src !== fallback) img.src = fallback;
    });
  });

  const map = [
    [/\/us\/iphone\/today\/?$/, "/pages/today.html"],
    [/\/us\/iphone\/apps\/?$/, "/pages/apps.html"],
    [/\/us\/app\/youtube\/id544007664\/?$/, "/pages/youtube.html"],
  ];
  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a || !a.href) return;
    try {
      const u = new URL(a.href, location.href);
      for (let i = 0; i < map.length; i++) {
        if (map[i][0].test(u.pathname)) {
          e.preventDefault();
          location.href = map[i][1];
          return;
        }
      }
    } catch (_) {}
  });
})();
