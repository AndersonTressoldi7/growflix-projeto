const imageLinks = [
  "https://i.ytimg.com/vi/GDsF3rd7aTk/hqdefault.jpg",
  "https://i.ytimg.com/vi/EHrTvRtp7VM/hq720.jpg",
  "https://i.ytimg.com/vi/8sHrgdszq5s/hqdefault.jpg",
  "https://growdev.com.br/wp-content/uploads/2025/04/Captura-de-tela-2025-04-25-135234.webp",
  "https://i.ytimg.com/vi/ETN4EWZ-Zls/hqdefault.jpg",
  "https://i.ytimg.com/vi/i-1rK_Oz3ag/hqdefault.jpg",
  "https://growdev.com.br/wp-content/uploads/2025/05/6cf1f9fa-f1bf-4b67-a28e-e3320f1cc572-1024x585.png"
];

const categories = ["growcast", "webinar", "jornada-row", "diversos-row"];

function extractYouTubeIdFromImg(url) {
  const m = url.match(/\/vi\/([^\/?#]+)/);
  return m ? m[1] : null;
}

const allVideos = [];
for (let i = 0; i < 20; i++) {
  const category = categories[i % categories.length];
  const img = imageLinks[i % imageLinks.length];
  const ytId = extractYouTubeIdFromImg(img);

  allVideos.push({
    id: ytId || `video${i+1}`,
    category: category,
    title_main: `${category.toUpperCase()} Título ${i + 1}`,
    title_secondary: `Descrição do vídeo ${i + 1}`,
    img: img,
    link: ytId ? `https://www.youtube.com/embed/${ytId}` : ""
  });
}

function renderCards() {
  const sections = {
    'growcast': document.getElementById('growcast-row'),
    'webinar': document.getElementById('webinar-row'),
    'jornada-row': document.getElementById('jornada-row'),
    'diversos-row': document.getElementById('diversos-row')
  };

  allVideos.forEach(video => {
    const targetElement = sections[video.category];
    if (!targetElement) return;

    const toggleAttrs = video.link
      ? `data-bs-toggle="modal" data-bs-target="#playerModal" data-video-link="${video.link}"`
      : "";

    const cardHTML = `
      <div class="video-card" ${toggleAttrs}>
        <img src="${video.img}" alt="${video.title_main}">
        <div class="video-card-info">
          <p>${video.title_main}</p>
          <p>${video.title_secondary}</p>
        </div>
      </div>`;
    targetElement.insertAdjacentHTML("beforeend", cardHTML);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderCards();

  // Botões de scroll lateral
  const scrollButtons = document.querySelectorAll(".btn-scroll");
  scrollButtons.forEach(button => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const direction = parseInt(this.getAttribute("data-dir"));
      const targetRow = document.getElementById(targetId);
      if (targetRow) {
        const scrollStep = 260 * direction * 3;
        targetRow.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    });
  });

  // Modal do player
  const playerModal = document.getElementById("playerModal");
  const playerIframe = document.getElementById("playerIframe");

  if (playerModal && playerIframe) {
    playerModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      if (!button) return;
      const videoLink = button.getAttribute("data-video-link");
      if (videoLink) {
        const sep = videoLink.includes("?") ? "&" : "?";
        playerIframe.src = `${videoLink}${sep}autoplay=1&rel=0`;
      }
    });

    playerModal.addEventListener("hidden.bs.modal", function () {
      playerIframe.src = "";
    });
  }
});
