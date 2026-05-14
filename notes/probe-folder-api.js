(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  const doc = win.document;
  const f = doc.querySelector("zen-folder");
  if (!f) { console.log("ZENFOLD-PROBE-API: no folder"); return "no folder"; }
  r.push("folder[0] id=" + f.id);
  for (const k of ["activeTabs", "allItems", "allItemsRecursive", "activeGroups"]) {
    try {
      const v = f[k];
      const len = v && typeof v.length !== "undefined" ? v.length : "n/a";
      r.push("  " + k + ": len=" + len);
      if (v && len && len > 0) {
        const first = v[0];
        r.push("    first.localName=" + first?.localName + " tagName=" + first?.tagName + " label=" + (first?.label || first?.getAttribute?.("label") || "?"));
      }
    } catch (e) {
      r.push("  " + k + ": THREW " + e.message);
    }
  }
  // Also check gBrowser tabs filtered by .group
  const folderTabs = [...win.gBrowser.tabs].filter(t => t.group === f);
  r.push("gBrowser.tabs where .group === folder: " + folderTabs.length);
  if (folderTabs.length > 0) {
    r.push("  first label=" + folderTabs[0].label);
  }
  console.log("ZENFOLD-PROBE-API:\n" + r.join("\n"));
  return r.join(" || ");
})();
