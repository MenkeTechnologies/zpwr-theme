# Changelog

## 0.2.0

- Expand to the full set of Audio-Haxor preset colorschemes: **Cyberpunk,
  Midnight, Matrix, Ember, Arctic**, each in **dark and light** (10 variants per
  editor).
- All theme files are now generated from `palette/schemes.json` via
  `scripts/generate.mjs`; CI fails on drift. One palette table, two editions.
- JetBrains plugin now registers all 10 theme providers; packager globs every
  generated theme/scheme file.


## 0.1.0

- Initial release. Cyberpunk HUD color theme for VS Code and JetBrains IDEs,
  built on the canonical Strykelang HUD palette (see PALETTE.md).
- VS Code: full workbench colors + token colors, with stryke-specific scopes
  (sigils, threading operators, parallel builtins).
- JetBrains: UI theme + matching editor color scheme; dependency-free packaging.
