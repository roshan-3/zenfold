// Pref helpers for Zenfold.

const PREF_KEYBINDS_ENABLED = "zenfold.keybinds.enabled";

export const Prefs = {
  get keybindsEnabled() {
    return Services.prefs.getBoolPref(PREF_KEYBINDS_ENABLED, true);
  },

  observe(pref, callback) {
    const observer = {
      observe: (_subject, _topic, data) => {
        if (data === pref) callback();
      },
    };
    Services.prefs.addObserver(pref, observer);
    return () => Services.prefs.removeObserver(pref, observer);
  },
};

export const PrefNames = {
  KEYBINDS_ENABLED: PREF_KEYBINDS_ENABLED,
};
