(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");

  // gZenFolders prototype - look for anything position-related
  const gf = win.gZenFolders;
  r.push("gZenFolders: " + typeof gf);
  if (gf) {
    const proto = Object.getPrototypeOf(gf);
    const names = Object.getOwnPropertyNames(proto);
    r.push("gZenFolders proto count: " + names.length);
    r.push("gZenFolders all methods: " + names.join(","));
    // Search for insert/move/position related
    const interesting = names.filter(n => /insert|move|position|add|place|reorder|index/i.test(n));
    r.push("gZenFolders insert/move-ish: " + interesting.join(","));
  }

  // zen-folder element prototype
  const folder = win.document.querySelector("zen-folder");
  if (folder) {
    const proto = Object.getPrototypeOf(folder);
    const names = Object.getOwnPropertyNames(proto);
    r.push("nsZenFolder proto count: " + names.length);
    r.push("nsZenFolder all methods: " + names.join(","));
    const interesting = names.filter(n => /insert|move|position|add|place|reorder|index/i.test(n));
    r.push("nsZenFolder insert/move-ish: " + interesting.join(","));

    // Inspect addTabs signature/source
    try {
      const src = proto.addTabs?.toString?.();
      r.push("addTabs source (first 800):\n" + (src ? src.slice(0, 800) : "n/a"));
    } catch (e) { r.push("addTabs src THREW: " + e.message); }
  }

  // gBrowser - does it have a Zen-aware move?
  const gb = win.gBrowser;
  if (gb) {
    const proto = Object.getPrototypeOf(gb);
    const names = Object.getOwnPropertyNames(proto);
    const interesting = names.filter(n => /zen|folder|group/i.test(n) || (/move/i.test(n)));
    r.push("gBrowser zen/folder/group/move methods: " + interesting.join(","));
    // Tabbrowser may also have own move methods
    const moveNames = names.filter(n => /^moveTab/i.test(n));
    r.push("gBrowser moveTab*: " + moveNames.join(","));
  }

  // gZenWorkspaces - look for moveTabToFolder / addTabToFolder
  const gw = win.gZenWorkspaces;
  if (gw) {
    const proto = Object.getPrototypeOf(gw);
    const names = Object.getOwnPropertyNames(proto);
    const interesting = names.filter(n => /insert|move|add|tab|group|folder|position/i.test(n));
    r.push("gZenWorkspaces interesting: " + interesting.slice(0, 60).join(","));
  }

  // Inspect tab.group setter? See if we can assign membership another way
  const tab = win.gBrowser?.selectedTab;
  if (tab && tab.group) {
    const tproto = Object.getPrototypeOf(tab);
    const descGroup = Object.getOwnPropertyDescriptor(tproto, "group");
    r.push("tab.group descriptor: " + JSON.stringify({ get: !!descGroup?.get, set: !!descGroup?.set, value: typeof descGroup?.value }));
  }

  console.log("ZENFOLD-PROBE-INSERT:\n" + r.join("\n"));
  return "see console";
})();
