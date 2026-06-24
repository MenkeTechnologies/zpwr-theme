# ZPWR Themes — Palette & Role Mapping

The **color values** for all 5 schemes (Cyberpunk, Midnight, Matrix, Ember,
Arctic), each in dark and light, live in
[`palette/schemes.json`](palette/schemes.json) — ported from
`Audio-Haxor/frontend/js/settings.js` (the in-app preset colorschemes). That
file is the single source of truth; `scripts/generate.mjs` maps it to every
editor theme.

This document describes the **role mapping** — which palette slot drives which
editor token — using the default **Cyberpunk (dark)** scheme as the example.
The same mapping applies to every scheme/variant.

## Base (Cyberpunk dark)

| Name | Hex | Use |
|---|---|---|
| Ink | `#05050a` | editor / terminal background |
| Panel | `#0a0a14` | side bar, tool windows, popups |
| Card | `#0d0d1a` | inputs, widgets, current-line |
| Hover | `#12122a` | selection / hover surfaces |
| Border | `#1a1a3e` | separators, outlines |
| Text | `#e0f0ff` | default foreground |
| Text soft | `#c8d8ee` | secondary identifiers |
| Text dim | `#7a8ba8` | punctuation, inactive |
| Muted | `#3d4f6a` | line numbers, doc comments |

## Accents

| Name | Hex | Syntax role |
|---|---|---|
| Cyan | `#05d9e8` | functions, operators, links, active UI |
| Cyan bright | `#4ae8ff` | interpolation, fields, hover |
| Pink (accent) | `#ff2a6d` | keywords, storage, tags, errors |
| Magenta | `#d300c5` | sigils, special vars, regex, threading |
| Green | `#39ff14` | strings, caret, additions |
| Orange | `#ff8c1a` | numbers, constants, escapes |
| Yellow | `#ffb800` | types, classes, attributes, warnings |
| Comment | `#5e7290` | line / block comments (italic) |

## Notes

- Editor backgrounds use **Ink** (`#05050a`); chrome (side bar / panels) steps
  up to **Panel** (`#0a0a14`) so the code surface reads as the deepest layer.
- Threading / concurrency tokens (stryke `~>`, `~>>`, parallel primitives) get
  **Magenta bold** to make the language's defining feature pop.
- Both editions point at this table; changing a value here means updating
  `vscode/themes/zpwr-cyberpunk-hud-color-theme.json` and
  `jetbrains/src/main/resources/zpwr-cyberpunk-hud.{theme.json,xml}` together.
