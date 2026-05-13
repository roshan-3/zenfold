# Phase 1 Observations

Anything surprising, environment-specific, or worth knowing while building the mod.

## Environment

- **Zen version**: `1.19.12b`, build `20260507044029`
- **`zen.version` pref**: `unset` in this build. Don't read it. Use `Services.appinfo.version` for version detection.
- **User has a custom theme** that overrides Zen's light-mode sidebar to render dark. Consequence:
  - `notes/baseline-light-*.png` and `notes/baseline-dark-*.png` look visually identical.
  - These baselines reflect the user's actual environment, not vanilla Zen light theme.
  - For visual regression testing (`tests/visual/`), we should capture clean-profile baselines later in addition to these env-specific ones.
  - Mod theming logic cannot infer light/dark from sidebar background alone. Use `Services.appinfo`, `matchMedia("(prefers-color-scheme: dark)")`, or `--toolbar-color-scheme` (seen as `dark` in inherited styles during DOM capture) instead.

## Tooling

- **`:screenshot` DevTools command is broken** in Zen 1.19.12b:
  ```
  Error occurred while creating actor server1.conn1.screenshotActor29:
  ChromeUtils.importESModule: global option is required in DevTools distinct global
  ```
  Workaround used: Windows Snipping Tool (`Win+Shift+S`). Visual regression tests will need a non-DevTools capture path (Playwright, OS-level, or fixed when Zen rebases on a newer Firefox).

## DOM / API surprises

- **No per-folder color attribute.** `<zen-folder>` only carries workspace-derived CSS vars (`--tab-group-color`, `--tab-group-color-invert`, `--tab-group-color-pale`). A per-folder color mod must add its own attribute and override these three vars on the element.
- **No `--zen-folder-indent` CSS var.** Despite intuition, this var is not defined. Indent is implemented with plain CSS rules. Don't depend on the var.
- **No `collapse` / `expand` / `addTab` methods on the folder element.** Only `addTabs([tab,...])` exists; collapse is the `collapsed` attribute, animated by `gZenFolders.animateCollapse` / `animateExpand`.
- **`gZenFolders` members live on the prototype**, not on the instance. `Object.getOwnPropertyNames(gZenFolders)` returns `[]`. Probe via `Object.getOwnPropertyNames(Object.getPrototypeOf(gZenFolders))`.
- **`gZenFolders` uses a private `#groupInit(folder)` method** inside `createFolder`. We cannot replicate `createFolder` by hand because private methods are unreachable. Always call `gZenFolders.createFolder` to make folders programmatically; do not bypass it.
- **Every folder always has a pinned `about:blank` "empty tab" as its first child** (created with `_forZenEmptyTab: true`). It is not optional and not a UI placeholder — it owns the folder's pinned state. The mod must never delete it or treat it as a real user tab.
- **Folders only contain pinned tabs.** All `<tab>` children carry `pinned="true"`. If we add unpinned-folder support later, that is a significant architecture change.
- **Collapsed folder children get `aria-hidden="true"`** in addition to `collapsed=""` on the folder. Selectors like `tab:not([aria-hidden])` are usable to enumerate visible tabs.
- **Stable folder IDs.** `id` attribute is a timestamp-suffix string (e.g. `1778651155346-32`), kept stable across restarts. Safe to use as the mod's primary key.
- **`tab.group`** returns the parent `zen-folder` element directly (tag name `"zen-folder"`). `tab.closest("zen-folder")` works for ancestor lookup. Both confirmed.
- **Folder SVG icon has an empty `<image href="">` slot** inside `<g class="icon">`. This is the per-folder favicon slot, settable via `gZenFolders.setFolderUserIcon`.
- **Overflow badge.** `<vbox class="tab-group-overflow-count-container">` shows `+N more tabs` when not all tabs fit. Useful UI surface for the mod (e.g., show tab count even when expanded).
- **`gZenWorkspaces.activeWorkspace` is a UUID string**, not a workspace object. Matches the `zen-workspace-id` attribute on folders. Don't try to read properties off it.

## Useful selectors recap

| Need | Selector |
|---|---|
| Any folder | `zen-folder` |
| Folder by ID | `zen-folder#<id>` |
| Folders in workspace | `zen-folder[zen-workspace-id="<uuid>"]` |
| Collapsed folder | `zen-folder[collapsed]` |
| Folder with active tab | `zen-folder[hasactivetab]` |
| Folder with >1 tab | `zen-folder[hasmultipletabs]` |
| Folder's clickable header | `zen-folder > .tab-group-label-container` |
| Folder's body container | `zen-folder > .tab-group-container` |
| Folder's icon slot | `zen-folder .tab-group-folder-icon svg g.icon image` |
| Folder's label text | `zen-folder > .tab-group-label-container > .tab-group-label` |
| Tabs inside a folder | `zen-folder > .tab-group-container > tab[is="tabbrowser-tab"]` |
| Visible (non-hidden) folder tabs | `zen-folder > .tab-group-container > tab:not([aria-hidden])` |
| Pinned-area insertion anchor | `.pinned-tabs-container-separator` |
