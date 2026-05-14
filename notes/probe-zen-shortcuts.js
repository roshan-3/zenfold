(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");

  const mgr = win.gZenKeyboardShortcutsManager;
  r.push("gZenKeyboardShortcutsManager: " + (mgr ? typeof mgr : "MISSING"));
  if (mgr) {
    const proto = Object.getPrototypeOf(mgr);
    r.push("  proto methods: " + Object.getOwnPropertyNames(proto).join(","));
    r.push("  own keys: " + Object.getOwnPropertyNames(mgr).join(","));
    try {
      const list = mgr._currentShortcutList;
      r.push("  _currentShortcutList: " + (list ? "len=" + list.length : "missing"));
      if (list?.length) {
        const sample = list[0];
        const sproto = Object.getPrototypeOf(sample);
        r.push("    sample className: " + sample.constructor?.name);
        r.push("    sample proto methods: " + Object.getOwnPropertyNames(sproto).join(","));
        try { r.push("    sample toJSONForm: " + JSON.stringify(sample.toJSONForm?.())); } catch (e) { r.push("    toJSONForm THREW: " + e.message); }
        // Find a few unique groups
        const groups = new Set(list.map(s => { try { return s.toJSONForm().group; } catch { return null; } }));
        r.push("    unique groups (" + groups.size + "): " + [...groups].slice(0, 20).join(","));
        // Sample action values
        const actions = list.slice(0, 5).map(s => { try { return s.toJSONForm().action; } catch { return null; } });
        r.push("    first 5 actions: " + actions.join(" | "));
      }
    } catch (e) { r.push("  list THREW: " + e.message); }
  }

  // Try to import the module directly to get KeyShortcut class
  try {
    const mod = ChromeUtils.importESModule("chrome://browser/content/zen-components/ZenKeyboardShortcuts.mjs");
    r.push("ZenKeyboardShortcuts.mjs import OK keys: " + Object.keys(mod).join(","));
  } catch (e) { r.push("import #1 THREW: " + e.message); }
  try {
    const mod = ChromeUtils.importESModule("resource:///modules/ZenKeyboardShortcuts.sys.mjs");
    r.push("resource import OK keys: " + Object.keys(mod).join(","));
  } catch (e) { r.push("import #2 THREW: " + e.message); }

  // Look for KeyShortcut on window
  r.push("window.KeyShortcut: " + typeof win.KeyShortcut);
  r.push("window.nsZenKeyboardShortcutsCommon: " + typeof win.nsZenKeyboardShortcutsCommon);
  r.push("ZenKeyboardShortcutsReady event already fired? (manager has list): " + !!mgr?._currentShortcutList);

  // Look at the JSON file
  try {
    const dir = Services.dirsvc.get("ProfD", Ci.nsIFile);
    const f = dir.clone();
    f.append("zen-keyboard-shortcuts.json");
    r.push("zen-keyboard-shortcuts.json exists: " + f.exists() + " size: " + (f.exists() ? f.fileSize : 0));
  } catch (e) { r.push("file probe THREW: " + e.message); }

  console.log("ZENFOLD-PROBE-ZKS:\n" + r.join("\n"));
  return r.join(" || ");
})();
