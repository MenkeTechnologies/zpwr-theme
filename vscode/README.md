# ZPWR Cyberpunk HUD — VS Code

Cyberpunk dark color theme: deep-space ink, neon cyan, magenta scanlines — the
**Strykelang HUD** palette shared across the MenkeTechnologies stack
(`zpwrchrome`, `zpwr`, `strykelang`). Companion to
[`vscode-stryke`](https://github.com/MenkeTechnologies/vscode-stryke).

## Install

From the Marketplace: search **ZPWR Cyberpunk HUD**. Or build locally:

```sh
npx --yes @vscode/vsce package
code --install-extension zpwr-cyberpunk-hud-*.vsix
```

Activate with **Cmd/Ctrl+K Cmd/Ctrl+T** → **ZPWR Cyberpunk HUD**.

## What it colors

Full workbench chrome (activity bar, side bar, tabs, status bar, terminal ANSI,
panels, git decorations, bracket-pair colors) plus syntax token colors. Includes
stryke-specific scopes — sigils, `~>` / `~>>` threading operators, and parallel
builtins get the magenta accent so the language's defining features stand out.

Palette reference: [`../PALETTE.md`](https://github.com/MenkeTechnologies/zpwr-theme/blob/main/PALETTE.md).

## License

MIT.
