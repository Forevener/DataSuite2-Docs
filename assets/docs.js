(function () {
	"use strict";

	// ── Theme toggle ─────────────────────────────────────────

	var html = document.documentElement;

	var themeBtn = document.querySelector("[data-action='toggle-theme']");
	if (themeBtn) {
		themeBtn.addEventListener("click", function () {
			var theme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
			html.setAttribute("data-theme", theme);
			localStorage.setItem("docs-theme", theme);
		});
	}

	// ── Nav group persistence ────────────────────────────────

	var navGroups = document.querySelectorAll("[data-element='nav'] .nav-group");
	var NAV_STATE_KEY = "docs-nav-state";

	function saveNavState() {
		var state = [];
		for (var i = 0; i < navGroups.length; i++) {
			state.push(navGroups[i].hasAttribute("open") ? 1 : 0);
		}
		localStorage.setItem(NAV_STATE_KEY, JSON.stringify(state));
	}

	function restoreNavState() {
		var raw = localStorage.getItem(NAV_STATE_KEY);
		if (!raw) return;
		try {
			var state = JSON.parse(raw);
			for (var i = 0; i < navGroups.length && i < state.length; i++) {
				if (state[i]) {
					navGroups[i].setAttribute("open", "");
				} else {
					navGroups[i].removeAttribute("open");
				}
			}
		} catch {}
	}

	restoreNavState();

	for (var g = 0; g < navGroups.length; g++) {
		navGroups[g].addEventListener("toggle", saveNavState);
	}

	// ── Nav filter ───────────────────────────────────────────

	var filterInput = document.querySelector("[data-action='filter-nav']");
	if (filterInput) {
		var navItems = document.querySelectorAll("[data-element='nav'] li");

		filterInput.addEventListener("input", function () {
			var query = this.value.toLowerCase().trim();
			for (var i = 0; i < navItems.length; i++) {
				var text = navItems[i].textContent.toLowerCase();
				navItems[i].hidden = query !== "" && !text.includes(query);
			}
			for (var j = 0; j < navGroups.length; j++) {
				var group = navGroups[j];
				var hasVisible = group.querySelector("li:not([hidden])");
				group.hidden = query !== "" && !hasVisible;
				if (query !== "") {
					group.setAttribute("open", "");
				} else {
					restoreNavState();
				}
			}
		});
	}

	// ── Mobile sidebar ───────────────────────────────────────

	var sidebar = document.querySelector("[data-element='sidebar']");
	var sidebarToggle = document.querySelector("[data-action='toggle-sidebar']");
	var sidebarBackdrop = document.querySelector("[data-action='close-sidebar']");

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

	var activeLink = document.querySelector("[data-element='nav'] a[aria-current='page']");
	if (activeLink && sidebar) {
		activeLink.scrollIntoView({ block: "center" });
	}

	// ── Language dropdown ─────────────────────────────────────

	var langToggle = document.querySelector("[data-action='toggle-lang']");
	var langDropdown = document.querySelector("[data-element='lang-dropdown']");

	function closeLangDropdown() {
		if (langDropdown) langDropdown.removeAttribute("data-visible");
	}

	if (langToggle && langDropdown) {
		langToggle.addEventListener("click", function (e) {
			e.stopPropagation();
			if (langDropdown.hasAttribute("data-visible")) {
				langDropdown.removeAttribute("data-visible");
			} else {
				langDropdown.setAttribute("data-visible", "");
			}
		});

		document.addEventListener("click", closeLangDropdown);
	}

	// ── TOC scroll spy ───────────────────────────────────────

	var tocEl = document.querySelector("[data-element='toc']");
	var headerHeight = parseInt(getComputedStyle(html).getPropertyValue("--header-height")) || 56;

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
				var threshold = headerHeight + 24;
				var activeIdx = 0;

				for (var j = 0; j < headingIds.length; j++) {
					var heading = document.getElementById(headingIds[j]);
					if (heading) {
						var rect = heading.getBoundingClientRect();
						if (rect.top <= threshold) {
							activeIdx = j;
						}
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

	// ── Back to top ──────────────────────────────────────────

	var backToTop = document.querySelector("[data-action='back-to-top']");
	if (backToTop) {
		// Show only when TOC is not visible (mobile/tablet) and scrolled down
		function updateBackToTop() {
			var tocVisible = tocEl && tocEl.offsetParent !== null;
			var scrolledDown = (window.scrollY || window.pageYOffset) > 400;
			if (!tocVisible && scrolledDown) {
				backToTop.setAttribute("data-visible", "");
			} else {
				backToTop.removeAttribute("data-visible");
			}
		}

		var btTicking = false;
		window.addEventListener("scroll", function () {
			if (!btTicking) {
				requestAnimationFrame(function () {
					updateBackToTop();
					btTicking = false;
				});
				btTicking = true;
			}
		});

		backToTop.addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});

		updateBackToTop();
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

	// ── Mobile search overlay ────────────────────────────────

	var searchOverlay = document.querySelector("[data-element='search-overlay']");
	var searchToggle = document.querySelector("[data-action='toggle-search']");

	function openSearchOverlay() {
		if (!searchOverlay) return;
		searchOverlay.setAttribute("data-visible", "");
		var input = searchOverlay.querySelector(".pagefind-ui__search-input");
		if (input) input.focus();
	}

	function closeSearchOverlay() {
		if (!searchOverlay) return;
		searchOverlay.removeAttribute("data-visible");
	}

	if (searchOverlay && typeof PagefindUI !== "undefined") {
		new PagefindUI({
			element: searchOverlay,
			showSubResults: true,
			showImages: false
		});

		if (searchToggle) {
			searchToggle.addEventListener("click", function () {
				if (searchOverlay.hasAttribute("data-visible")) {
					closeSearchOverlay();
				} else {
					openSearchOverlay();
				}
			});
		}
	}

	// ── Keyboard shortcuts ───────────────────────────────────

	document.addEventListener("keydown", function (e) {
		// Escape – close any open overlay/dropdown
		if (e.key === "Escape") {
			closeLangDropdown();
			if (searchOverlay && searchOverlay.hasAttribute("data-visible")) {
				closeSearchOverlay();
				e.preventDefault();
				return;
			}
			closeSidebar();
			return;
		}

		// "/" or Ctrl+K – focus search
		var isInput = document.activeElement && (
			document.activeElement.tagName === "INPUT" ||
			document.activeElement.tagName === "TEXTAREA" ||
			document.activeElement.isContentEditable
		);
		if (isInput) return;

		if (e.key === "/" || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
			e.preventDefault();
			// On small screens, use the overlay
			if (searchToggle && searchToggle.offsetParent !== null) {
				openSearchOverlay();
			} else if (searchContainer) {
				var input = searchContainer.querySelector(".pagefind-ui__search-input");
				if (input) input.focus();
			}
		}
	});
})();
