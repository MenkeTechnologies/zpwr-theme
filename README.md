```
 ___________        ______    _____ _   _ _____ __  __ _____
|__  /  _ \ \      / /  _ \  |_   _| | | | ____|  \/  | ____|
  / /| |_) \ \ /\ / /| |_) |   | | | |_| |  _| | |\/| |  _|
 / /_|  __/ \ V  V / |  _ <    | | |  _  | |___| |  | | |___
/____|_|     \_/\_/  |_| \_\   |_| |_| |_|_____|_|  |_|_____|
```

![Editors](https://img.shields.io/badge/editors-VS%20Code%20%C2%B7%20JetBrains-05d9e8?style=flat-square)
![Palette](https://img.shields.io/badge/palette-Strykelang%20HUD-ff2a6d?style=flat-square)
![Type](https://img.shields.io/badge/type-dark-39ff14?style=flat-square)
![MenkeTechnologies](https://img.shields.io/badge/MenkeTechnologies-theme-d300c5?style=flat-square)

### `[CYBERPUNK HUD COLOR THEME // ONE PALETTE, EVERY EDITOR]`

> *"Deep-space ink, neon cyan, magenta scanlines."*

The cyberpunk **Strykelang HUD** color theme, packaged for both **VS Code** and
**JetBrains** IDEs. Same palette that drives `zpwrchrome`'s page-theme injector,
the `strykelang` / `zshrs` / `zpwr` docs sites, and the `app-store` storefront —
now in your editor. Companion to [`vscode-stryke`](https://github.com/MenkeTechnologies/vscode-stryke).

## Palette

| Role | Hex | | Role | Hex |
|---|---|---|---|---|
| Ink (bg) | `#05050a` | | Cyan | `#05d9e8` |
| Panel | `#0a0a14` | | Accent / pink | `#ff2a6d` |
| Card | `#0d0d1a` | | Magenta | `#d300c5` |
| Hover | `#12122a` | | Green | `#39ff14` |
| Border | `#1a1a3e` | | Orange | `#ff8c1a` |
| Text | `#e0f0ff` | | Yellow | `#ffb800` |

Full mapping and rationale in [`PALETTE.md`](PALETTE.md).

## VS Code

The extension lives in [`vscode/`](vscode). Build and install locally:

```sh
cd vscode
npx --yes @vscode/vsce package   # produces zpwr-cyberpunk-hud-<version>.vsix
code --install-extension zpwr-cyberpunk-hud-*.vsix
```

Then **Cmd/Ctrl+K Cmd/Ctrl+T** → **ZPWR Cyberpunk HUD**.

## JetBrains (IntelliJ, PyCharm, WebStorm, CLion, Rider, …)

The plugin lives in [`jetbrains/`](jetbrains). A UI-theme plugin is pure
resources, so the build needs only `zip` — no Gradle or IDE SDK download:

```sh
cd jetbrains
./build-plugin.sh                # produces build/zpwr-theme-<version>.zip
```

Install via **Settings → Plugins → ⚙ → Install Plugin from Disk…** → pick the
zip, restart, then **Settings → Appearance & Behavior → Appearance → Theme →
ZPWR Cyberpunk HUD**.

## Layout

- `vscode/` — VS Code theme extension (`contributes.themes` + the color-theme JSON).
- `jetbrains/` — JetBrains theme plugin (`plugin.xml` + `*.theme.json` UI theme +
  editor color scheme XML) plus the dependency-free packaging script.
- `PALETTE.md` — the canonical color table shared by both editions.

## License

MIT — see [`LICENSE`](LICENSE).
