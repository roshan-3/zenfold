// Link context-menu integration.
//
// Adds "Open in current folder" next to "Open Link in New Tab" in
// contentAreaContextMenu. Visible only when the right-clicked element
// is a link AND the currently active tab lives inside a zen-folder.

import { Prefs } from "./prefs.mjs";

const ITEM_ID = "zenfold-context-openlink-in-folder";
const REF_ID = "context-openlinkintab";
const MENU_ID = "contentAreaContextMenu";

function currentFolder(win) {
  const tab = win.gBrowser?.selectedTab;
  return tab?.closest?.("zen-folder") ?? tab?.group ?? null;
}

function openLinkInFolder(win, folder, linkURL, originTab) {
  const ctx = win.gContextMenu;
  const tab = win.gBrowser.addTab(linkURL, {
    triggeringPrincipal: ctx?.principal
      ?? Services.scriptSecurityManager.getSystemPrincipal(),
    referrerInfo: ctx?.referrerInfo,
    pinned: true,
  });
  win.gBrowser.pinTab(tab);
  folder.addTabs?.([tab]);
  if (originTab && originTab !== tab && originTab.group === folder) {
    try { win.gBrowser.moveTabAfter(tab, originTab); } catch (e) {}
  }
  if (folder.hasAttribute("collapsed")) folder.removeAttribute("collapsed");
}

export const ContextMenu = {
  install(win) {
    const doc = win.document;
    const menu = doc.getElementById(MENU_ID);
    if (!menu) return () => {};

    const ensureItem = () => {
      if (doc.getElementById(ITEM_ID)) return doc.getElementById(ITEM_ID);
      const ref = doc.getElementById(REF_ID);
      if (!ref) return null;
      const item = doc.createXULElement("menuitem");
      item.id = ITEM_ID;
      item.setAttribute("label", "Open Link in current folder");
      item.addEventListener("command", () => {
        const origin = win.gBrowser?.selectedTab;
        const folder = currentFolder(win);
        const linkURL = win.gContextMenu?.linkURL;
        if (folder && linkURL) openLinkInFolder(win, folder, linkURL, origin);
      });
      ref.after(item);
      return item;
    };

    const onShowing = () => {
      if (!Prefs.keybindsEnabled) return;
      const item = ensureItem();
      if (!item) return;
      const folder = currentFolder(win);
      const hasLink = !!win.gContextMenu?.linkURL;
      item.hidden = !(folder && hasLink);
    };

    menu.addEventListener("popupshowing", onShowing);

    return () => {
      menu.removeEventListener("popupshowing", onShowing);
      doc.getElementById(ITEM_ID)?.remove();
    };
  },
};
