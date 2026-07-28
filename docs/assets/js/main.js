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

	const tocContainers = document.querySelectorAll(".tag-filters[data-toc]");
	const contentRoot = document.querySelector("article .intro");

	if (tocContainers.length && contentRoot) {
		const headings = Array.from(contentRoot.querySelectorAll("h2, h3"));
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
			if (heading.tagName.toLowerCase() === "h3") {
				link.style.paddingLeft = "0.75rem";
			}
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
			if (event.key === "Escape") {
				closeNavigation();
				navToggle.focus();
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
