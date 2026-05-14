// ==UserScript==
// @name           Zenfold
// @description    Folder-aware keyboard shortcuts and link context menu for Zen.
// @version        0.1.0
// @author         zenfold
// @include        main
// ==/UserScript==
//
// Zenfold — userChrome.js entry point.
//
// Loaded by fx-autoconfig into chrome://browser/content/browser.xhtml.
// Wires up keybinds and context-menu integration; teardown owned here.

import { Keybinds } from "chrome://userscripts/content/zenfold/keybinds.mjs";
import { ContextMenu } from "chrome://userscripts/content/zenfold/contextmenu.mjs";

const ZENFOLD_TAG = "zenfold:installed";

(function bootstrap(win = window) {
  if (win[ZENFOLD_TAG]) return;
  win[ZENFOLD_TAG] = true;

  const ready = () => {
    const teardown = [
      Keybinds.install(win),
      ContextMenu.install(win),
    ];

    win.addEventListener(
      "unload",
      () => {
        for (const off of teardown) {
          try { off?.(); } catch (e) { console.warn("[Zenfold] teardown error:", e); }
        }
      },
      { once: true }
    );

    console.info("[Zenfold] v0.1.0 ready");
  };

  if (win.gBrowserInit?.delayedStartupFinished) {
    ready();
  } else {
    const onStartup = (subject, topic) => {
      if (subject !== win) return;
      Services.obs.removeObserver(onStartup, topic);
      ready();
    };
    Services.obs.addObserver(onStartup, "browser-delayed-startup-finished");
  }
})();
