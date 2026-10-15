(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "fantuan-color-theme";
  var systemPreference = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var toggle;

  function readPreference() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  var savedTheme = readPreference();

  function systemTheme() {
    return systemPreference && systemPreference.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", theme);

    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", dark ? "#15191e" : "#ffffff");
    }

    if (toggle) {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  applyTheme(savedTheme || systemTheme());

  function initializeToggle() {
    toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    applyTheme(savedTheme || systemTheme());
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      savedTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(savedTheme);
      try {
        window.localStorage.setItem(storageKey, savedTheme);
      } catch (error) {
        // Switching still works when the browser does not allow storage.
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeToggle);
  } else {
    initializeToggle();
  }

  function followSystemTheme() {
    if (!savedTheme) applyTheme(systemTheme());
  }

  if (systemPreference) {
    if (systemPreference.addEventListener) {
      systemPreference.addEventListener("change", followSystemTheme);
    } else if (systemPreference.addListener) {
      systemPreference.addListener(followSystemTheme);
    }
  }

  window.addEventListener("storage", function (event) {
    if (event.key === storageKey || event.key === null) {
      savedTheme = readPreference();
      applyTheme(savedTheme || systemTheme());
    }
  });
}());

