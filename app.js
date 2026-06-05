const state = {
  projects: [],
  filter: "All",
};

const grid = document.querySelector("#project-grid");
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeDialog = document.querySelector(".dialog-close");

const projectCopy = {
  "开心荟": {
    summary: "面向创业服务人群的移动端产品，整合活动报名、人才岗位、空间场地与个人服务入口，整体气质更轻快、亲和。",
    focus: ["梳理首页资源入口，降低活动、人才、场地之间的查找成本", "用卡片和状态标签突出报名、岗位、详情等关键动作", "保持移动端长页面的信息节奏，让服务内容更容易连续浏览"],
    outcome: "形成从发现服务、查看详情到报名/联系的完整移动端体验链路。"
  },
  "科技厅移动端": {
    summary: "围绕科技服务和项目跟踪的移动端设计，覆盖需求详情、资源管理、项目进度填写与我的需求等业务场景。",
    focus: ["把高密度政务业务拆成首页概览、详情查看和流程跟进", "强化表单填写、状态反馈和项目节点的可读性", "通过蓝色科技感视觉保持专业、可信的产品气质"],
    outcome: "让移动端也能承载需求流转、走访记录和项目跟踪等复杂操作。"
  },
  "杭州妇联项目": {
    summary: "妇联婚恋服务类移动端界面，围绕红娘管理、人员信息、详情查看和个人中心建立温和清晰的服务体验。",
    focus: ["用柔和色彩和清晰头像信息降低婚恋服务的距离感", "整理人员管理、信息填写、详情页之间的操作路径", "在首页与个人中心中突出服务状态和后续行动"],
    outcome: "兼顾社区服务的亲和表达与后台式人员管理的效率需求。"
  },
  "科技厅 PC 管理平台": {
    summary: "科技厅政企协作管理平台，面向技术经理人、企业、项目视角和批量查询等复杂后台场景。",
    focus: ["建立高信息密度表格、筛选、详情页的统一后台框架", "区分不同角色视角，保证企业、经理人与项目数据各有重点", "用清晰的状态、指标和操作按钮提升后台处理效率"],
    outcome: "把多角色、多流程、多数据的政务平台组织成稳定可扩展的 SaaS 体验。"
  },
  "白马湖实验室": {
    summary: "实验室协同管理平台，重点呈现任务管理、日志统计、日志论坛和组织协作流程。",
    focus: ["通过任务列表、统计图表和论坛内容建立协作闭环", "让日志沉淀、任务流转和数据统计在同一系统内保持一致", "使用简洁后台组件承载实验室日常管理的高频操作"],
    outcome: "提升实验室成员在任务追踪、日志复盘和协作沟通中的管理效率。"
  },
  "杭州市委门户": {
    summary: "政务门户首页设计，重点解决信息入口多、内容层级深、新闻与服务并列展示的问题。",
    focus: ["建立首屏重点信息、栏目导航和内容列表的清晰秩序", "通过留白、分组和视觉权重提高政务信息可读性", "保持门户页面正式、稳定、可信的视觉表达"],
    outcome: "让大量政务内容在首页中有明确层级，便于快速浏览和定位。"
  },
  "政法态势分析": {
    summary: "政法态势分析类数据界面，围绕数智中心、重点指标、趋势分析和空间态势组织信息。",
    focus: ["突出核心指标、态势总览和专题模块之间的优先级", "用深色数据视觉强化监测中心的专业感和空间感", "在图表、地图和列表之间保持稳定的信息节奏"],
    outcome: "支持管理者快速理解重点态势、异常变化和区域分布。"
  },
  "松阳大屏": {
    summary: "党建与产业发展可视化大屏，覆盖产业发展、智慧帮扶、组织关系和党员信息等专题。",
    focus: ["把不同专题统一到同一套深色大屏视觉系统中", "突出地图、指标卡、趋势图和关系信息的层级", "保证远距离观看时标题、数字和模块边界足够清晰"],
    outcome: "形成适合会议展示和指挥汇报的区域数据看板。"
  },
  "三门驾驶舱": {
    summary: "区域治理驾驶舱视觉设计，围绕核心指标、地图区域、数据态势和专题模块展开。",
    focus: ["以地图为中心组织周边数据模块，强化驾驶舱空间结构", "通过蓝色科技风与发光线框建立实时监测氛围", "平衡装饰感和可读性，确保指标信息优先被看见"],
    outcome: "呈现适合区域总览、趋势判断和重点监测的大屏首页体验。"
  },
  "重庆妇联大屏": {
    summary: "妇联业务主题大屏，覆盖组织建设、家庭教育、关爱维权、成长发展和评价监测等模块。",
    focus: ["把多条业务线拆成可切换的专题大屏页面", "用柔和但清晰的深色数据视觉承载公共服务主题", "通过指标、图表和排行结构呈现重点工作成果"],
    outcome: "帮助业务方从组织、服务和监测维度整体查看妇联工作进展。"
  },
  "萧山大屏": {
    summary: "区域数据看板视觉探索，包含深色与浅色主题模板，强调模块化布局和场景适配。",
    focus: ["探索不同主题背景下的数据模块、地图和图表样式", "建立可复用的大屏模板结构，便于替换不同业务内容", "保证浅色与深色方案都具备清晰的信息层级"],
    outcome: "沉淀一套可用于区域数据展示的视觉模板方向。"
  },
  "数据中台驾驶舱": {
    summary: "数据中台驾驶舱与专题页设计，覆盖数据治理、数据开发、运维监控、数据运营等平台能力。",
    focus: ["围绕数据全生命周期组织首页和专题导航", "把治理、开发、监控、运营等能力拆解为可视化模块", "使用科技感深色界面强化数据平台的统一品牌感"],
    outcome: "让数据中台能力以更直观的方式被管理者和业务人员理解。"
  }
};

