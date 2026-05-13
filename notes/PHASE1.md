# Phase 1 — Discovery Playbook

Goal: capture the real DOM shape, JS API surface, and visual baseline of Zen folders on your current Zen version. The output of this phase drives every selector and API call in the mod.

You run these steps in Zen. Paste outputs into the files indicated. When all five outputs exist, we're done with Phase 1.

---

## Step 0 — Enable the Browser Toolbox

In `about:config`, set:
- `devtools.chrome.enabled` = `true`
- `devtools.debugger.remote-enabled` = `true`
- `toolkit.legacyUserProfileCustomizations.stylesheets` = `true`

Restart Zen.

---

## Step 1 — Build the test scenario

In Zen (your normal window is fine, or create a fresh test profile via `zen.exe -P`):

1. Open at least 4 tabs.
2. Create a folder named `Test` containing 3 of those tabs.
3. Inside `Test`, create a sub-folder named `Nested` and move 1 tab into it.
4. Leave the 4th tab outside any folder.
5. Click into one tab inside `Test` so it becomes the active tab.
6. Collapse `Nested`, leave `Test` open.

This gives us: open folder + closed folder + nested folder + folder containing the active tab + a control tab outside.

---

## Step 2 — Capture DOM

1. Press `Ctrl+Shift+Alt+I` to open the Browser Toolbox.
2. Inspector tab, pick the `<zen-folder>` for `Test`.
3. Right-click the node in the tree -> Copy -> Outer HTML.
4. Save into `notes/folder-dom.html` in this repo.

Repeat for the `Nested` folder and append it to the same file under a `<!-- Nested -->` separator.

---

## Step 3 — Capture API surface

In the Browser Toolbox Console, paste each line below and copy the full output. Save everything into `notes/api-probes.txt`.

```js
// --- version ---
Services.appinfo.version
Services.appinfo.appBuildID
Services.prefs.getCharPref("zen.version", "unset")

// --- folder element + class ---
const f = document.querySelector("zen-folder");
f.constructor.name
f.tagName
[...f.attributes].map(a => `${a.name}="${a.value}"`).join(" ")

// --- methods on the folder element ---
Object.getOwnPropertyNames(Object.getPrototypeOf(f))
typeof f.addTabs
typeof f.addTab
typeof f.collapse
typeof f.expand

// --- gZenFolders surface ---
typeof window.gZenFolders
Object.getOwnPropertyNames(window.gZenFolders).sort()
window.gZenFolders.createFolder?.toString().slice(0, 400)

// --- active tab + folder traversal ---
const t = gBrowser.selectedTab;
t.group?.tagName
t.closest?.("zen-folder")?.label
t.group?.id

// --- folder ID stability check ---
document.querySelectorAll("zen-folder").length
[...document.querySelectorAll("zen-folder")].map(x => ({
  id: x.id,
  label: x.label,
  workspaceId: x.getAttribute("zen-workspace-id")
}))

// --- workspace API ---
typeof window.gZenWorkspaces
window.gZenWorkspaces?.activeWorkspace

// --- existing color attribute (if any) ---
[...f.attributes].filter(a => /color|hue|tint/i.test(a.name))
getComputedStyle(f).getPropertyValue("--zen-folder-indent")
```

---

## Step 4 — Visual baseline screenshots

In the Browser Toolbox Console:

```js
// expand Test, collapse Nested -- already done in setup
:screenshot notes/baseline-light-open.png --selector "#tabbrowser-tabs" --dpr 2
```

Then:
1. Toggle Zen to dark theme.
2. `:screenshot notes/baseline-dark-open.png --selector "#tabbrowser-tabs" --dpr 2`
3. Collapse `Test`, repeat for both themes: `baseline-light-closed.png`, `baseline-dark-closed.png`.

Move all four PNGs into `notes/`.

---

## Step 5 — Note anything weird

Anything that surprised you while doing the above: write it into `notes/observations.md`. Examples: a folder attribute we didn't expect, a method that throws, animations that fight CSS.

---

## Done when

`notes/` contains:
- `folder-dom.html`
- `api-probes.txt`
- `baseline-light-open.png`
- `baseline-light-closed.png`
- `baseline-dark-open.png`
- `baseline-dark-closed.png`
- `observations.md` (can be empty if nothing weird)

Ping me when those are in place and I will lock down the compat manifest schema, pick real selectors, and start Phase 2 (scaffold the actual mod files).
