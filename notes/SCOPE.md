# zenfold — Scope

## Mod features (confirmed)

1. **Per-folder colors**
   - Override workspace accent on a per-folder basis.
   - Implementation hook: override `--tab-group-color`, `--tab-group-color-invert`, `--tab-group-color-pale` on the `<zen-folder>` element via `style` attribute.
   - Persist via `gZenFolders.storeDataForSessionStore` / `restoreDataFromSessionStore` (or a separate JSON pref).
   - UI: TBD (context menu entry on folder header? settings panel? color picker popup?).

2. **Keyboard shortcut navigation**
   - Including (and emphasized): **create a new tab inside a folder** via keybind.
   - Other folder-nav keybinds TBD (jump to folder by index? collapse/expand current? cycle folders?).
   - Implementation hook: register key listeners on the chrome window, resolve target folder
     from `gBrowser.selectedTab.group` or by index in `document.querySelectorAll("zen-folder")`,
     then call `gBrowser.addTab(...)` and `folder.addTabs([tab])`.

## Open questions (decide at Phase 2 kickoff)

- **Distribution target**: Zen Mod (zen-mod store), `userChrome.js` script (autoconfig loader),
  pure userChrome.css (not enough for keybinds — likely insufficient), or local-only hack?
- **Scope of first deliverable**: MVP (one color, one keybind) vs. full-featured first cut.
- **Keybind defaults**: which keys? Configurable? Conflict checking with Zen/Firefox defaults?
- **Color picker UX**: native `<input type="color">`, swatch palette, or HSL slider?
- **Per-folder color persistence**: piggyback Zen session store vs. separate `about:config` pref vs. JSON file in profile dir?

## Non-goals (for now)

- Per-folder custom icons (deferred — API exists via `setFolderUserIcon` if we revisit).
- Collapsed-state tab count overlay (deferred).
- Bulk operations across folders (deferred).
- Cross-workspace folder moves (deferred).
- Unpinned-tab folders (architecturally significant; deferred).
