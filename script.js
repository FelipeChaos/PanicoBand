(() => {
  "use strict";
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  };

  setText("manifesto", PANICO.manifesto);
  setText("bio", PANICO.bio);
  setText("year", new Date().getFullYear());

  const groupPhoto = document.getElementById("group-photo");
  if (groupPhoto && PANICO.groupPhoto) {
    groupPhoto.src = PANICO.groupPhoto;
    groupPhoto.addEventListener("error", () => {
      groupPhoto.closest(".band-photo")?.classList.add("image-unavailable");
      groupPhoto.alt = "Fotografía de la banda no disponible";
    });
  }

  const mediaGrid = document.getElementById("media-grid");
  (PANICO.media || []).forEach(item => {
    const card = document.createElement("article");
    card.className = "media-card";
    const isVideo = /drive\.google\.com/.test(item.url || "") && /\/preview(?:\?|$)/.test(item.url || "");
    const photo = item.image || (!isVideo && /\.(?:jpe?g|png|webp)(?:\?.*)?$/i.test(item.url || "") ? item.url : "");
    card.innerHTML = `
      <div class="media-visual ${isVideo ? "video-visual" : "photo-visual"}">
        ${isVideo
          ? `<iframe src="${escapeHTML(item.url)}" title="${escapeHTML(item.title)} — PÁNICO" loading="lazy" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`
          : photo
            ? `<img class="media-photo" src="${escapeHTML(photo)}" alt="${escapeHTML(item.title)}" loading="lazy">`
            : `<div class="media-symbol" aria-hidden="true">PÁNICO<span>↗</span></div>`}
      </div>
      <div class="media-card-copy"><div class="media-type">${escapeHTML(item.type)}</div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p>
      ${!isVideo && item.url && !photo ? `<a class="media-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener">VER MATERIAL ↗</a>` : ""}</div>`;
    const img = card.querySelector(".media-photo");
    img?.addEventListener("error", () => {
      img.remove();
      card.querySelector(".media-visual")?.classList.add("photo-failed");
    });
    mediaGrid?.appendChild(card);
  });

  const membersGrid = document.getElementById("members-grid");
  (PANICO.members || []).forEach(member => {
    const card = document.createElement("article");
    card.className = "member";
    card.innerHTML = `
      <div class="member-photo">
        <img src="${escapeHTML(member.photo)}" alt="${escapeHTML("Fotografía de " + member.name)}" loading="lazy">
        <div class="placeholder" aria-hidden="true">${escapeHTML(member.name)}</div>
      </div>
      <div class="member-body"><div class="member-role">${escapeHTML(member.role)}</div><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.bio)}</p></div>`;
    const img = card.querySelector("img");
    img?.addEventListener("error", () => {
      img.remove();
      card.querySelector(".placeholder")?.classList.add("placeholder-visible");
    });
    membersGrid?.appendChild(card);
  });

  const merchGrid = document.getElementById("merch-grid");
  (PANICO.merch || []).forEach((item, i) => {
    const color = i === 2 ? "white" : "black";
    const garment = i === 0 ? "hoodie" : "tee";
    const logo = item.logo || (color === "white" ? "assets/logo-original-black-red.png" : "assets/logo-original-red-white.png");
    const card = document.createElement("article");
    card.className = `merch-card merch-card-${garment} merch-card-${color}`;
    card.innerHTML = `
      <div class="merch-visual merch-visual-${garment} merch-visual-${color}" role="img" aria-label="${escapeHTML(item.name)}: vista ilustrativa">
        <div class="garment-shadow"></div>
        <div class="garment-shape">
          ${garment === "hoodie" ? '<span class="hood-shape"></span><span class="hoodie-pocket"></span>' : '<span class="tee-neck"></span>'}
          <img class="merch-mark-img" src="${escapeHTML(logo)}" alt="">
        </div>
        <span class="mockup-label">VISTA ILUSTRATIVA</span>
      </div>
      <div class="merch-info">
        <div class="merch-type">PÁNICO · MERCH OFICIAL · 0${i + 1}</div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="merch-meta"><span>PRECIO</span><strong>${escapeHTML(item.price || "Por confirmar")}</strong></div>
        <div class="merch-meta"><span>TALLAS</span><strong>${escapeHTML(item.sizes || "Por confirmar")}</strong></div>
      </div>`;
    const logoImg = card.querySelector(".merch-mark-img");
    logoImg?.addEventListener("error", () => logoImg.remove());
    merchGrid?.appendChild(card);
  });


  const galleryImages = (PANICO.slideshow || []).filter(item => item && item.src);
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryCount = document.getElementById("gallery-count");
  const galleryDots = document.getElementById("gallery-dots");
  let galleryIndex = 0;
  const showGalleryImage = index => {
    if (!galleryImages.length || !galleryImage) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const item = galleryImages[galleryIndex];
    galleryImage.classList.add("is-changing");
    const nextImage = new Image();
    nextImage.onload = () => {
      galleryImage.src = item.src;
      galleryImage.alt = item.alt || "Fotografía de PÁNICO";
      galleryImage.classList.remove("is-changing");
    };
    nextImage.onerror = () => { galleryImage.classList.remove("is-changing"); galleryImage.alt = "Fotografía de PÁNICO no disponible"; };
    nextImage.src = item.src;
    if (galleryCaption) galleryCaption.textContent = item.caption || "PÁNICO · Bogotá, Colombia";
    if (galleryCount) galleryCount.textContent = String(galleryIndex + 1).padStart(2,"0") + " / " + String(galleryImages.length).padStart(2,"0");
    galleryDots?.querySelectorAll("button").forEach((button,i) => button.setAttribute("aria-current",String(i === galleryIndex)));
  };
  galleryImages.forEach((item,i) => {
    const dot = document.createElement("button");
    dot.type = "button"; dot.className = "gallery-dot";
    dot.setAttribute("aria-label", "Ver fotografía " + (i+1));
    dot.setAttribute("aria-current", String(i === 0));
    dot.addEventListener("click", () => showGalleryImage(i));
    galleryDots?.appendChild(dot);
  });
  document.getElementById("gallery-prev")?.addEventListener("click", () => showGalleryImage(galleryIndex - 1));
  document.getElementById("gallery-next")?.addEventListener("click", () => showGalleryImage(galleryIndex + 1));

  const instagram = document.getElementById("instagram");
  if (instagram && PANICO.band.instagram) instagram.href = PANICO.band.instagram;
  document.querySelectorAll(".instagram-cta").forEach(link => {
    if (PANICO.band.instagram) link.href = PANICO.band.instagram;
  });

  const email = document.getElementById("email");
  if (email && PANICO.band.contactEmail) {
    email.textContent = PANICO.band.contactEmail;
    email.href = `mailto:${PANICO.band.contactEmail}`;
  }

  const whatsapp = document.getElementById("whatsapp");
  if (whatsapp && PANICO.band.bookingWhatsapp) {
    whatsapp.textContent = "ESCRÍBENOS ↗";
    whatsapp.href = PANICO.band.bookingWhatsapp;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";
  }

  const header = document.querySelector(".site-header");
  let scrollTicking = false;
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    scrollTicking = false;
  };
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeader);
      scrollTicking = true;
    }
  }, { passive: true });
  updateHeader();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const setMenuOpen = open => {
    toggle?.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
    const label = toggle?.querySelector(".menu-label");
    if (label) label.textContent = open ? "Cerrar" : "Menú";
    toggle?.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    const icon = toggle?.querySelector('[aria-hidden="true"]');
    if (icon) icon.textContent = open ? "×" : "☰";
  };
  toggle?.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
  });
})();