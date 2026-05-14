# Zenfold

Folder-aware "new tab in current folder" shortcut and link context menu for
[Zen Browser](https://zen-browser.app/).

Status: v0.1 MVP. Tested against Zen 1.19.12b on Windows 11.

## Features

- **`Ctrl+Shift+T`** — open a new pinned tab inside the currently active
  folder. Rebindable from Zen's Keyboard Shortcuts settings page (look for
  `key_zenfoldNewTabInFolder` / *Zenfold: New tab in current folder*).
- **"Open in current folder"** — appears in the link right-click menu, right
  under *Open Link in New Tab*. Visible only when the current tab is inside
  a folder.

Master toggle (`about:config`):

- `zenfold.keybinds.enabled` (bool, default `true`)

## Requirements

Zen ships with the same chrome architecture as Firefox. To execute JavaScript
inside the chrome window, you need a userChrome.js loader. Zenfold targets
[fx-autoconfig by MrOtherGuy](https://github.com/MrOtherGuy/fx-autoconfig).

The official Zen Mods store does not execute JavaScript, only CSS. Zenfold is
installed manually until/unless Zen ships a script-capable mod surface.

## Install (Windows)

1. **Install fx-autoconfig.**
   - Download the latest release of fx-autoconfig.
   - Copy `config.js` and the `defaults\` directory from the loader's
     `program\` folder into the Zen install directory (the folder containing
     `zen.exe`, typically `C:\Program Files\Zen Browser\`). The program
     directory is read-only by default; you will need an elevated copy.

2. **Drop Zenfold into your Zen profile.**

   Find your profile directory:

   ```
   %APPDATA%\zen\Profiles\<your-profile>\
   ```

   Copy this repo's `chrome/` into that profile so the layout becomes:

   ```
   <profile>\chrome\
     JS\
       zenfold.uc.mjs
       zenfold\
         keybinds.mjs
         contextmenu.mjs
         prefs.mjs
     utils\           # from fx-autoconfig
   ```

3. **Clear the startup cache and restart Zen.**

   ```powershell
   Remove-Item -Recurse -Force "$env:APPDATA\zen\Profiles\<your-profile>\startupCache"
   ```

   On first run you should see `[Zenfold] v0.1.0 ready` in the Browser
   Console (`Ctrl+Shift+J`).

## Usage

- **New tab in current folder:** focus a tab inside the folder you want,
  press `Ctrl+Shift+T`. The new tab is pinned and inserted into the folder.
- **Open link in current folder:** right-click any link on a page whose tab
  is inside a folder, choose *Open in current folder*.

## Uninstall

Delete `<profile>\chrome\JS\zenfold*`, then restart Zen.

## Project layout

```
theme.json              # Zen Mod manifest (kept for future script-capable mod surface)
preferences.json        # Pref schema surfaced in Zen Mods UI
chrome/
  JS/
    zenfold.uc.mjs      # fx-autoconfig entry point
    zenfold/
      keybinds.mjs      # Ctrl+Shift+T -> new tab in folder
      contextmenu.mjs   # "Open in current folder" link menu item
      prefs.mjs         # about:config helpers
notes/                  # Phase 1 discovery artifacts (DOM, API probes)
```

## Known limitations

- Tested only against Zen 1.19.12b. Folder DOM/API may move in newer builds.
- `Ctrl+Shift+T` is normally "reopen closed tab" in Firefox; Zenfold takes
  over this binding window-wide. Rebind via Zen's Keyboard Shortcuts page,
  or set `zenfold.keybinds.enabled` to `false` to restore the default.

## License

TBD.
