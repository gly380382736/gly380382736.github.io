const root = document.documentElement;
const sceneShell = document.querySelector(".scene-shell");
const splineViewer = document.querySelector("spline-viewer");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const marqueeRows = document.querySelectorAll(".marquee-row");
const libraryRoot = document.querySelector("#portfolioLibrary");
const workViewer = document.querySelector(".work-viewer");
const viewerImage = workViewer?.querySelector("figure img");
const viewerType = workViewer?.querySelector(".viewer-type");
const viewerTitle = workViewer?.querySelector("aside h3");
const viewerProject = workViewer?.querySelector("[data-viewer-project]");
const viewerSource = workViewer?.querySelector("[data-viewer-source]");
const viewerSize = workViewer?.querySelector("[data-viewer-size]");
const viewerWhy = workViewer?.querySelector("[data-viewer-why]");
const viewerBenefit = workViewer?.querySelector("[data-viewer-benefit]");
const viewerBreakdown = workViewer?.querySelector("[data-viewer-breakdown]");
const viewerBreakdownSection = workViewer?.querySelector(".viewer-breakdown");
const viewerClose = workViewer?.querySelector(".viewer-close");
const library = window.PORTFOLIO_LIBRARY;
const libraryItems = library?.items ?? [];
const itemById = new Map(libraryItems.map((item) => [item.id, item]));
const splineModuleUrl = "https://unpkg.com/@splinetool/viewer@1.12.98/build/spline-viewer.js";

let rafId = 0;
let nextX = 64;
let nextY = 34;

const categoryOrder = [
  ["apps", "01", "App 项目"],
  ["platforms", "02", "管理平台"],
  ["dashboards", "03", "数据大屏"],
  ["visuals", "04", "视觉探索"],
];

const categoryDescriptions = {
  apps: "先选择移动端项目名称，再查看该项目的页面组。点击页面后查看完整长图、设计原因和页面拆分。",
  platforms: "先选择后台或门户项目，再查看对应工作流页面，避免把不同系统直接混铺在一起。",
  dashboards: "先选择大屏项目，再查看该驾驶舱的页面组和可视化设计说明。",
  visuals: "先选择视觉项目，再查看完整视觉和传播目的说明。",
};

const categorySlugs = categoryOrder.map(([slug]) => slug);
const itemsPerPage = 12;
const getInitialCategory = () => {
  const hashCategory = window.location.hash.replace("#library-", "");
  return categorySlugs.includes(hashCategory) ? hashCategory : "apps";
};

let activeCategory = getInitialCategory();
let activePage = 0;
const activeProjectByCategory = {};

const getProjectGroups = (category) => {
  const groups = [];
  const groupMap = new Map();

  libraryItems
    .filter((item) => item.category === category)
    .forEach((item) => {
      if (!groupMap.has(item.project)) {
        const group = {
          name: item.project,
          count: 0,
          type: item.type,
        };
        groupMap.set(item.project, group);
        groups.push(group);
      }

      groupMap.get(item.project).count += 1;
    });

  return groups;
};

const defaultBreakdown = (item) => {
  if (item.category === "apps") {
    return ["顶部建立场景和身份识别", "中部放置高频任务入口", "底部用内容或列表承接后续浏览"];
  }

  if (item.category === "platforms") {
    return ["顶部保留全局导航和状态", "中部承载筛选、列表或核心工作区", "详情、弹窗或操作区处理下一步任务"];
  }

  if (item.category === "dashboards") {
    return ["中心区域承载关键态势", "周边区域分布指标与趋势", "底部或侧边补充告警、排名和明细"];
  }

  return ["先确定主题视觉记忆点", "再组织标题、角色和场景层级", "最后用色彩和细节强化传播氛围"];
};

const getTileVariant = (item, index) => {
  if (item.category === "apps") {
    return index % 12 === 0 ? "is-featured" : "is-mobile-card";
  }

  if (item.category === "dashboards") {
    return index % 5 === 0 ? "is-panorama" : "is-featured";
  }

  if (item.category === "visuals") {
    return item.orientation === "portrait" ? "is-poster-card" : "is-featured";
  }

  return index % 7 === 0 ? "is-panorama" : "is-work-card";
};

const updatePointer = () => {
  rafId = 0;
  root.style.setProperty("--mx", `${nextX}%`);
  root.style.setProperty("--my", `${nextY}%`);

  if (!reducedMotion.matches && sceneShell) {
    const tiltX = (nextX - 50) / 14;
    const tiltY = (nextY - 50) / 18;
    sceneShell.style.setProperty("--tilt-x", tiltX.toFixed(2));
    sceneShell.style.setProperty("--tilt-y", tiltY.toFixed(2));
  }
};

