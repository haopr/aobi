require(["gitbook"], function (gitbook) {
  function ensureHomeLink() {
    var header = document.querySelector(".book-header h1 a, .book-header .btn.pull-left");
    if (document.querySelector(".tt-home-link")) {
      return;
    }

    var link = document.createElement("a");
    link.className = "tt-home-link";
    link.href = "../index.html";
    link.textContent = "返回仓库首页";

    var host = document.querySelector(".book-header");
    if (host) {
      host.appendChild(link);
    }
  }

  function ensureDock() {
    if (document.querySelector(".aobi-dock")) {
      return;
    }

    var dock = document.createElement("nav");
    dock.className = "aobi-dock";
    dock.setAttribute("aria-label", "仓库入口");
    dock.innerHTML =
      '<div class="tab-dock">' +
        '<div class="tab-bg"></div>' +
        '<a class="tab-icon tab-map" href="/aobi/wiki/maps/" aria-label="地图"></a>' +
        '<div class="tab-links">' +
          '<a class="tab-button tab-button-short" href="/aobi/wiki/">Wiki</a>' +
          '<a class="tab-button tab-button-long" href="/aobi/wiki/">图书馆二楼</a>' +
          '<a class="tab-button tab-button-long" href="/aobi/wiki/">监控室</a>' +
          '<a class="tab-button tab-button-long" href="/aobi/wiki/">神秘世界</a>' +
        '</div>' +
        '<a class="tab-icon tab-home" href="/aobi/" aria-label="首页"></a>' +
      '</div>';
    document.body.appendChild(dock);
  }

  function ensureLightbox() {
    if (document.querySelector(".tt-lightbox")) {
      return document.querySelector(".tt-lightbox");
    }

    var box = document.createElement("div");
    box.className = "tt-lightbox";
    box.innerHTML = "<img alt=''>";
    box.addEventListener("click", function () {
      box.classList.remove("is-open");
    });
    document.body.appendChild(box);
    return box;
  }

  function bindImages() {
    var box = ensureLightbox();
    var img = box.querySelector("img");
    var nodes = document.querySelectorAll(".markdown-section img");

    Array.prototype.forEach.call(nodes, function (node) {
      if (node.dataset.ttZoomBound) {
        return;
      }
      node.dataset.ttZoomBound = "1";
      node.classList.add("tt-img");
      node.addEventListener("click", function () {
        img.src = node.src;
        img.alt = node.alt || "";
        box.classList.add("is-open");
      });
    });
  }

  gitbook.events.bind("page.change", function () {
    ensureHomeLink();
    ensureDock();
    bindImages();
  });
});
