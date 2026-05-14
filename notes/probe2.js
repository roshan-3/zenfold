(() => {
  const r = [];
  try {
    const u = ChromeUtils.importESModule("chrome://userchromejs/content/utils.sys.mjs");
    const lml = u.loaderModuleLink;
    r.push("loaderModuleLink keys: " + Object.keys(lml).join(","));
    if (typeof lml.matchScripts === "function") {
      const all = lml.matchScripts(() => true, true);
      r.push("registered scripts count: " + all.length);
      for (const s of all) {
        r.push("  - " + s.filename + " isESM=" + s.isESM + " noExec=" + s.noExec + " injectionFailed=" + s.injectionFailed + " isRunning=" + s.isRunning + " regex=" + (s.regex ? s.regex.source : "null"));
      }
    } else {
      r.push("matchScripts not a function");
    }
  } catch (e) {
    r.push("LML_THREW=" + e.message);
  }
  try {
    const m = ChromeUtils.importESModule("chrome://userscripts/content/zenfold/colors.mjs");
    r.push("colors.mjs import OK keys=" + Object.keys(m).join(","));
  } catch (e) {
    r.push("colors_THREW=" + e.message);
  }
  console.log("ZENFOLD-PROBE-B:\n" + r.join("\n"));
  return r.join(" || ");
})();
