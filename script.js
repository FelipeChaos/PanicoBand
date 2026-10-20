function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
const drivePreview = url => {
  const match = String(url || "").match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
};
document.getElementById("manifesto").textContent = PANICO.manifesto;
document.getElementById("bio").textContent = PANICO.bio;
document.getElementById("year").textContent = new Date().getFullYear();

const groupPhoto = document.getElementById("group-photo");
if (groupPhoto && PANICO.groupPhoto) {
  groupPhoto.src = PANICO.groupPhoto;
  groupPhoto.addEventListener("error", () => { groupPhoto.closest(".band-photo")?.classList.add("image-unavailable"); });
}
const mediaGrid = document.getElementById("media-grid");
PANICO.media.forEach(item => {
  const card = document.createElement("article");
  card.className = "media-card";
  const isVideo = /preview$/.test(item.url || "") && /drive\.google\.com/.test(item.url || "");
  card.innerHTML = `
    <div class="media-visual ${isVideo ? "video-visual" : "photo-visual"}">
      ${isVideo ? `<iframe src="${escapeHTML(item.url)}" title="${escapeHTML(item.title)} — PÁNICO" loading="lazy" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>` : `<div class="media-symbol" aria-hidden="true">PÁNICO<span>↗</span></div>`}
    </div>
    <div class="media-card-copy"><div class="media-type">${escapeHTML(item.type)}</div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p>
    ${!isVideo && item.url ? `<a class="media-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener">VER MATERIAL ↗</a>` : ""}</div>`;
  mediaGrid.appendChild(card);
});

const membersGrid = document.getElementById("members-grid");
PANICO.members.forEach(member => {
  const card = document.createElement("article");
  card.className = "member";
  card.innerHTML = `
    <div class="member-photo">
      <img src="${escapeHTML(member.photo)}" alt="Foto de ${escapeHTML(member.name)}" loading="lazy">
      <div class="placeholder" aria-hidden="true">PÁNICO</div>
    </div>
    <div class="member-body"><div class="member-role">${escapeHTML(member.role)}</div><h3>${escapeHTML(member.name)}</h3><p>${escapeHTML(member.bio)}</p></div>`;
  const img = card.querySelector("img");
  img.addEventListener("error", () => { img.style.display = "none"; card.querySelector(".placeholder").style.display = "grid"; });
  membersGrid.appendChild(card);
});

const merchGrid = document.getElementById("merch-grid");
PANICO.merch.forEach((item, i) => {
  const card = document.createElement("article");
  card.className = "merch-card";
  card.innerHTML = `
    <div class="merch-visual merch-visual-${i + 1}" aria-hidden="true"><span class="merch-garment">${i === 0 ? "HOODIE" : "TEE"}</span><span class="merch-mark">PÁNICO</span></div>
    <div class="merch-info"><div class="merch-type">MERCH OFICIAL · 0${i + 1}</div><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.description)}</p><div class="merch-meta"><span>PRECIO</span><strong>${escapeHTML(item.price)}</strong></div><div class="merch-meta"><span>TALLAS</span><strong>${escapeHTML(item.sizes)}</strong></div></div>`;
  merchGrid.appendChild(card);
});

const instagram = document.getElementById("instagram");
if (instagram) instagram.href = PANICO.band.instagram;
if (PANICO.band.contactEmail) {
  const email = document.getElementById("email");
  email.textContent = PANICO.band.contactEmail;
  email.href = `mailto:${PANICO.band.contactEmail}`;
} else {
  document.getElementById("email")?.setAttribute("aria-label", "Correo electrónico por confirmar");
}
if (PANICO.band.bookingWhatsapp) {
  const whatsapp = document.getElementById("whatsapp");
  whatsapp.textContent = "ESCRÍBENOS ↗";
  whatsapp.href = PANICO.band.bookingWhatsapp;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";
}
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  toggle.textContent = isOpen ? "MENÚ ☰" : "CERRAR ×";
  nav.classList.toggle("nav-open", !isOpen);
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("nav-open");
  toggle?.setAttribute("aria-expanded", "false");
  if (toggle) toggle.textContent = "MENÚ ☰";
}));
