# Zenfold

Folder-aware "new tab in current folder" shortcut and link context menu for
[Zen Browser](https://zen-browser.app/).

Status: v0.1 MVP. Tested against Zen 1.19.12b on Windows 11.

## Features

- **`Ctrl+Alt+T`** opens a new pinned tab inside the currently active folder,
  positioned immediately after the originating tab. Appears in Zen's Settings
  page under Keyboard Shortcuts, Window And Tab Management group
  (`key_zenfoldNewTabInFolder`), right below the *New Tab* row, and is
  rebindable from there.
- **"Open Link in current folder"** appears in the link right-click menu, just
  under *Open Link in New Tab*. Visible only when the active tab is inside a
  folder.

Master toggle (`about:config`):

- `zenfold.keybinds.enabled` (bool, default `true`)

## Requirements

Zen ships with the same chrome architecture as Firefox. To execute JavaScript
inside the chrome window, you need a userChrome.js loader. Zenfold targets
[fx-autoconfig by MrOtherGuy](https://github.com/MrOtherGuy/fx-autoconfig).

The official Zen Mods store does not execute JavaScript, only CSS. Zenfold is
installed manually until (or unless) Zen ships a script-capable mod surface.

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

- **New tab in current folder:** focus a tab inside the folder you want, press
  `Ctrl+Alt+T`. The new tab is pinned and dropped into the folder right after
  the tab you came from.
- **Open Link in current folder:** right-click a link on a page whose tab is
  inside a folder, choose *Open Link in current folder*.

To rebind: open Zen Settings, go to Keyboard Shortcuts, find
*cmd_zenfoldNewTabInFolder* in the *Window And Tab Management* group, and set
your preferred combination.

## Uninstall

1. Delete `<profile>\chrome\JS\zenfold*`.
2. Remove the saved entry from `<profile>\zen-keyboard-shortcuts.json` (or
   simply delete that file; Zen regenerates it on next launch).
3. Restart Zen.

## Project layout

```
theme.json              # Zen Mod manifest (forward-compat with a script-capable mod surface)
preferences.json        # Pref schema surfaced in Zen Mods UI
chrome/
  JS/
    zenfold.uc.mjs      # fx-autoconfig entry point
    zenfold/
      keybinds.mjs      # Ctrl+Alt+T -> new tab in current folder, registers with Zen Settings
      contextmenu.mjs   # "Open Link in current folder" link menu item
      prefs.mjs         # about:config helpers
notes/                  # Browser Console probes used during development
```

## Known limitations

- Tested only against Zen 1.19.12b. The folder DOM/API and the keyboard
  shortcuts manager surface may shift in newer builds.
- The shortcut entry is rendered with its raw action id
  (`cmd_zenfoldNewTabInFolder`) in Settings because Zenfold does not ship a
  Fluent localization string. Functional, just not pretty.
- Each window imports Zen's keyboard shortcuts module separately and keeps
  its own list, so Zenfold persists its entry to
  `<profile>\zen-keyboard-shortcuts.json` to make it visible to the Settings
  page. This means the entry is durable across restarts.

## License

TBD.
