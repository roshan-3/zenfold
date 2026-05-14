(() => {
  const r = [];
  try {
    const u = ChromeUtils.importESModule("chrome://userchromejs/content/utils.sys.mjs");
    const d = u.FileSystem.getScriptDir();
    r.push("scriptDir=" + d.path);
    r.push("isDir=" + d.isDirectory());
    for (const e of d) { r.push(" - " + e.leafName); }
  } catch (e) {
    r.push("FS_THREW=" + e.message);
  }
  try {
    const { AppConstants } = ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");
    r.push("BCU=" + AppConstants.BROWSER_CHROME_URL);
    const urls = [];
    for (const w of Services.wm.getEnumerator(null)) { urls.push(w.location.href); }
    r.push("wins=" + urls.join("|"));
  } catch (e) {
    r.push("AC_THREW=" + e.message);
  }
  console.log("ZENFOLD-PROBE-A:\n" + r.join("\n"));
  return r.join(" || ");
})();
