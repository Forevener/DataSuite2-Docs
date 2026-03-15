(function () {
	"use strict";

	// ── Theme toggle ─────────────────────────────────────────

	const html = document.documentElement;

	const themeBtn = document.querySelector("[data-action='toggle-theme']");
	if (themeBtn) {
		themeBtn.addEventListener("click", function () {
			var theme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
			html.setAttribute("data-theme", theme);
			localStorage.setItem("docs-theme", theme);
		});
	}

	// ── Nav filter ───────────────────────────────────────────

	const filterInput = document.querySelector("[data-action='filter-nav']");
	if (filterInput) {
		const navItems = document.querySelectorAll("[data-element='nav'] li");

		filterInput.addEventListener("input", function () {
			const query = this.value.toLowerCase().trim();
			for (const li of navItems) {
				const text = li.textContent.toLowerCase();
				li.hidden = query !== "" && !text.includes(query);
			}
		});
	}

	// ── Mobile sidebar ───────────────────────────────────────

	const sidebar = document.querySelector("[data-element='sidebar']");
	const sidebarToggle = document.querySelector("[data-action='toggle-sidebar']");
	const sidebarBackdrop = document.querySelector("[data-action='close-sidebar']");

	function openSidebar() {
		if (!sidebar) return;
		sidebar.setAttribute("data-visible", "");
		if (sidebarBackdrop) sidebarBackdrop.setAttribute("data-visible", "");
	}

	function closeSidebar() {
		if (!sidebar) return;
		sidebar.removeAttribute("data-visible");
		if (sidebarBackdrop) sidebarBackdrop.removeAttribute("data-visible");
	}

	if (sidebarToggle) {
		sidebarToggle.addEventListener("click", function () {
			if (sidebar.hasAttribute("data-visible")) {
				closeSidebar();
			} else {
				openSidebar();
			}
		});
	}

	if (sidebarBackdrop) {
		sidebarBackdrop.addEventListener("click", closeSidebar);
	}

	// ── Scroll active nav item into view ─────────────────────

	const activeLink = document.querySelector("[data-element='nav'] a[aria-current='page']");
	if (activeLink && sidebar) {
		activeLink.scrollIntoView({ block: "center" });
	}

	// ── Language dropdown ─────────────────────────────────────

	var langToggle = document.querySelector("[data-action='toggle-lang']");
	var langDropdown = document.querySelector("[data-element='lang-dropdown']");

	if (langToggle && langDropdown) {
		langToggle.addEventListener("click", function (e) {
			e.stopPropagation();
			if (langDropdown.hasAttribute("data-visible")) {
				langDropdown.removeAttribute("data-visible");
			} else {
				langDropdown.setAttribute("data-visible", "");
			}
		});

		document.addEventListener("click", function () {
			langDropdown.removeAttribute("data-visible");
		});
	}

	// ── TOC scroll spy ───────────────────────────────────────

	var tocEl = document.querySelector("[data-element='toc']");
	if (tocEl) {
		var tocLinks = tocEl.querySelectorAll("a");
		var headingIds = [];
		for (var i = 0; i < tocLinks.length; i++) {
			var href = tocLinks[i].getAttribute("href");
			if (href && href.charAt(0) === "#") {
				headingIds.push(href.slice(1));
			}
		}

		if (headingIds.length > 0) {
			var tocItems = tocEl.querySelectorAll("li");

			function updateTocActive() {
				var scrollY = window.scrollY || window.pageYOffset;
				var activeIdx = 0;

				for (var j = 0; j < headingIds.length; j++) {
					var heading = document.getElementById(headingIds[j]);
					if (heading && heading.offsetTop - 80 <= scrollY) {
						activeIdx = j;
					}
				}

				for (var k = 0; k < tocItems.length; k++) {
					if (k === activeIdx) {
						tocItems[k].setAttribute("data-active", "");
					} else {
						tocItems[k].removeAttribute("data-active");
					}
				}
			}

			var ticking = false;
			window.addEventListener("scroll", function () {
				if (!ticking) {
					requestAnimationFrame(function () {
						updateTocActive();
						ticking = false;
					});
					ticking = true;
				}
			});

			updateTocActive();
		}
	}

	// ── Pagefind search ──────────────────────────────────────

	var searchContainer = document.querySelector("[data-element='search']");
	if (searchContainer && typeof PagefindUI !== "undefined") {
		new PagefindUI({
			element: searchContainer,
			showSubResults: true,
			showImages: false
		});
	}
})();
