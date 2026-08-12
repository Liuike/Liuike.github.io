(() => {
  const publicRoot = document.querySelector("[data-reading-list-public]");
  const editorRoot = document.querySelector("[data-reading-list-editor]");
  const root = editorRoot || publicRoot;
  if (!root) return;

  root.querySelectorAll("[data-reading-navigate]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.assign(button.dataset.readingNavigate);
    });
  });

  const isEditor = Boolean(editorRoot);
  const publicApi = "/api/reading/";
  const editorApi = "/reading/edit/api/";
  const localMockEntry = {
    id: 0,
    name: "Training language models to follow instructions with human feedback",
    link: "https://arxiv.org/pdf/2203.02155",
    tags: ["RL", "RLHF", "DL"],
    notes_markdown: "A local preview entry for refining the reading-list layout. It is only shown when the site is running on localhost.",
    created_at: "",
    updated_at: "",
  };
  const localTagWrapMockEntry = {
    id: -1,
    name: "A deliberately tag-heavy local preview entry",
    link: "https://example.com/tag-preview",
    tags: ["AI", "Alignment", "Cognition", "Design", "Economics", "History", "Methods", "Systems"],
    notes_markdown: "A localhost-only entry used to check how a long tag set wraps within a reading-list card.",
    created_at: "",
    updated_at: "",
  };
  const isStaticLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port === "4000";
  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const isSafeHttpUrl = (value) => { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } };
  const makeTags = (value) => [...new Set(String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean))];
  const formatEntry = (entry) => ({ ...entry, id: Number(entry.id), name: String(entry.name || ""), link: String(entry.link || ""), tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [], notes_markdown: String(entry.notes_markdown || "") });
  const createIcon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    if (name === "chevron-down") {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "m6 9 6 6 6-6"); path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); path.setAttribute("stroke-width", "2"); svg.append(path);
    } else {
      [5, 12, 19].forEach((cy) => { const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); circle.setAttribute("cx", "12"); circle.setAttribute("cy", String(cy)); circle.setAttribute("r", "1.5"); circle.setAttribute("fill", "currentColor"); svg.append(circle); });
    }
    return svg;
  };

  const renderInlineMarkdown = (value) => {
    let result = escapeHtml(value);
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
    result = result.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, href) => isSafeHttpUrl(href) ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>` : label);
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return result.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  };

  const renderMarkdown = (markdown) => {
    const container = document.createElement("div");
    container.className = "reading-notes";
    const lines = String(markdown || "").replaceAll("\r\n", "\n").split("\n");
    let index = 0;
    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) { index += 1; continue; }
      if (line.startsWith("```")) {
        const code = []; index += 1;
        while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
        if (index < lines.length) index += 1;
        const pre = document.createElement("pre"); const codeElement = document.createElement("code"); codeElement.textContent = code.join("\n"); pre.append(codeElement); container.append(pre); continue;
      }
      const heading = line.match(/^(#{1,2})\s+(.+)$/);
      if (heading) { const element = document.createElement(heading[1].length === 1 ? "h2" : "h3"); element.innerHTML = renderInlineMarkdown(heading[2]); container.append(element); index += 1; continue; }
      const list = line.match(/^([-*]|\d+\.)\s+(.+)$/);
      if (list) {
        const ordered = /\d+\./.test(list[1]); const element = document.createElement(ordered ? "ol" : "ul");
        while (index < lines.length) { const item = lines[index].match(ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/); if (!item) break; const li = document.createElement("li"); li.innerHTML = renderInlineMarkdown(item[1]); element.append(li); index += 1; }
        container.append(element); continue;
      }
      const paragraph = [];
      while (index < lines.length && lines[index].trim() && !lines[index].startsWith("```") && !/^(#{1,2})\s+/.test(lines[index]) && !/^([-*]|\d+\.)\s+/.test(lines[index])) paragraph.push(lines[index++]);
      const element = document.createElement("p"); element.innerHTML = renderInlineMarkdown(paragraph.join(" ")); container.append(element);
    }
    return container;
  };

  const fetchEntries = async (url) => {
    const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store", credentials: "same-origin" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Unable to load the reading list.");
    return Array.isArray(data.entries) ? data.entries.map(formatEntry) : [];
  };

  const search = root.querySelector("[data-reading-search]");
  const tagsRoot = root.querySelector("[data-reading-tags]");
  const results = root.querySelector("[data-reading-results]");
  const status = root.querySelector("[data-reading-status]");
  const noteDialog = root.querySelector("[data-reading-note-dialog]");
  const noteTitle = root.querySelector("[data-reading-note-title]");
  const noteContent = root.querySelector("[data-reading-note-content]");
  let entries = [];
  const activeTags = new Set();
  let tagsExpanded = false;

  const closeDialog = (dialog) => { if (dialog?.open) dialog.close(); };
  root.querySelectorAll("[data-reading-note-close]").forEach((button) => button.addEventListener("click", () => closeDialog(noteDialog)));
  noteDialog?.addEventListener("click", (event) => { if (event.target === noteDialog) closeDialog(noteDialog); });

  const openNotes = (entry, trigger) => {
    noteTitle.textContent = entry.name;
    noteContent.replaceChildren(renderMarkdown(entry.notes_markdown));
    noteDialog.showModal();
    noteDialog.querySelector("[data-reading-note-close]").focus();
    noteDialog.addEventListener("close", () => trigger?.focus(), { once: true });
  };

  const renderTags = () => {
    tagsRoot.replaceChildren();
    const tagCounts = new Map();
    entries.flatMap((entry) => entry.tags).forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
    const tags = [...tagCounts.entries()].sort(([leftTag, leftCount], [rightTag, rightCount]) => rightCount - leftCount || leftTag.localeCompare(rightTag)).map(([tag]) => tag);
    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "reading-tag"; button.textContent = tag; button.setAttribute("aria-pressed", String(activeTags.has(tag)));
      button.addEventListener("click", () => { activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag); renderTags(); renderEntries(); });
      tagsRoot.append(button);
    });
    requestAnimationFrame(() => {
      const buttons = [...tagsRoot.querySelectorAll(".reading-tag")];
      const firstRowTop = buttons[0]?.offsetTop;
      const overflowIndex = buttons.findIndex((button) => button.offsetTop > firstRowTop);
      if (overflowIndex === -1) return;
      if (!tagsExpanded) buttons.slice(overflowIndex).forEach((button) => { button.hidden = true; });
      const toggle = document.createElement("button");
      toggle.type = "button"; toggle.className = "reading-tag reading-tag--expand"; toggle.textContent = tagsExpanded ? "Show fewer tags" : `Show all ${tags.length} tags`; toggle.setAttribute("aria-expanded", String(tagsExpanded));
      toggle.addEventListener("click", () => { tagsExpanded = !tagsExpanded; renderTags(); });
      tagsRoot.append(toggle);
    });
  };

  const entryActions = (entry) => {
    const actions = document.createElement("div"); actions.className = "reading-entry__actions";
    if (entry.notes_markdown.trim()) {
      const notesButton = document.createElement("button"); notesButton.type = "button"; notesButton.className = "reading-icon-button"; notesButton.setAttribute("aria-label", `Expand notes for ${entry.name}`); notesButton.append(createIcon("chevron-down")); notesButton.addEventListener("click", () => openNotes(entry, notesButton)); actions.append(notesButton);
    }
    if (isEditor) {
      const menu = document.createElement("details"); menu.className = "reading-entry-menu";
      const summary = document.createElement("summary"); summary.className = "reading-icon-button"; summary.setAttribute("aria-label", `Edit options for ${entry.name}`); summary.setAttribute("aria-haspopup", "menu"); summary.append(createIcon("more-options"));
      const menuBody = document.createElement("div"); menuBody.className = "reading-entry-menu__body";
      const edit = document.createElement("button"); edit.type = "button"; edit.textContent = "Edit"; edit.addEventListener("click", () => openForm(entry));
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "reading-entry-menu__delete"; remove.textContent = "Delete"; remove.addEventListener("click", () => deleteEntry(entry));
      menuBody.append(edit, remove); menu.append(summary, menuBody); actions.append(menu);
    }
    return actions;
  };

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".reading-entry-menu")) {
      root.querySelectorAll(".reading-entry-menu[open]").forEach((menu) => menu.removeAttribute("open"));
    }
  });

  const renderEntries = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const visible = entries.filter((entry) => {
      const haystack = `${entry.name} ${entry.tags.join(" ")} ${entry.notes_markdown}`.toLocaleLowerCase();
      return (!query || haystack.includes(query)) && [...activeTags].every((tag) => entry.tags.includes(tag));
    });
    results.replaceChildren();
    status.textContent = visible.length ? `${visible.length} ${visible.length === 1 ? "entry" : "entries"}.` : entries.length ? "No entries match these filters." : "No reading entries yet.";
    visible.forEach((entry) => {
      const article = document.createElement("article"); article.className = "reading-entry";
      const head = document.createElement("div"); head.className = "reading-entry__head";
      const title = document.createElement("h2");
      const titleLink = document.createElement("a"); titleLink.className = "reading-entry__title-link"; titleLink.href = entry.link; titleLink.target = "_blank"; titleLink.rel = "noopener noreferrer"; titleLink.textContent = entry.name;
      title.append(titleLink); head.append(title); article.append(head, entryActions(entry));
      if (entry.tags.length) { const tagList = document.createElement("div"); tagList.className = "reading-entry__tags"; entry.tags.forEach((tag) => { const chip = document.createElement("span"); chip.textContent = tag; tagList.append(chip); }); article.append(tagList); }
      results.append(article);
    });
  };

  search.addEventListener("input", renderEntries);
  window.addEventListener("resize", () => { if (!tagsExpanded) renderTags(); });

  let formDialog; let form; let idInput; let nameInput; let linkInput; let tagsInput; let notesInput; let suggestions; let preview; let mode; let heading; let deleteButton; let saveButton; let saveStatus;
  const refresh = async () => {
    entries = isStaticLocalPreview ? [localMockEntry, localTagWrapMockEntry] : await fetchEntries(isEditor ? editorApi : publicApi);
    renderTags(); renderEntries(); if (isEditor) renderSuggestions();
  };

  const renderSuggestions = () => {
    suggestions.replaceChildren();
    [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b)).forEach((tag) => { const option = document.createElement("option"); option.value = tag; suggestions.append(option); });
  };

  const openForm = (entry = null) => {
    form.reset();
    idInput.value = entry ? String(entry.id) : "";
    nameInput.value = entry?.name || ""; linkInput.value = entry?.link || ""; tagsInput.value = entry?.tags.join(", ") || ""; notesInput.value = entry?.notes_markdown || "";
    mode.textContent = entry ? "Editing entry" : "New entry"; heading.textContent = entry ? entry.name : "Add entry"; deleteButton.hidden = !entry; saveStatus.textContent = ""; preview.replaceChildren(renderMarkdown(notesInput.value));
    formDialog.showModal(); nameInput.focus();
  };

  const closeForm = () => closeDialog(formDialog);
  const setSaving = (saving) => { saveButton.disabled = saving; saveButton.classList.toggle("is-loading", saving); saveButton.textContent = saving ? "Saving…" : "Save entry"; };
  const deleteEntry = async (entry) => {
    if (!window.confirm(`Delete “${entry.name}”?`)) return;
    try { const response = await fetch(`${editorApi}${entry.id}`, { method: "DELETE", credentials: "same-origin" }); if (!response.ok) throw new Error("Unable to delete this entry."); await refresh(); }
    catch (error) { status.dataset.state = "error"; status.textContent = error.message; }
  };

  if (isEditor) {
    formDialog = root.querySelector("[data-reading-form-dialog]"); form = root.querySelector("[data-reading-form]"); idInput = root.querySelector("[data-reading-id]"); nameInput = root.querySelector("[data-reading-name]"); linkInput = root.querySelector("[data-reading-link]"); tagsInput = root.querySelector("[data-reading-tags-input]"); notesInput = root.querySelector("[data-reading-notes]"); suggestions = root.querySelector("[data-reading-tag-suggestions]"); preview = root.querySelector("[data-reading-preview]"); mode = root.querySelector("[data-reading-form-mode]"); heading = root.querySelector("[data-reading-form-heading]"); deleteButton = root.querySelector("[data-reading-delete]"); saveButton = root.querySelector("[data-reading-save]"); saveStatus = root.querySelector("[data-reading-save-status]");
    root.querySelector("[data-reading-new]").addEventListener("click", () => openForm());
    root.querySelector("[data-reading-form-close]").addEventListener("click", closeForm);
    notesInput.addEventListener("input", () => preview.replaceChildren(renderMarkdown(notesInput.value)));
    formDialog.addEventListener("click", (event) => { if (event.target === formDialog) closeForm(); });
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); const id = Number(idInput.value); const payload = { name: nameInput.value, link: linkInput.value, tags: makeTags(tagsInput.value), notes_markdown: notesInput.value };
      setSaving(true); saveStatus.textContent = "";
      try { const response = await fetch(id ? `${editorApi}${id}` : editorApi, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "same-origin", body: JSON.stringify(payload) }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Unable to save this entry."); await refresh(); closeForm(); }
      catch (error) { saveStatus.textContent = error.message; saveStatus.dataset.state = "error"; }
      finally { setSaving(false); }
    });
    deleteButton.addEventListener("click", async () => { const entry = entries.find((item) => item.id === Number(idInput.value)); if (entry) { await deleteEntry(entry); closeForm(); } });
  }

  refresh().catch((error) => { status.dataset.state = "error"; status.textContent = error.message; });
})();
