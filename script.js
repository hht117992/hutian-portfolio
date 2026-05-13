(function () {
  const data = window.portfolioData || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function text(value, fallback = "") {
    return value || fallback;
  }

  function setProfileText() {
    $$("[data-profile]").forEach((node) => {
      const key = node.getAttribute("data-profile");
      node.textContent = text(data[key], node.textContent);
    });
    document.title = `${text(data.name, "胡昊天")} | 传热方向求职作品集`;
  }

  function setLinks() {
    const github = data.links && data.links.github;
    const resume = data.links && data.links.resume;
    const demo = (data.links && data.links.demo) || "#demo";
    const resumeNote = $("#resume-note");

    $$("[data-link='github']").forEach((node) => {
      if (github) {
        node.href = github;
        node.removeAttribute("aria-disabled");
      } else {
        node.href = "#contact";
        node.setAttribute("aria-disabled", "true");
        node.textContent = "GitHub 待补充";
      }
    });

    $$("[data-link='demo']").forEach((node) => {
      node.href = demo;
    });

    $$("[data-link='resume'], [data-link='resume-secondary']").forEach((node) => {
      if (resume) {
        node.href = resume;
        node.removeAttribute("aria-disabled");
      } else {
        node.href = "#resume";
        node.setAttribute("aria-disabled", "true");
        node.textContent = "简历待补充";
      }
    });

    if (resumeNote && data.resumeNote) {
      resumeNote.textContent = data.resumeNote;
    }
  }

  function renderHeroStats() {
    const target = $("#hero-stats");
    if (!target || !Array.isArray(data.heroStats)) return;
    target.innerHTML = data.heroStats
      .map(
        (item) => `
          <div class="stat-pill">
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderFacts() {
    const target = $("#profile-facts");
    if (!target || !Array.isArray(data.facts)) return;
    target.innerHTML = data.facts
      .map(
        (item) => `
          <div>
            <dt>${escapeHtml(item.label)}</dt>
            <dd>${escapeHtml(item.value)}</dd>
          </div>
        `
      )
      .join("");
  }

  function renderTimeline() {
    const target = $("#timeline-list");
    if (!target || !Array.isArray(data.timeline)) return;
    target.innerHTML = data.timeline
      .map(
        (item) => `
          <article class="timeline-item">
            <span>${escapeHtml(item.period)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <strong>${escapeHtml(item.subtitle)}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderResearch() {
    const grid = $("#research-grid");
    const publications = $("#publication-list");

    if (grid && Array.isArray(data.researchCards)) {
      grid.innerHTML = data.researchCards
        .map(
          (item) => `
            <article class="research-card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
            </article>
          `
        )
        .join("");
    }

    if (publications && Array.isArray(data.publications)) {
      publications.innerHTML = data.publications
        .map(
          (item) => `
            <article class="publication-item">
              <span>${escapeHtml(item.status)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.venue)}</p>
              <strong>${escapeHtml(item.role)}</strong>
            </article>
          `
        )
        .join("");
    }
  }

  function renderSkills() {
    const target = $("#skill-grid");
    if (!target || !Array.isArray(data.skills)) return;
    target.innerHTML = data.skills
      .map(
        (skill) => `
          <article class="skill-card">
            <h3>${escapeHtml(skill.title)}</h3>
            <ul>
              ${(skill.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  function renderProjects() {
    const target = $("#project-grid");
    if (!target || !Array.isArray(data.projects)) return;
    target.innerHTML = data.projects
      .map(
        (project) => `
          <article class="project-card ${project.featured ? "featured" : ""}">
            <div class="project-meta">
              <span class="tag">${escapeHtml(project.period)}</span>
              ${(project.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
            <ul>
              ${(project.bullets || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <div class="project-actions">
              ${(project.links || [])
                .map(
                  (link) =>
                    `<a class="button text" href="${escapeAttribute(link.href)}" ${
                      link.href && link.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""
                    }>${escapeHtml(link.label)}</a>`
                )
                .join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderDemos() {
    const target = $("#demo-links");
    if (!target || !Array.isArray(data.demos)) return;
    target.innerHTML = data.demos
      .map(
        (demo) =>
          `<a class="button ghost" href="${escapeAttribute(demo.href)}" ${
            demo.href && demo.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""
          }>${escapeHtml(demo.label)}</a>`
      )
      .join("");
  }

  function renderContacts() {
    const target = $("#contact-list");
    if (!target || !Array.isArray(data.contacts)) return;
    target.innerHTML = data.contacts
      .map((contact) => {
        const value = escapeHtml(contact.value);
        const body = contact.href
          ? `<a href="${escapeAttribute(contact.href)}" ${
              contact.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""
            }>${value}</a>`
          : `<strong>${value}</strong>`;
        return `
          <article class="contact-card">
            <span>${escapeHtml(contact.label)}</span>
            ${body}
          </article>
        `;
      })
      .join("");
  }

  function initProjectQa() {
    const form = $("#qa-form");
    const input = $("#qa-question");
    const answer = $("#qa-answer");
    const suggestions = $("#qa-suggestions");
    const knowledge = Array.isArray(data.spaceKnowledge) ? data.spaceKnowledge : [];
    if (!form || !input || !answer || !knowledge.length) return;

    if (suggestions && Array.isArray(data.suggestedQuestions)) {
      suggestions.innerHTML = data.suggestedQuestions
        .map((question) => `<button type="button">${escapeHtml(question)}</button>`)
        .join("");
      suggestions.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        input.value = button.textContent;
        showAnswer(button.textContent);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showAnswer(input.value);
    });

    function showAnswer(question) {
      const query = normalize(question);
      if (!query) {
        renderUnknown();
        return;
      }

      const match = knowledge
        .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
        .sort((a, b) => b.score - a.score)[0];

      if (!match || match.score < 2) {
        renderUnknown();
        return;
      }

      answer.innerHTML = `
        <strong>${escapeHtml(match.entry.title)}</strong>
        <ul>
          ${(match.entry.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
        </ul>
      `;
    }

    function renderUnknown() {
      answer.innerHTML = "<strong>此部分暂时不清楚，当前知识库没有检阅到相关信息。</strong>";
    }
  }

  function scoreEntry(query, entry) {
    return (entry.keywords || []).reduce((score, keyword) => {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) return score;
      if (query.includes(normalizedKeyword)) return score + Math.max(2, Math.min(6, normalizedKeyword.length));
      return score;
    }, 0);
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[，。！？、；：,.!?;:()[\]{}"'“”‘’《》<>]/g, "");
  }

  function initThermalDemo() {
    const form = $("#thermal-demo");
    if (!form) return;

    const outputs = {
      rCond: $("#r-cond"),
      rConv: $("#r-conv"),
      tHot: $("#t-hot"),
      heatFlux: $("#heat-flux")
    };

    function value(name) {
      const field = form.elements.namedItem(name);
      return field ? Number(field.value) : 0;
    }

    function calculate() {
      const power = Math.max(value("power"), 0);
      const lengthM = Math.max(value("length"), 0.01) / 1000;
      const areaM2 = Math.max(value("area"), 0.1) / 10000;
      const conductivity = Math.max(value("conductivity"), 0.01);
      const convection = Math.max(value("convection"), 0.01);
      const ambient = value("ambient");

      const rCond = lengthM / (conductivity * areaM2);
      const rConv = 1 / (convection * areaM2);
      const tHot = ambient + power * (rCond + rConv);
      const heatFlux = power / (areaM2 * 10000);

      outputs.rCond.textContent = `${format(rCond, 3)} K/W`;
      outputs.rConv.textContent = `${format(rConv, 2)} K/W`;
      outputs.tHot.textContent = `${format(tHot, 1)} °C`;
      outputs.heatFlux.textContent = `${format(heatFlux, 2)} W/cm²`;
    }

    form.addEventListener("input", calculate);
    calculate();
  }

  function initThermalCanvas() {
    const canvas = $("#thermal-field");
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function palette(value) {
      const stops = [
        [16, 21, 18],
        [23, 143, 123],
        [47, 111, 208],
        [245, 177, 76],
        [228, 93, 53]
      ];
      const scaled = value * (stops.length - 1);
      const index = Math.max(0, Math.min(stops.length - 2, Math.floor(scaled)));
      const local = scaled - index;
      const a = stops[index];
      const b = stops[index + 1];
      return `rgb(${mix(a[0], b[0], local)}, ${mix(a[1], b[1], local)}, ${mix(a[2], b[2], local)})`;
    }

    function draw() {
      const cell = Math.max(18, Math.min(34, width / 42));
      const t = frame * 0.018;
      context.fillStyle = "#121512";
      context.fillRect(0, 0, width, height);

      for (let y = -cell; y < height + cell; y += cell) {
        for (let x = -cell; x < width + cell; x += cell) {
          const nx = x / Math.max(width, 1);
          const ny = y / Math.max(height, 1);
          const sourceA = Math.exp(-12 * ((nx - 0.74) ** 2 + (ny - 0.34) ** 2));
          const sourceB = Math.exp(-18 * ((nx - 0.58) ** 2 + (ny - 0.72) ** 2));
          const wave = 0.5 + 0.5 * Math.sin(nx * 8.5 + ny * 6.2 + t);
          const value = Math.min(1, sourceA * 0.9 + sourceB * 0.65 + wave * 0.28);
          context.fillStyle = palette(value);
          context.globalAlpha = 0.2 + value * 0.72;
          context.fillRect(x, y, cell + 1, cell + 1);
        }
      }

      context.globalAlpha = 0.16;
      context.strokeStyle = "#fffdf7";
      context.lineWidth = 1;
      for (let i = 0; i < 12; i += 1) {
        const y = (height / 12) * i + Math.sin(t + i * 0.7) * 10;
        context.beginPath();
        for (let x = 0; x <= width; x += 18) {
          const offset = Math.sin(x * 0.012 + t + i * 0.4) * 18;
          if (x === 0) context.moveTo(x, y + offset);
          else context.lineTo(x, y + offset);
        }
        context.stroke();
      }
      context.globalAlpha = 1;

      frame += 1;
      if (!media.matches) requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", () => {
      resize();
      if (media.matches) draw();
    });
  }

  function format(value, digits) {
    if (!Number.isFinite(value)) return "0";
    return value.toLocaleString("zh-CN", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });
  }

  function mix(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value || "#");
  }

  setProfileText();
  setLinks();
  renderHeroStats();
  renderFacts();
  renderTimeline();
  renderResearch();
  renderSkills();
  renderProjects();
  renderDemos();
  renderContacts();
  initProjectQa();
  initThermalDemo();
  initThermalCanvas();
})();
