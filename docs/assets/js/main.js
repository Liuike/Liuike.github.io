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
