function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

document.getElementById("manifesto").textContent = PANICO.manifesto;
document.getElementById("bio").textContent = PANICO.bio;
document.getElementById("year").textContent = new Date().getFullYear();

const mediaGrid = document.getElementById("media-grid");
PANICO.media.forEach(item => {
  const hasUrl = item.url && item.url.trim();
  const card = document.createElement("article");
  card.className = "media-card";
  card.innerHTML = `
    <div>
      <div class="media-type">${escapeHTML(item.type)}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
    </div>
    <a class="media-link ${hasUrl ? "" : "disabled"}" ${hasUrl ? `href="${escapeHTML(item.url)}" target="_blank" rel="noopener"` : ""}>
      ${hasUrl ? "ABRIR MATERIAL ↗" : "ENLACE POR AGREGAR"}
    </a>`;
  mediaGrid.appendChild(card);
});

const membersGrid = document.getElementById("members-grid");
PANICO.members.forEach((member, i) => {
  const card = document.createElement("article");
  card.className = "member";
  const photo = member.photo ? `<img src="${escapeHTML(member.photo)}" alt="${escapeHTML(member.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : "";
  card.innerHTML = `
    <div class="member-photo">${photo}<div class="placeholder" ${member.photo ? 'style="display:none"' : ""}>FOTO<br>POR AGREGAR</div></div>
    <div class="member-body">
      <div class="member-role">${escapeHTML(member.role)}</div>
      <h3>${escapeHTML(member.name)}</h3>
      <p>${escapeHTML(member.bio)}</p>
    </div>`;
  membersGrid.appendChild(card);
});

const merchGrid = document.getElementById("merch-grid");
PANICO.merch.forEach(item => {
  const hasUrl = item.url && item.url.trim();
  const card = document.createElement("article");
  card.className = "merch-card";
  card.innerHTML = `
    <div>
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.description)}</p>
    </div>
    <div class="price">${escapeHTML(item.price)}</div>`;
  if (hasUrl) card.style.cursor = "pointer", card.onclick = () => window.open(item.url, "_blank");
  merchGrid.appendChild(card);
});

document.getElementById("instagram").href = PANICO.band.instagram;
if(PANICO.band.contactEmail){
  const e = document.getElementById("email");
  e.textContent = PANICO.band.contactEmail;
  e.href = `mailto:${PANICO.band.contactEmail}`;
}
if(PANICO.band.bookingWhatsapp){
  const w = document.getElementById("whatsapp");
  w.textContent = PANICO.band.bookingWhatsapp;
  w.href = PANICO.band.bookingWhatsapp;
}

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
toggle?.addEventListener("click", () => {
  const open = nav.style.display === "flex";
  nav.style.display = open ? "" : "flex";
  if(!open){
    nav.style.position = "absolute";
    nav.style.top = "82px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.padding = "25px";
    nav.style.background = "#050505";
    nav.style.flexDirection = "column";
    nav.style.alignItems = "stretch";
  }
});
