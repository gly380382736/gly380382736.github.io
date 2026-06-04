const state = {
  projects: [],
  filter: "All",
};

const grid = document.querySelector("#project-grid");
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector(".dialog-close");

function duplicateMarquee() {
  const track = document.querySelector(".marquee-track");
  track.innerHTML += track.innerHTML;
}

function projectCard(project, index) {
  const cover = project.images[0];
  return `
    <article class="project-card reveal" data-index="${index}" tabindex="0" role="button" aria-label="查看 ${project.title} 项目详情">
      <img class="project-cover" src="${cover.src}" alt="${cover.alt}" loading="lazy" width="${cover.width}" height="${cover.height}" />
      <div class="project-meta">
        <div class="project-kicker">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span>${project.category}</span>
        </div>
        <h3>${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
    </article>
  `;
}

function renderProjects() {
  const filtered = state.filter === "All"
    ? state.projects
    : state.projects.filter((project) => project.category === state.filter);

  grid.innerHTML = filtered.map((project) => projectCard(project, state.projects.indexOf(project))).join("");
  observeReveals();
}

function openProject(index) {
  const project = state.projects[index];
  if (!project) return;

  dialogContent.innerHTML = `
    <div class="dialog-hero">
      <p class="eyebrow">${project.category}</p>
      <h3>${project.title}</h3>
      <p class="project-summary">${project.summary}</p>
      <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </div>
    <div class="dialog-gallery">
      ${project.images.map((image) => `
        <img src="${image.src}" alt="${image.alt}" loading="lazy" width="${image.width}" height="${image.height}" />
      `).join("")}
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function bindProjectClicks() {
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;
    openProject(Number(card.dataset.index));
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".project-card");
    if (!card) return;
    event.preventDefault();
    openProject(Number(card.dataset.index));
  });
}

function bindFilters() {
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
      renderProjects();
    });
  });
}

function observeReveals() {
  const reveals = document.querySelectorAll(".reveal:not(.visible)");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach((item) => observer.observe(item));
}

function bindCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  let x = window.innerWidth * .68;
  let y = window.innerHeight * .32;
  let targetX = x;
  let targetY = y;

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  }, { passive: true });

  function tick() {
    x += (targetX - x) * .08;
    y += (targetY - y) * .08;
    glow.style.transform = `translate3d(${x - 208}px, ${y - 208}px, 0)`;
    requestAnimationFrame(tick);
  }

  tick();
}

function initFluidCanvas() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const canvas = document.querySelector("#fluid-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const pointer = { x: .72, y: .32, vx: 0, vy: 0 };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", (event) => {
    const nx = event.clientX / width;
    const ny = event.clientY / height;
    pointer.vx = nx - pointer.x;
    pointer.vy = ny - pointer.y;
    pointer.x = nx;
    pointer.y = ny;
  }, { passive: true });

  function drawBlob(cx, cy, radius, colorA, colorB, wobble) {
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, colorA);
    gradient.addColorStop(.46, colorB);
    gradient.addColorStop(1, "rgba(12,12,15,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    const points = 48;
    for (let i = 0; i <= points; i++) {
      const angle = (Math.PI * 2 * i) / points;
      const wave = Math.sin(angle * 3 + time * .018 + wobble) * 0.08 + Math.cos(angle * 5 - time * .014) * 0.05;
      const r = radius * (1 + wave);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function frame() {
    time += 1;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(26px)";

    const px = pointer.x * width;
    const py = pointer.y * height;
    const scroll = window.scrollY * .06;
    drawBlob(width * .22 + Math.sin(time * .008) * 70, height * .25 + scroll, width * .36, "rgba(62,94,255,.20)", "rgba(184,124,255,.11)", 0);
    drawBlob(width * .82 + Math.cos(time * .006) * 60, height * .18 + scroll * .45, width * .30, "rgba(111,246,255,.17)", "rgba(27,101,255,.10)", 2);
    drawBlob(px + pointer.vx * 900, py + pointer.vy * 900, Math.min(width, height) * .28, "rgba(255,104,210,.18)", "rgba(111,246,255,.13)", 4);

    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";
    pointer.vx *= .92;
    pointer.vy *= .92;
    requestAnimationFrame(frame);
  }

  resize();
  frame();
}

async function loadProjects() {
  const response = await fetch("projects.json");
  state.projects = await response.json();
  renderProjects();
}

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (isBackdrop) dialog.close();
});

duplicateMarquee();
bindFilters();
bindProjectClicks();
observeReveals();
bindCursorGlow();
initFluidCanvas();
loadProjects().catch((error) => {
  console.error(error);
  grid.innerHTML = "<p class='project-summary'>项目数据加载失败，请检查 assets/projects.json。</p>";
});
