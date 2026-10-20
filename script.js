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

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.textContent = open ? "MENÚ ☰" : "CERRAR ×";
    nav?.classList.toggle("nav-open", !open);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "MENÚ ☰";
  }));
})();