(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  const mgr = win.gZenKeyboardShortcutsManager;
  const list = mgr?._currentShortcutList;
  r.push("list len: " + (list?.length ?? "missing"));

  const ours = list?.find(s => s.getID?.() === "key_zenfoldNewTabInFolder");
  r.push("our entry present: " + !!ours);
  if (ours) {
    r.push("  toJSONForm: " + JSON.stringify(ours.toJSONForm?.()));
    r.push("  isUserEditable: " + ours.isUserEditable?.());
    r.push("  isDisabled: " + ours.isDisabled?.());
    r.push("  isReserved: " + ours.isReserved?.());
    r.push("  isInternal: " + ours.isInternal?.());
    r.push("  isInvalid: " + ours.isInvalid?.());
    r.push("  isEmpty: " + ours.isEmpty?.());
    r.push("  shouldBeEmpty: " + ours.shouldBeEmpty?.());
    r.push("  getKeyName: " + ours.getKeyName?.());
    r.push("  getL10NID: " + ours.getL10NID?.());
    r.push("  toDisplayString: " + ours.toDisplayString?.());
  }

  // Does getModifiableShortcuts include ours?
  try {
    const modif = mgr.getModifiableShortcuts?.();
    r.push("getModifiableShortcuts count: " + modif?.length);
    const inModif = modif?.some(s => s.getID?.() === "key_zenfoldNewTabInFolder");
    r.push("our entry in modifiable: " + inModif);
    // Show first modifiable entry shape
    if (modif?.[0]) {
      r.push("  first modifiable id: " + modif[0].getID?.() + " l10n: " + modif[0].getL10NID?.());
    }
  } catch (e) { r.push("getModifiableShortcuts THREW: " + e.message); }

  // Is there a key element with our id in the XUL keyset?
  const keyEl = win.document.getElementById("key_zenfoldNewTabInFolder");
  r.push("XUL <key> in DOM: " + !!keyEl);
  if (keyEl) {
    r.push("  key=" + keyEl.getAttribute("key") + " mods=" + keyEl.getAttribute("modifiers") + " cmd=" + keyEl.getAttribute("command"));
  }

  // Is the cmd registered?
  const cmdEl = win.document.getElementById("cmd_zenfoldNewTabInFolder");
  r.push("XUL <command> in DOM: " + !!cmdEl);

  console.log("ZENFOLD-PROBE-VISIBLE:\n" + r.join("\n"));
  return "see console";
})();
