// Minimal JS placeholder
console.log('👋 Hello from GitHub Pages');

function createJustifiedGallery(gallery, options) {
	const settings = options || {};
	const gap = settings.gap ?? 10;
	const targetRowHeight = settings.targetRowHeight ?? 240;
	const minRowHeight = settings.minRowHeight ?? 160;
	const maxRowHeight = settings.maxRowHeight ?? 340;

	const originalImages = Array.from(gallery.querySelectorAll("img"));

	function waitForImages() {
		return Promise.all(
			originalImages.map((img) => {
				if (img.complete && img.naturalWidth) {
					return Promise.resolve();
				}

				return new Promise((resolve) => {
					img.addEventListener("load", resolve, { once: true });
					img.addEventListener("error", resolve, { once: true });
				});
			})
		);
	}

	function layout() {
		const containerWidth = gallery.clientWidth;
		if (!containerWidth) {
			return;
		}

		gallery.innerHTML = "";

		let row = [];
		let aspectRatioSum = 0;

		originalImages.forEach((img, index) => {
			const aspectRatio = img.naturalWidth / img.naturalHeight;

			row.push({
				img,
				aspectRatio,
			});

			aspectRatioSum += aspectRatio;

			const totalGapWidth = gap * (row.length - 1);
			const rowHeight = (containerWidth - totalGapWidth) / aspectRatioSum;
			const isLastImage = index === originalImages.length - 1;

			if (rowHeight <= targetRowHeight || isLastImage) {
				const finalRowHeight = isLastImage
					? Math.min(targetRowHeight, Math.max(minRowHeight, rowHeight))
					: Math.min(maxRowHeight, Math.max(minRowHeight, rowHeight));

				const rowEl = document.createElement("div");
				rowEl.className = "gallery-row";
				rowEl.style.height = `${finalRowHeight}px`;

				row.forEach(({ img, aspectRatio }) => {
					const clonedImg = img.cloneNode(true);
					clonedImg.style.width = `${finalRowHeight * aspectRatio}px`;
					clonedImg.style.height = `${finalRowHeight}px`;
					rowEl.appendChild(clonedImg);
				});

				gallery.appendChild(rowEl);

				row = [];
				aspectRatioSum = 0;
			}
		});
	}

	waitForImages().then(() => {
		layout();

		const resizeObserver = new ResizeObserver(() => {
			layout();
		});

		resizeObserver.observe(gallery);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const galleries = document.querySelectorAll(".justified-gallery");
	galleries.forEach((gallery) => {
		createJustifiedGallery(gallery, {
			gap: 10,
			targetRowHeight: 230,
			minRowHeight: 150,
			maxRowHeight: 320,
		});
	});

	const blogFilterPanel = document.querySelector(".blog-filter-panel");
	const blogPosts = Array.from(document.querySelectorAll(".blog-list .post-item"));
	if (blogFilterPanel && blogPosts.length) {
		const filterButtons = Array.from(blogFilterPanel.querySelectorAll("[data-tag]"));
		const applyBlogFilter = (selectedTag) => {
			filterButtons.forEach((button) => {
				const isActive = button.dataset.tag === selectedTag;
				button.classList.toggle("active", isActive);
				button.setAttribute("aria-pressed", String(isActive));
			});

			blogPosts.forEach((post) => {
				const postTags = (post.dataset.tags || "").split(" ").filter(Boolean);
				post.hidden = selectedTag !== "all" && !postTags.includes(selectedTag);
			});
		};

		filterButtons.forEach((button) => {
			button.addEventListener("click", () => applyBlogFilter(button.dataset.tag || "all"));
		});

		applyBlogFilter(blogFilterPanel.querySelector(".tag-btn.active")?.dataset.tag || "all");
	}

	const tocContainers = document.querySelectorAll(".tag-filters[data-toc]");
	const contentRoot = document.querySelector("article .post-copy, article .intro");

	if (tocContainers.length && contentRoot) {
		const headings = Array.from(contentRoot.querySelectorAll("h2"));
		const usedIds = new Set();

		const slugify = (text) => {
			return text
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-");
		};

		headings.forEach((heading) => {
			if (!heading.id) {
				let base = slugify(heading.textContent || "section");
				if (!base) {
					base = "section";
				}
				let unique = base;
				let counter = 2;
				while (document.getElementById(unique) || usedIds.has(unique)) {
					unique = `${base}-${counter}`;
					counter += 1;
				}
				heading.id = unique;
				usedIds.add(unique);
			}
		});

		const fragment = document.createDocumentFragment();
		headings.forEach((heading) => {
			const link = document.createElement("a");
			link.className = "tag-btn";
			link.href = `#${heading.id}`;
			link.textContent = heading.textContent || "Section";
			fragment.appendChild(link);
		});

		tocContainers.forEach((container) => {
			const list = container.querySelector("[data-toc-list]");
			if (list) {
				list.appendChild(fragment.cloneNode(true));
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const navToggle = document.querySelector(".nav-toggle");
	const primaryNavigation = document.getElementById("primary-navigation");

	if (navToggle && primaryNavigation) {
		const closeNavigation = () => {
			primaryNavigation.classList.remove("is-open");
			navToggle.setAttribute("aria-expanded", "false");
		};

		navToggle.addEventListener("click", () => {
			const isOpen = primaryNavigation.classList.toggle("is-open");
			navToggle.setAttribute("aria-expanded", String(isOpen));
		});

		primaryNavigation.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", closeNavigation);
		});

		document.addEventListener("click", (event) => {
			if (!primaryNavigation.contains(event.target) && !navToggle.contains(event.target)) {
				closeNavigation();
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && primaryNavigation.classList.contains("is-open")) {
				closeNavigation();
				navToggle.focus();
			}
		});
	}

	const commandPalette = document.getElementById("command-palette");
	const commandTrigger = document.querySelector("[data-command-palette-trigger]");
	if (commandPalette && commandTrigger) {
		const commandInput = commandPalette.querySelector(".command-palette__input");
		const closeCommandButton = commandPalette.querySelector("[data-command-palette-close]");
		const commandResults = commandPalette.querySelector("[data-command-palette-results]");
		let searchEntries = [];
		let searchIndexPromise = null;
		let lastCommandTrigger = null;

		const visibleCommandItems = () => Array.from(commandResults.querySelectorAll("[data-command-palette-item]"));

		const showCommandMessage = (message) => {
			commandResults.replaceChildren();
			const emptyState = document.createElement("p");
			emptyState.className = "command-palette__empty";
			emptyState.textContent = message;
			commandResults.append(emptyState);
		};

		const searchScore = (entry, terms) => {
			const title = (entry.title || "").toLowerCase();
			const tags = (entry.tags || "").toLowerCase();
			const content = (entry.content || "").toLowerCase();
			let score = 0;

			for (const term of terms) {
				if (!title.includes(term) && !tags.includes(term) && !content.includes(term)) return -1;
				score += title.includes(term) ? 8 : 0;
				score += tags.includes(term) ? 4 : 0;
				score += content.includes(term) ? 1 : 0;
			}

			return score;
		};

		const matchingSentence = (content, terms) => {
			const sentences = (content || "").match(/[^.!?]+(?:[.!?]+|$)/g) || [content || ""];
			const sentence = sentences.find((candidate) => {
				const lowerCaseCandidate = candidate.toLowerCase();
				return terms.some((term) => lowerCaseCandidate.includes(term));
			}) || content || "";
			const trimmed = sentence.trim();
			return trimmed.length > 180 ? `${trimmed.slice(0, 177).trimEnd()}…` : trimmed;
		};

		const appendHighlightedText = (element, text, terms) => {
			const escapedTerms = terms
				.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
				.sort((first, second) => second.length - first.length);
			const matcher = new RegExp(`(${escapedTerms.join("|")})`, "gi");
			const exactMatcher = new RegExp(`^(?:${escapedTerms.join("|")})$`, "i");

			text.split(matcher).forEach((part) => {
				if (!part) return;
				if (exactMatcher.test(part)) {
					const mark = document.createElement("mark");
					mark.textContent = part;
					element.append(mark);
				} else {
					element.append(document.createTextNode(part));
				}
			});
		};

		const filterCommands = () => {
			const terms = commandInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
			if (!terms.length) {
				commandResults.replaceChildren();
				return;
			}

			const matches = searchEntries
				.map((entry) => ({ entry, score: searchScore(entry, terms) }))
				.filter(({ score }) => score >= 0)
				.sort((first, second) => second.score - first.score || first.entry.title.localeCompare(second.entry.title))
				.slice(0, 12)
				.map(({ entry }) => entry);

			commandResults.replaceChildren();
			if (!matches.length) {
				showCommandMessage("No results found.");
				return;
			}

			matches.forEach((entry, index) => {
				const result = document.createElement("a");
				result.className = "command-palette__item";
				result.href = entry.url;
				result.dataset.commandPaletteItem = "";

				const title = document.createElement("span");
				title.className = "command-palette__result-title";
				title.textContent = entry.title;

				const type = document.createElement("span");
				type.className = "command-palette__result-type";
				type.textContent = entry.type;

				const preview = document.createElement("span");
				preview.className = "command-palette__preview";
				appendHighlightedText(preview, matchingSentence(entry.content, terms), terms);

				result.append(title, type, preview);
				if (index === 0) result.classList.add("is-active");
				commandResults.append(result);
			});
		};

		const loadSearchIndex = () => {
			if (searchIndexPromise) return searchIndexPromise;
			searchIndexPromise = fetch(commandPalette.dataset.searchIndex, { cache: "no-store" })
				.then((response) => {
					if (!response.ok) throw new Error("Search index unavailable");
					return response.json();
				})
				.then((entries) => {
					searchEntries = Array.isArray(entries) ? entries : [];
				})
				.catch(() => {
					searchEntries = [];
					showCommandMessage("Unable to load the search index.");
				});
			return searchIndexPromise;
		};

		const closeCommandPalette = () => {
			if (commandPalette.open && typeof commandPalette.close === "function") {
				commandPalette.close();
			} else {
				commandPalette.removeAttribute("open");
			}
		};
		const openCommandPalette = () => {
			lastCommandTrigger = document.activeElement;
			commandInput.value = "";
			commandResults.replaceChildren();
			if (!commandPalette.open) {
				try {
					commandPalette.showModal();
				} catch (error) {
					commandPalette.setAttribute("open", "");
				}
			}
			loadSearchIndex().then(filterCommands);
			window.requestAnimationFrame(() => commandInput.focus());
		};

		commandTrigger.addEventListener("click", openCommandPalette);
		closeCommandButton.addEventListener("click", closeCommandPalette);
		commandPalette.addEventListener("click", (event) => {
			if (event.target === commandPalette) closeCommandPalette();
		});
		commandPalette.addEventListener("close", () => lastCommandTrigger?.focus());
		commandInput.addEventListener("input", filterCommands);
		commandInput.addEventListener("keydown", (event) => {
			const items = visibleCommandItems();
			const activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				if (!items.length) return;
				const nextIndex = event.key === "ArrowDown"
					? (activeIndex + 1 + items.length) % items.length
					: (activeIndex - 1 + items.length) % items.length;
				items.forEach((item) => item.classList.remove("is-active"));
				items[nextIndex].classList.add("is-active");
			}
			if (event.key === "Enter" && items[activeIndex]) {
				items[activeIndex].click();
			}
		});
		document.addEventListener("keydown", (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				if (!commandPalette.open) openCommandPalette();
			}
		});
	}

	const previewTriggers = document.querySelectorAll(".hover-image");
	if (previewTriggers.length) {
		const previewDialog = document.createElement("dialog");
		previewDialog.className = "image-preview-dialog";

		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "image-preview-dialog__close";
		closeButton.textContent = "Close preview";

		const previewImage = document.createElement("img");
		previewDialog.append(closeButton, previewImage);
		document.body.append(previewDialog);

		let lastPreviewTrigger = null;
		const closePreview = () => previewDialog.close();

		closeButton.addEventListener("click", closePreview);
		previewDialog.addEventListener("click", (event) => {
			if (event.target === previewDialog) {
				closePreview();
			}
		});
		previewDialog.addEventListener("close", () => lastPreviewTrigger?.focus());

		previewTriggers.forEach((trigger) => {
			trigger.addEventListener("click", () => {
				const sourceImage = trigger.querySelector("img");
				if (!sourceImage) {
					return;
				}

				lastPreviewTrigger = trigger;
				previewImage.src = sourceImage.currentSrc || sourceImage.src;
				previewImage.alt = sourceImage.alt;
				previewDialog.showModal();
				closeButton.focus();
			});
		});
	}

	document.querySelectorAll(".spoiler").forEach((trigger) => {
		trigger.addEventListener("click", () => {
			const isRevealed = !trigger.classList.contains("is-revealed");
			trigger.classList.toggle("is-revealed", isRevealed);
			trigger.setAttribute("aria-expanded", String(isRevealed));
		});
	});
});