const createLibraryTile = (item, index) => {
  const button = document.createElement("button");
  button.className = [
    "library-tile",
    item.orientation === "portrait" ? "is-portrait" : "is-landscape",
    getTileVariant(item, index),
  ].join(" ");
  button.type = "button";
  button.dataset.libraryId = item.id;
  button.style.transitionDelay = `${Math.min(index % 9, 8) * 20}ms`;
  button.setAttribute("aria-label", `查看 ${item.title}`);

  const thumb = document.createElement("span");
  thumb.className = "library-thumb";

  const image = document.createElement("img");
  image.src = item.thumb;
  image.alt = item.title;
  image.loading = "lazy";
  image.decoding = "async";
  image.fetchPriority = index < 6 ? "auto" : "low";
  thumb.append(image);

  const meta = document.createElement("span");
  meta.className = "library-tile-meta";

  const title = document.createElement("strong");
  title.textContent = item.title;

  const detail = document.createElement("span");
  detail.textContent = `${item.project} / ${item.width}x${item.height}`;

  meta.append(title, detail);
  button.append(thumb, meta);

  if (item.breakdown?.length) {
    const badge = document.createElement("span");
    badge.className = "library-badge";
    badge.textContent = "Breakdown";
    button.append(badge);
  }

  return button;
};

