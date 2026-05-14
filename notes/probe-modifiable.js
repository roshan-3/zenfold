(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  const mgr = win.gZenKeyboardShortcutsManager;

  const modif = mgr.getModifiableShortcuts?.();
  r.push("type: " + typeof modif + " isArray: " + Array.isArray(modif));
  r.push("constructor: " + modif?.constructor?.name);
  if (modif) {
    const own = Object.keys(modif);
    r.push("keys (top-level): " + own.slice(0, 30).join(","));
    // If it's grouped, find windowAndTabManagement
    const wt = modif["windowAndTabManagement"];
    r.push("windowAndTabManagement: type=" + typeof wt + " isArray=" + Array.isArray(wt) + " len=" + wt?.length);
    if (Array.isArray(wt)) {
      const ours = wt.find(s => s.getID?.() === "key_zenfoldNewTabInFolder");
      r.push("ours in WTM: " + !!ours);
      // Show first 3 entries in WTM
      r.push("first 3 WTM ids+l10n: " + wt.slice(0, 3).map(s => s.getID?.() + "(" + s.getL10NID?.() + ")").join(" | "));
      // How many in WTM have null l10nId?
      const nullL10n = wt.filter(s => !s.getL10NID?.()).map(s => s.getID?.());
      r.push("WTM entries with null l10nId (" + nullL10n.length + "): " + nullL10n.join(","));
    }
    // If it's a Map
    if (modif instanceof Map) {
      r.push("Map keys: " + [...modif.keys()].join(","));
    }
  }

  // Look in Zen prefs UI source — find the settings panel module
  try {
    const url = "chrome://browser/content/preferences/zen-settings.js";
    const ch = Services.io.newChannel(url, null, null, null, Services.scriptSecurityManager.getSystemPrincipal(), null, Ci.nsILoadInfo.SEC_ALLOW_CROSS_ORIGIN_SEC_CONTEXT_IS_NULL, Ci.nsIContentPolicy.TYPE_OTHER);
    r.push("zen-settings.js openable: maybe");
  } catch (e) {}

  console.log("ZENFOLD-PROBE-MODIF:\n" + r.join("\n"));
  return "see console";
})();
