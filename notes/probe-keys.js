(() => {
  const r = [];
  const win = Services.wm.getMostRecentWindow("navigator:browser");
  const doc = win.document;

  // Check menu access key (18 = Alt on Windows)
  try {
    r.push("ui.key.menuAccessKey=" + Services.prefs.getIntPref("ui.key.menuAccessKey"));
  } catch (e) { r.push("menuAccessKey THREW " + e.message); }
  try {
    r.push("ui.key.menuAccessKeyFocuses=" + Services.prefs.getBoolPref("ui.key.menuAccessKeyFocuses"));
  } catch (e) {}

  // Our keys present?
  const k1 = doc.getElementById("key_zenfoldJumpFolder1");
  r.push("key_zenfoldJumpFolder1 present: " + !!k1);
  if (k1) {
    r.push("  key=" + k1.getAttribute("key") + " modifiers=" + k1.getAttribute("modifiers") + " command=" + k1.getAttribute("command"));
    r.push("  parent.id=" + k1.parentNode?.id);
  }

  // Any OTHER <key> elements that bind Alt+1?
  const allKeys = [...doc.querySelectorAll("key")];
  const altDigit = allKeys.filter(k => {
    const m = (k.getAttribute("modifiers") || "");
    const key = (k.getAttribute("key") || "");
    return /\balt\b/i.test(m) && /^[1-9]$/.test(key);
  });
  r.push("alt+digit keys total: " + altDigit.length);
  for (const k of altDigit) {
    r.push("  id=" + k.id + " key=" + k.getAttribute("key") + " modifiers=" + k.getAttribute("modifiers") + " command=" + k.getAttribute("command") + " disabled=" + k.getAttribute("disabled"));
  }

  // Can we invoke the command directly?
  try {
    const cmd = doc.getElementById("cmd_zenfoldJumpFolder1");
    r.push("cmd_zenfoldJumpFolder1 present: " + !!cmd);
  } catch (e) {}

  console.log("ZENFOLD-PROBE-KEYS:\n" + r.join("\n"));
  return r.join(" || ");
})();