const renderLibrary = () => {
  if (!libraryRoot || !libraryItems.length) {
    return;
  }

  categoryOrder.forEach(([slug]) => {
    const items = libraryItems.filter((item) => item.category === slug);
    const countLabel = document.querySelector(`[data-count="${slug}"]`);
    const trigger = document.querySelector(`[data-library-category="${slug}"]`);

    if (countLabel) {
      countLabel.textContent = `${items.length} pages`;
    }

    if (trigger) {
      const isActive = slug === activeCategory;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-selected", String(isActive));
      trigger.setAttribute("tabindex", isActive ? "0" : "-1");
    }
  });

  const categoryMeta = categoryOrder.find(([slug]) => slug === activeCategory) ?? categoryOrder[0];
  const [slug, number, label] = categoryMeta;
  const items = libraryItems.filter((item) => item.category === slug);
  const projects = getProjectGroups(slug);
  const currentProject = projects.some((project) => project.name === activeProjectByCategory[slug])
    ? activeProjectByCategory[slug]
    : projects[0]?.name;
  activeProjectByCategory[slug] = currentProject;

  const projectItems = currentProject ? items.filter((item) => item.project === currentProject) : items;
  const totalPages = Math.max(1, Math.ceil(projectItems.length / itemsPerPage));
  activePage = Math.min(Math.max(activePage, 0), totalPages - 1);

  const start = activePage * itemsPerPage;
  const visibleItems = projectItems.slice(start, start + itemsPerPage);
  const end = start + visibleItems.length;
  const displayStart = projectItems.length ? start + 1 : 0;

  const section = document.createElement("section");
  section.className = "library-section";
  section.id = `library-${slug}`;
  section.dataset.category = slug;
  section.setAttribute("role", "tabpanel");

  const head = document.createElement("div");
  head.className = "library-section-head";

  const titleWrap = document.createElement("div");
  const count = document.createElement("span");
  count.className = "library-tile-count";
  count.textContent = `${number} / ${items.length} pages`;
  const heading = document.createElement("h3");
  heading.textContent = label;
  titleWrap.append(count, heading);

  const introWrap = document.createElement("div");
  introWrap.className = "library-section-copy";
  const intro = document.createElement("p");
  intro.textContent = categoryDescriptions[slug];
  const range = document.createElement("p");
  range.className = "library-window-meta";
  range.textContent = `${currentProject} / Showing ${String(displayStart).padStart(2, "0")}-${String(end).padStart(2, "0")} of ${projectItems.length}`;
  introWrap.append(intro, range);
  head.append(titleWrap, introWrap);

  const projectNav = document.createElement("div");
  projectNav.className = "project-switcher";
  projectNav.setAttribute("aria-label", `${label}项目名称`);

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.libraryProject = project.name;
    button.className = project.name === currentProject ? "is-active" : "";
    button.style.transitionDelay = `${Math.min(index, 8) * 18}ms`;

    const title = document.createElement("strong");
    title.textContent = project.name;

    const meta = document.createElement("span");
    meta.textContent = `${project.count} pages / ${project.type}`;

    button.append(title, meta);
    projectNav.append(button);
  });

  const grid = document.createElement("div");
  grid.className = "library-grid";
  visibleItems.forEach((item, index) => grid.append(createLibraryTile(item, start + index)));

  const pager = document.createElement("div");
  pager.className = "library-pager";

  const previous = document.createElement("button");
  previous.type = "button";
  previous.dataset.libraryPage = "prev";
  previous.textContent = "Previous";
  previous.disabled = activePage === 0;

  const pageState = document.createElement("span");
  pageState.textContent = `${String(activePage + 1).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;

  const next = document.createElement("button");
  next.type = "button";
  next.dataset.libraryPage = "next";
  next.textContent = "Next";
  next.disabled = activePage >= totalPages - 1;

  pager.append(previous, pageState, next);
  section.append(head, projectNav, grid, pager);
  libraryRoot.replaceChildren(section);
};

renderLibrary();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

window.addEventListener(
  "pointermove",
  (event) => {
    nextX = (event.clientX / window.innerWidth) * 100;
    nextY = (event.clientY / window.innerHeight) * 100;

    if (!rafId) {
      rafId = window.requestAnimationFrame(updatePointer);
    }
  },
  { passive: true }
);

window.addEventListener("pointerleave", () => {
  nextX = 64;
  nextY = 34;

  if (!rafId) {
    rafId = window.requestAnimationFrame(updatePointer);
  }
});

const markSceneReady = () => {
  if (splineViewer?.shadowRoot?.querySelector("canvas")) {
    sceneShell?.classList.add("is-loaded");
    return true;
  }

  return false;
};

const activateSplineScene = () => {
  const sceneUrl = splineViewer?.dataset.sceneUrl;

  if (sceneUrl && !splineViewer.hasAttribute("url")) {
    splineViewer.setAttribute("url", sceneUrl);
  }
};

const loadSplineViewer = () => {
  if (!splineViewer || document.querySelector(`script[src="${splineModuleUrl}"]`)) {
    activateSplineScene();
    return;
  }

  const script = document.createElement("script");
  script.type = "module";
  script.src = splineModuleUrl;
  script.addEventListener("load", activateSplineScene, { once: true });
  document.head.append(script);
};

const scheduleSplineLoad = () => {
  const run = () => window.setTimeout(loadSplineViewer, 600);

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 1400 });
  } else {
    run();
  }
};

splineViewer?.addEventListener("load", () => {
  sceneShell?.classList.add("is-loaded");
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleSplineLoad, { once: true });
} else {
  scheduleSplineLoad();
}

if (!markSceneReady()) {
  const sceneReadyTimer = window.setInterval(() => {
    if (markSceneReady()) {
      window.clearInterval(sceneReadyTimer);
    }
  }, 250);
}

let scrollRaf = 0;

const updateMarquee = () => {
  scrollRaf = 0;

  if (reducedMotion.matches) {
    return;
  }

  marqueeRows.forEach((row) => {
    const track = row.querySelector(".marquee-track");
    if (!track) {
      return;
    }

    const rect = row.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) * 0.12;
    const direction = row.dataset.direction === "left" ? -1 : 1;
    track.style.transform = `translate3d(${direction * progress}px, 0, 0)`;
  });
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollRaf) {
      scrollRaf = window.requestAnimationFrame(updateMarquee);
    }
  },
  { passive: true }
);

updateMarquee();

document.addEventListener("click", (event) => {
  const categoryTrigger = event.target.closest("[data-library-category]");

  if (categoryTrigger) {
    event.preventDefault();
    activeCategory = categoryTrigger.dataset.libraryCategory;
    activePage = 0;
    window.history.replaceState(null, "", `#library-${activeCategory}`);
    renderLibrary();
    libraryRoot?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    return;
  }

  const projectTrigger = event.target.closest("[data-library-project]");

  if (projectTrigger) {
    activeProjectByCategory[activeCategory] = projectTrigger.dataset.libraryProject;
    activePage = 0;
    renderLibrary();
    libraryRoot?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    return;
  }

  const pageTrigger = event.target.closest("[data-library-page]");

  if (pageTrigger) {
    const direction = pageTrigger.dataset.libraryPage;
    activePage += direction === "next" ? 1 : -1;
    renderLibrary();
    libraryRoot?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    return;
  }

  const trigger = event.target.closest("[data-library-id]");
  const item = trigger ? itemById.get(trigger.dataset.libraryId) : null;

  if (
    !item ||
    !workViewer ||
    !viewerImage ||
    !viewerType ||
    !viewerTitle ||
    !viewerProject ||
    !viewerSource ||
    !viewerSize ||
    !viewerWhy ||
    !viewerBenefit ||
    !viewerBreakdown ||
    !viewerBreakdownSection
  ) {
    return;
  }

  const breakdown = item.breakdown?.length ? item.breakdown : defaultBreakdown(item);

  viewerImage.src = item.full;
  viewerImage.alt = item.title;
  viewerType.textContent = item.type;
  viewerTitle.textContent = item.title;
  viewerProject.textContent = item.project;
  viewerSource.textContent = item.sourceName;
  viewerSize.textContent = `${item.width} x ${item.height}`;
  viewerWhy.textContent = item.why;
  viewerBenefit.textContent = item.benefit;
  viewerBreakdown.replaceChildren(
    ...breakdown.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    })
  );
  viewerBreakdownSection.classList.toggle("is-empty", breakdown.length === 0);

  if (typeof workViewer.showModal === "function") {
    workViewer.showModal();
  } else {
    workViewer.setAttribute("open", "");
  }
});

viewerClose?.addEventListener("click", () => {
  workViewer?.close();
});

workViewer?.addEventListener("click", (event) => {
  if (event.target === workViewer) {
    workViewer.close();
  }
});

window.addEventListener("hashchange", () => {
  const nextCategory = getInitialCategory();

  if (nextCategory !== activeCategory) {
    activeCategory = nextCategory;
    activePage = 0;
    renderLibrary();
  }
});
