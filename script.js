const state = { images: [], categories: new Set(), filtered: [] };

async function loadImages() {
  try {
    const res = await fetch("images.json");
    const data = await res.json();
    state.images = data;
    state.filtered = data;
    data.forEach((i) => state.categories.add(i.category));
    renderFilters();
    renderGallery();
  } catch (e) {
    console.error("Błąd ładowania images.json", e);
    document.querySelector("#gallery").innerHTML =
      '<div class="empty">Nie udało się załadować galerii.</div>';
  }
}

function renderFilters() {
  const container = document.querySelector("#filters");
  container.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "btn primary";
  allBtn.textContent = "Wszystkie";
  allBtn.onclick = () => filterBy(null);
  container.appendChild(allBtn);

  [...state.categories].sort().forEach((c) => {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = c;
    b.onclick = () => filterBy(c);
    container.appendChild(b);
  });
}

function filterBy(category) {
  if (!category) {
    state.filtered = state.images.slice();
  } else {
    state.filtered = state.images.filter((i) => i.category === category);
  }
  renderGallery();
}

function renderGallery() {
  const g = document.querySelector("#gallery");
  g.innerHTML = "";
  if (state.filtered.length === 0) {
    g.innerHTML = '<div class="empty">Brak zdjęć w tej kategorii.</div>';
    return;
  }
  state.filtered.forEach((img, idx) => {
    const card = document.createElement("div");
    card.className = "card panel";
    card.style.animation = `fadeIn .45s ease ${idx * 45}ms both`;
    const im = document.createElement("img");
    // lazy-load: set data-src and a low-quality placeholder via CSS blur
    im.setAttribute("data-src", img.src);
    im.alt = img.title || "photo";
    im.className = "lazy";
    const cap = document.createElement("div");
    cap.className = "caption";
    cap.textContent = img.title || "";
    card.appendChild(im);
    card.appendChild(cap);
    card.onclick = () => openLightbox(idx);
    g.appendChild(card);
  });
  // after DOM elements are added, initialize lazy loader
  initLazyLoading();
}

let currentIndex = 0;
function openLightbox(index) {
  currentIndex = index;
  const lb = document.querySelector(".lightbox");
  const imgEl = lb.querySelector("img");
  const meta = lb.querySelector(".meta h3");
  const desc = lb.querySelector(".meta p");
  const item = state.filtered[index];
  imgEl.src = item.src;
  meta.textContent = item.title || "";
  desc.textContent = `Kategoria: ${item.category}`;
  lb.classList.add("open");
}

function closeLightbox() {
  document.querySelector(".lightbox").classList.remove("open");
}

function nextImage(dir = 1) {
  currentIndex =
    (currentIndex + dir + state.filtered.length) % state.filtered.length;
  openLightbox(currentIndex);
}

window.addEventListener("DOMContentLoaded", () => {
  loadImages();
  document.querySelector("#closeLb").onclick = closeLightbox;
  document.querySelector("#prevLb").onclick = () => nextImage(-1);
  document.querySelector("#nextLb").onclick = () => nextImage(1);
  // keyboard navigation for lightbox
  window.addEventListener("keydown", (e) => {
    const lb = document.querySelector(".lightbox");
    if (!lb.classList.contains("open")) return;
    if (e.key === "ArrowRight") nextImage(1);
    if (e.key === "ArrowLeft") nextImage(-1);
    if (e.key === "Escape") closeLightbox();
  });
});

// Lazy-loading using IntersectionObserver with blur-up effect
function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              // start loading
              img.src = src;
              img.onload = () => {
                img.classList.remove("lazy");
                img.classList.add("loaded");
              };
              img.onerror = () => {
                img.classList.remove("lazy");
                img.classList.add("loaded");
                // fallback styling could be applied here
              };
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    lazyImages.forEach((img) => io.observe(img));
  } else {
    // fallback: load all images
    lazyImages.forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.classList.remove("lazy");
      img.classList.add("loaded");
    });
  }
}
