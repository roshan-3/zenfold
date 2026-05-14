(async () => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  const mgr = win.gZenKeyboardShortcutsManager;
  try {
    const modif = await mgr.getModifiableShortcuts();
    r.push("resolved type: " + typeof modif + " isArray: " + Array.isArray(modif));
    r.push("constructor: " + modif?.constructor?.name);
    if (Array.isArray(modif)) {
      r.push("length: " + modif.length);
      const ours = modif.find(s => s.getID?.() === "key_zenfoldNewTabInFolder" || s.id === "key_zenfoldNewTabInFolder");
      r.push("ours present: " + !!ours);
      if (ours) r.push("  ours shape: " + JSON.stringify(ours.toJSONForm?.() ?? ours).slice(0, 400));
      r.push("first 3: " + modif.slice(0, 3).map(s => (s.getID?.() ?? s.id) + " l10n=" + (s.getL10NID?.() ?? s.l10nId)).join(" | "));
      const nullL10n = modif.filter(s => !(s.getL10NID?.() ?? s.l10nId));
      r.push("entries with null l10nId: " + nullL10n.length + " of " + modif.length);
    } else if (modif && typeof modif === "object") {
      const keys = Object.keys(modif);
      r.push("group keys: " + keys.join(","));
      const wt = modif["windowAndTabManagement"];
      r.push("WTM type: " + typeof wt + " isArray: " + Array.isArray(wt) + " len: " + wt?.length);
      if (Array.isArray(wt)) {
        const ours = wt.find(s => (s.getID?.() ?? s.id) === "key_zenfoldNewTabInFolder");
        r.push("ours in WTM: " + !!ours);
        r.push("first 3 WTM: " + wt.slice(0, 3).map(s => (s.getID?.() ?? s.id) + " l10n=" + (s.getL10NID?.() ?? s.l10nId)).join(" | "));
      }
    }
  } catch (e) {
    r.push("getModifiableShortcuts THREW: " + e.message + " stack=" + e.stack?.slice(0, 200));
  }
  console.log("ZENFOLD-PROBE-MODIF2:\n" + r.join("\n"));
})();
