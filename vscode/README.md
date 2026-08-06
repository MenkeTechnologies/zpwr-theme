# ZPWR Cyberpunk HUD — VS Code

The MenkeTechnologies cyberpunk editor themes — the **8 canonical HUD
colorschemes** (Cyberpunk, Midnight, Matrix, Ember, Arctic, Crimson, Toxic, Vapor), each in **dark and
light** (16 total), on the shared **Strykelang HUD** palette (`zpwrchrome`,
`zpwr`, `strykelang`). Companion to
[`vscode-stryke`](https://github.com/MenkeTechnologies/vscode-stryke).

## Install

From the Marketplace: search **ZPWR Cyberpunk HUD**. Or build locally:

```sh
npx --yes @vscode/vsce package
code --install-extension zpwr-cyberpunk-hud-*.vsix
```

Activate with **Cmd/Ctrl+K Cmd/Ctrl+T** and pick any **ZPWR** scheme — e.g.
`ZPWR Midnight`, `ZPWR Matrix Light`.

## What it colors

Full workbench chrome (activity bar, side bar, tabs, status bar, terminal ANSI,
panels, git decorations, bracket-pair colors) plus syntax token colors. Includes
stryke-specific scopes — sigils, `~>` / `~>>` threading operators, and parallel
builtins get the magenta accent so the language's defining features stand out.

Theme files are generated from `palette/schemes.json`; see
[`../PALETTE.md`](https://github.com/MenkeTechnologies/zpwr-theme/blob/main/PALETTE.md).

## License

MIT.
