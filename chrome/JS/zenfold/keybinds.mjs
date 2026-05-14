// Keybind registration for Zenfold.
//
// Registers a single command (cmd_zenfoldNewTabInFolder) and pushes a matching
// KeyShortcut entry into Zen's gZenKeyboardShortcutsManager so the binding
// shows up in Zen Settings > Keyboard Shortcuts and is rebindable from there.
//
// Default bind: Ctrl+Alt+T -> new tab inside the currently active folder,
// placed right after the originating tab.

import { Prefs } from "./prefs.mjs";

const KEY_ID = "key_zenfoldNewTabInFolder";
const CMD_ID = "cmd_zenfoldNewTabInFolder";
const GROUP = "windowAndTabManagement";

function currentFolder(win) {
  const tab = win.gBrowser?.selectedTab;
  return tab?.closest?.("zen-folder") ?? tab?.group ?? null;
}

function newTabInFolder(win, folder, originTab) {
  const tab = win.gBrowser.addTab("about:newtab", {
    triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
    pinned: true,
    skipAnimation: true,
  });
  win.gBrowser.pinTab(tab);
  folder.addTabs?.([tab]);
  if (originTab && originTab !== tab && originTab.group === folder) {
    try { win.gBrowser.moveTabAfter(tab, originTab); } catch (e) {}
  }
  win.gBrowser.selectedTab = tab;
  if (folder.hasAttribute("collapsed")) folder.removeAttribute("collapsed");
}

function registerCommand(win) {
  const doc = win.document;
  const cmd = doc.createXULElement("command");
  cmd.id = CMD_ID;
  cmd.addEventListener("command", () => {
    if (!Prefs.keybindsEnabled) return;
    const origin = win.gBrowser?.selectedTab;
    const folder = currentFolder(win);
    if (folder) newTabInFolder(win, folder, origin);
  });
  (doc.getElementById("mainCommandSet")
    ?? doc.querySelector("commandset")
    ?? doc.documentElement).appendChild(cmd);
  return cmd;
}

function pushIntoZenManager(win) {
  const mgr = win.gZenKeyboardShortcutsManager;
  const list = mgr?._currentShortcutList;
  if (!list) return false;
  const KeyShortcut = list[0]?.constructor;
  if (!KeyShortcut?.parseFromSaved) return false;

  // Settings renders rows in reverse list order (groupHeader.after() inserts
  // each new row right under the header). To appear visually BELOW the
  // "New Tab" row, our entry must sit BEFORE key_newNavigatorTab in the list.
  const anchorIdx = list.findIndex(s => s.getID?.() === "key_newNavigatorTab");
  const targetIdx = anchorIdx >= 0 ? anchorIdx : list.length;
  const existingIdx = list.findIndex(s => s.getID?.() === KEY_ID);

  // Already at the right spot — nothing to do.
  if (existingIdx === targetIdx || (anchorIdx < 0 && existingIdx >= 0)) return true;

  let entry;
  if (existingIdx >= 0) {
    // Wrong position — pull it out so we can re-splice.
    [entry] = list.splice(existingIdx, 1);
  } else {
    [entry] = KeyShortcut.parseFromSaved([{
      id: KEY_ID,
      key: "T",
      keycode: null,
      group: GROUP,
      l10nId: null,
      modifiers: { control: false, alt: true, shift: false, meta: false, accel: true },
      action: CMD_ID,
      disabled: false,
      reserved: false,
      internal: false,
    }]);
  }

  // Recompute anchor since the splice above may have shifted it. Insert
  // BEFORE the anchor so the reverse-order render places us right below it.
  const reAnchor = list.findIndex(s => s.getID?.() === "key_newNavigatorTab");
  const insertAt = reAnchor >= 0 ? reAnchor : list.length;
  list.splice(insertAt, 0, entry);

  try { mgr.triggerShortcutRebuild?.(); } catch (e) { console.warn("[Zenfold] rebuild:", e); }
  try { mgr._saveShortcuts?.(); } catch (e) { console.warn("[Zenfold] save:", e); }
  return true;
}

function fallbackXULKey(win) {
  const doc = win.document;
  if (doc.getElementById(KEY_ID)) return null;
  const key = doc.createXULElement("key");
  key.id = KEY_ID;
  key.setAttribute("key", "T");
  key.setAttribute("modifiers", "accel,alt");
  key.setAttribute("command", CMD_ID);
  key.setAttribute("label", "Zenfold: New tab in current folder");
  const keyset = doc.getElementById("mainKeyset") ?? doc.querySelector("keyset");
  keyset.appendChild(key);
  if (keyset?.parentNode) keyset.parentNode.appendChild(keyset);
  return key;
}

export const Keybinds = {
  install(win) {
    const cmd = registerCommand(win);
    let fallback = null;

    const wireUp = () => {
      if (!pushIntoZenManager(win)) {
        // Manager unavailable; register a plain XUL <key> so the shortcut still works.
        fallback = fallbackXULKey(win);
      }
    };

    if (win.gZenKeyboardShortcutsManager?._currentShortcutList) {
      wireUp();
    } else {
      const onReady = () => {
        win.removeEventListener("ZenKeyboardShortcutsReady", onReady);
        wireUp();
      };
      win.addEventListener("ZenKeyboardShortcutsReady", onReady);
    }

    return () => {
      fallback?.remove();
      cmd.remove();
      const list = win.gZenKeyboardShortcutsManager?._currentShortcutList;
      if (list) {
        const i = list.findIndex(s => s.getID?.() === KEY_ID);
        if (i >= 0) list.splice(i, 1);
      }
    };
  },
};
