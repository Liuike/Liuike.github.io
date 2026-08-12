(() => {
  const publicRoot = document.querySelector("[data-reading-list-public]");
  const editorRoot = document.querySelector("[data-reading-list-editor]");

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  const isSafeHttpUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const renderInlineMarkdown = (value) => {
    let result = escapeHtml(value);
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
    result = result.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (match, label, href) => (
      isSafeHttpUrl(href) ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>` : label
    ));
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
        const code = [];
        index += 1;
        while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
        if (index < lines.length) index += 1;
        const pre = document.createElement("pre");
        const codeElement = document.createElement("code");
        codeElement.textContent = code.join("\n");
        pre.append(codeElement);
        container.append(pre);
        continue;
      }

      const heading = line.match(/^(#{1,2})\s+(.+)$/);
      if (heading) {
        const element = document.createElement(heading[1].length === 1 ? "h2" : "h3");
        element.innerHTML = renderInlineMarkdown(heading[2]);
        container.append(element);
        index += 1;
        continue;
      }

      const list = line.match(/^([-*]|\d+\.)\s+(.+)$/);
      if (list) {
        const ordered = /\d+\./.test(list[1]);
        const element = document.createElement(ordered ? "ol" : "ul");
        while (index < lines.length) {
          const item = lines[index].match(ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/);
          if (!item) break;
          const li = document.createElement("li");
          li.innerHTML = renderInlineMarkdown(item[1]);
          element.append(li);
          index += 1;
        }
        container.append(element);
        continue;
      }

      const paragraph = [];
      while (index < lines.length && lines[index].trim() && !lines[index].startsWith("```") && !/^(#{1,2})\s+/.test(lines[index]) && !/^([-*]|\d+\.)\s+/.test(lines[index])) {
        paragraph.push(lines[index++]);
      }
      const element = document.createElement("p");
      element.innerHTML = renderInlineMarkdown(paragraph.join(" "));
      container.append(element);
    }
    return container;
  };

  const fetchEntries = async (url) => {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      credentials: "same-origin",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Unable to load the reading list.");
    return Array.isArray(data.entries) ? data.entries : [];
  };

  const makeTags = (tags) => [...new Set(String(tags || "").split(",").map((tag) => tag.trim()).filter(Boolean))];

  const formatEntry = (entry) => ({
    ...entry,
    id: Number(entry.id),
    name: String(entry.name || ""),
    link: String(entry.link || ""),
    tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
    notes_markdown: String(entry.notes_markdown || ""),
  });

  const setButtonLoading = (button, isLoading, label) => {
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    if (label) button.textContent = isLoading ? "Saving…" : label;
  };

  if (publicRoot) {
    const search = publicRoot.querySelector("[data-reading-search]");
    const tagsRoot = publicRoot.querySelector("[data-reading-tags]");
    const results = publicRoot.querySelector("[data-reading-results]");
    const status = publicRoot.querySelector("[data-reading-status]");
    let entries = [];
    let activeTag = "";

    const render = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const visibleEntries = entries.filter((entry) => {
        const haystack = `${entry.name} ${entry.tags.join(" ")} ${entry.notes_markdown}`.toLocaleLowerCase();
        return (!query || haystack.includes(query)) && (!activeTag || entry.tags.includes(activeTag));
      });
      results.replaceChildren();
      if (!visibleEntries.length) {
        status.textContent = entries.length ? "No entries match these filters." : "No reading entries yet.";
        return;
      }
      status.textContent = `${visibleEntries.length} ${visibleEntries.length === 1 ? "entry" : "entries"}.`;
      visibleEntries.forEach((entry) => {
        const article = document.createElement("article");
        article.className = "reading-entry";
        const head = document.createElement("div");
        head.className = "reading-entry__head";
        const title = document.createElement("h2");
        title.textContent = entry.name;
        const link = document.createElement("a");
        link.className = "reading-entry__link";
        link.href = entry.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = entry.link;
        head.append(title, link);
        article.append(head);
        if (entry.tags.length) {
          const tagList = document.createElement("div");
          tagList.className = "reading-entry__tags";
          entry.tags.forEach((tag) => {
            const chip = document.createElement("span");
            chip.textContent = tag;
            tagList.append(chip);
          });
          article.append(tagList);
        }
        if (entry.notes_markdown.trim()) article.append(renderMarkdown(entry.notes_markdown));
        results.append(article);
      });
    };

    const renderTags = () => {
      tagsRoot.replaceChildren();
      const tags = [...new Set(entries.flatMap((entry) => entry.tags))].sort((first, second) => first.localeCompare(second));
      tags.forEach((tag) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reading-tag";
        button.textContent = tag;
        button.setAttribute("aria-pressed", String(tag === activeTag));
        button.addEventListener("click", () => {
          activeTag = tag === activeTag ? "" : tag;
          renderTags();
          render();
        });
        tagsRoot.append(button);
      });
    };

    search.addEventListener("input", render);
    fetchEntries("/api/reading/")
      .then((data) => { entries = data.map(formatEntry); renderTags(); render(); })
      .catch((error) => { status.dataset.state = "error"; status.textContent = error.message; });
  }

  if (editorRoot) {
    const status = editorRoot.querySelector("[data-reading-status]");
    const list = editorRoot.querySelector("[data-reading-editor-list]");
    const form = editorRoot.querySelector("[data-reading-form]");
    const idInput = editorRoot.querySelector("[data-reading-id]");
    const nameInput = editorRoot.querySelector("[data-reading-name]");
    const linkInput = editorRoot.querySelector("[data-reading-link]");
    const tagsInput = editorRoot.querySelector("[data-reading-tags-input]");
    const notesInput = editorRoot.querySelector("[data-reading-notes]");
    const preview = editorRoot.querySelector("[data-reading-preview]");
    const mode = editorRoot.querySelector("[data-reading-form-mode]");
    const heading = editorRoot.querySelector("[data-reading-form-heading]");
    const deleteButton = editorRoot.querySelector("[data-reading-delete]");
    const saveButton = editorRoot.querySelector("[data-reading-save]");
    const saveStatus = editorRoot.querySelector("[data-reading-save-status]");
    const newButton = editorRoot.querySelector("[data-reading-new]");
    let entries = [];

    const resetForm = () => {
      form.reset();
      idInput.value = "";
      mode.textContent = "New entry";
      heading.textContent = "Make a note";
      deleteButton.hidden = true;
      saveStatus.textContent = "";
      saveStatus.dataset.state = "";
      preview.replaceChildren(renderMarkdown(""));
      list.querySelectorAll("button").forEach((button) => button.removeAttribute("aria-current"));
      nameInput.focus();
    };

    const populateForm = (entry) => {
      idInput.value = String(entry.id);
      nameInput.value = entry.name;
      linkInput.value = entry.link;
      tagsInput.value = entry.tags.join(", ");
      notesInput.value = entry.notes_markdown;
      mode.textContent = "Editing entry";
      heading.textContent = entry.name;
      deleteButton.hidden = false;
      saveStatus.textContent = "";
      preview.replaceChildren(renderMarkdown(entry.notes_markdown));
      list.querySelectorAll("button").forEach((button) => button.setAttribute("aria-current", String(Number(button.dataset.id) === entry.id)));
    };

    const renderList = () => {
      list.replaceChildren();
      entries.forEach((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.id = String(entry.id);
        button.textContent = entry.name;
        button.addEventListener("click", () => populateForm(entry));
        list.append(button);
      });
    };

    const adminApi = "/reading/edit/api/";

    const refreshEntries = async () => {
      entries = (await fetchEntries(adminApi)).map(formatEntry);
      renderList();
      status.textContent = `${entries.length} ${entries.length === 1 ? "entry" : "entries"}.`;
      status.dataset.state = "";
    };

    notesInput.addEventListener("input", () => preview.replaceChildren(renderMarkdown(notesInput.value)));
    newButton.addEventListener("click", resetForm);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = Number(idInput.value);
      const payload = { name: nameInput.value, link: linkInput.value, tags: makeTags(tagsInput.value), notes_markdown: notesInput.value };
      setButtonLoading(saveButton, true, "Save entry");
      saveStatus.textContent = "";
      try {
        const response = await fetch(id ? `${adminApi}${id}` : adminApi, {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Unable to save this entry.");
        await refreshEntries();
        const saved = formatEntry(data.entry);
        populateForm(saved);
        saveStatus.textContent = "Saved.";
        saveStatus.dataset.state = "success";
      } catch (error) {
        saveStatus.textContent = error.message;
        saveStatus.dataset.state = "error";
      } finally {
        setButtonLoading(saveButton, false, "Save entry");
      }
    });

    deleteButton.addEventListener("click", async () => {
      const id = Number(idInput.value);
      if (!id || !window.confirm("Delete this reading-list entry?")) return;
      deleteButton.disabled = true;
      try {
        const response = await fetch(`${adminApi}${id}`, { method: "DELETE", credentials: "same-origin" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "Unable to delete this entry.");
        }
        await refreshEntries();
        resetForm();
      } catch (error) {
        saveStatus.textContent = error.message;
        saveStatus.dataset.state = "error";
      } finally {
        deleteButton.disabled = false;
      }
    });

    refreshEntries()
      .then(resetForm)
      .catch((error) => { status.dataset.state = "error"; status.textContent = error.message; });
  }
})();