function duplicateMarquee() {
  const track = document.querySelector(".marquee-track");
  track.innerHTML += track.innerHTML;
}

function narrative(project) {
  const copy = projectCopy[project.title] || {};
  const screens = project.pick && project.pick.length ? project.pick : project.images.map((image) => image.alt.split(" - ").pop());
  const type = project.category === "App Design" ? "移动端体验" : project.category === "Admin Platform" ? "管理平台体验" : "数据可视化体验";

  return {
    summary: copy.summary || project.summary,
    positioning: `${project.title} 是一个${type}项目，主要覆盖 ${screens.slice(0, 4).join("、")} 等界面场景。`,
    focus: copy.focus || screens.slice(0, 3).map((screen) => `围绕「${screen}」页面优化信息层级、视觉秩序与关键操作路径`),
    outcome: copy.outcome || `通过 ${project.images.length} 张核心界面展示从页面结构到视觉细节的完整设计表达。`
  };
}

function projectCard(project, index) {
  const cover = project.images[0];
  const floats = project.images.slice(1, 3);
  const copy = narrative(project);

  return `
    <article class="project-card reveal" data-index="${index}" tabindex="0" role="button" aria-label="查看 ${project.title} 项目详情">
      <div class="project-media">
        <img class="project-cover" src="${cover.src}" alt="${cover.alt}" loading="lazy" width="${cover.width}" height="${cover.height}" />
        <div class="project-float">
          ${floats.map((image) => `<img src="${image.src}" alt="${image.alt}" loading="lazy" width="${image.width}" height="${image.height}" />`).join("")}
        </div>
      </div>
      <div class="project-meta">
        <div class="project-kicker">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span>${project.category}</span>
        </div>
        <h3>${project.title}</h3>
        <p class="project-summary">${copy.summary}</p>
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
  const copy = narrative(project);
  const isAppProject = project.category === "App Design";
  const galleryMarkup = isAppProject
    ? `
      <div class="app-gallery-shell">
        <div class="app-gallery-head">
          <span>Mobile screens</span>
          <div class="app-gallery-actions">
            <button class="gallery-nav prev" type="button" aria-label="上一组 App 页面">‹</button>
            <button class="gallery-nav next" type="button" aria-label="下一组 App 页面">›</button>
          </div>
        </div>
        <div class="app-gallery" tabindex="0" aria-label="${project.title} App 页面横向浏览">
          ${project.images.map((image, imageIndex) => `
            <article class="app-screen-card">
              <span>${String(imageIndex + 1).padStart(2, "0")}</span>
              <img src="${image.src}" alt="${image.alt}" loading="lazy" width="${image.width}" height="${image.height}" />
            </article>
          `).join("")}
        </div>
      </div>
    `
    : `
      <div class="dialog-gallery">
        ${project.images.map((image) => `
          <img src="${image.src}" alt="${image.alt}" loading="lazy" width="${image.width}" height="${image.height}" />
        `).join("")}
      </div>
    `;

  dialogContent.innerHTML = `
    <div class="dialog-hero">
      <p class="eyebrow">${project.category}</p>
      <h3>${project.title}</h3>
      <p class="project-summary">${copy.summary}</p>
      <div class="tag-list">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <div class="case-grid">
        <article class="case-card">
          <strong>项目定位</strong>
          <p class="case-detail">${copy.positioning}</p>
        </article>
        <article class="case-card">
          <strong>设计重点</strong>
          <ul class="case-list">${copy.focus.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="case-card">
          <strong>成果表达</strong>
          <p class="case-detail">${copy.outcome}</p>
        </article>
      </div>
    </div>
    ${galleryMarkup}
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  if (isAppProject) bindAppGallery(dialogContent);
}

function bindAppGallery(root) {
  const gallery = root.querySelector(".app-gallery");
  const prev = root.querySelector(".gallery-nav.prev");
  const next = root.querySelector(".gallery-nav.next");
  if (!gallery || !prev || !next) return;

  const scrollGallery = (direction) => {
    const firstCard = gallery.querySelector(".app-screen-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : gallery.clientWidth / 3;
    gallery.scrollBy({
      left: direction * (cardWidth + 18),
      behavior: "smooth",
    });
  };

  prev.addEventListener("click", () => scrollGallery(-1));
  next.addEventListener("click", () => scrollGallery(1));
}

function bindProjectClicks() {
  grid.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  });

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
  if (!glow) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

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
  let lastFrame = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.15);
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
    const points = 26;
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

  function frame(now) {
    if (now - lastFrame < 33) {
      requestAnimationFrame(frame);
      return;
    }
    lastFrame = now;
    time += 1;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(18px)";

    const px = pointer.x * width;
    const py = pointer.y * height;
    const scroll = window.scrollY * .06;
    drawBlob(width * .22 + Math.sin(time * .008) * 56, height * .25 + scroll, width * .34, "rgba(62,94,255,.16)", "rgba(184,124,255,.09)", 0);
    drawBlob(width * .82 + Math.cos(time * .006) * 48, height * .18 + scroll * .45, width * .28, "rgba(111,246,255,.13)", "rgba(27,101,255,.08)", 2);
    drawBlob(px + pointer.vx * 620, py + pointer.vy * 620, Math.min(width, height) * .24, "rgba(255,104,210,.12)", "rgba(111,246,255,.1)", 4);

    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";
    pointer.vx *= .92;
    pointer.vy *= .92;
    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);
}

async function fetchProjects() {
  const firstShowcaseImage = document.querySelector(".showcase-wall img");
  const isFlatBuild = firstShowcaseImage && !firstShowcaseImage.getAttribute("src").startsWith("assets/");
  const candidates = isFlatBuild ? ["projects.json", "assets/projects.json"] : ["assets/projects.json", "projects.json"];
  let lastError;

  for (const url of candidates) {
    try {
      const response = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`${url} ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("项目数据加载失败");
}

async function loadProjects() {
  if (Array.isArray(window.PORTFOLIO_PROJECTS) && window.PORTFOLIO_PROJECTS.length) {
    state.projects = window.PORTFOLIO_PROJECTS;
    renderProjects();
  }

  try {
    const fetchedProjects = await fetchProjects();
    if (Array.isArray(fetchedProjects) && fetchedProjects.length) {
      state.projects = fetchedProjects;
      renderProjects();
    }
  } catch (error) {
    if (!state.projects.length) throw error;
    console.warn("Using embedded project data fallback.", error);
  }
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
  grid.innerHTML = "<p class='project-summary'>项目数据暂时没有加载出来，请稍后刷新页面。</p>";
});
