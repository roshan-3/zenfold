(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  if (!win) { console.log("ZENFOLD-PROBE-FOLDERS: no browser window"); return "no window"; }
  const doc = win.document;
  const wsId = win.gZenWorkspaces?.activeWorkspace;
  r.push("activeWorkspace=" + JSON.stringify(wsId));

  const allFolders = [...doc.querySelectorAll("zen-folder")];
  r.push("total zen-folder elements: " + allFolders.length);
  for (let i = 0; i < allFolders.length; i++) {
    const f = allFolders[i];
    r.push("  [" + i + "] id=" + f.id + " ws=" + f.getAttribute("zen-workspace-id") + " collapsed=" + f.hasAttribute("collapsed"));
  }

  if (wsId) {
    const inWs = [...doc.querySelectorAll('zen-folder[zen-workspace-id="' + wsId + '"]')];
    r.push("folders matching active ws selector: " + inWs.length);
  }

  if (allFolders.length > 0) {
    const f0 = allFolders[0];
    const allTabs = f0.querySelectorAll('tab[is="tabbrowser-tab"]');
    const visTabs = f0.querySelectorAll('tab[is="tabbrowser-tab"]:not([aria-hidden]):not([zen-empty-tab])');
    r.push("folder[0] all tabs: " + allTabs.length + " visible-non-empty: " + visTabs.length);
  }

  console.log("ZENFOLD-PROBE-FOLDERS:\n" + r.join("\n"));
  return r.join(" || ");
})();
