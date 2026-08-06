```
 ___________        ______    _____ _   _ _____ __  __ _____
|__  /  _ \ \      / /  _ \  |_   _| | | | ____|  \/  | ____|
  / /| |_) \ \ /\ / /| |_) |   | | | |_| |  _| | |\/| |  _|
 / /_|  __/ \ V  V / |  _ <    | | |  _  | |___| |  | | |___
/____|_|     \_/\_/  |_| \_\   |_| |_| |_|_____|_|  |_|_____|
```

![Editors](https://img.shields.io/badge/editors-VS%20Code%20%C2%B7%20JetBrains-05d9e8?style=flat-square)
![Schemes](https://img.shields.io/badge/schemes-8%20%C3%97%20dark%2Flight-ff2a6d?style=flat-square)
![Palette](https://img.shields.io/badge/palette-Strykelang%20HUD-39ff14?style=flat-square)
![MenkeTechnologies](https://img.shields.io/badge/MenkeTechnologies-theme-d300c5?style=flat-square)

### `[CYBERPUNK HUD COLOR THEMES // EIGHT SCHEMES, EVERY EDITOR]`

> *"Deep-space ink, neon cyan, magenta scanlines."*

### [`Read the Docs`](https://menketechnologies.github.io/zpwr-theme/) &middot; [`Engineering Report`](https://menketechnologies.github.io/zpwr-theme/report.html)

The MenkeTechnologies cyberpunk editor themes — the **8 canonical HUD
colorschemes**, each in **dark and light** (16 variants), packaged for both
**VS Code** and **JetBrains** IDEs. Same palettes that drive `zpwrchrome`'s
page-theme injector, the `strykelang` / `zshrs` / `zpwr` docs sites, and the
`app-store` storefront — now in your editor. Companion to
[`vscode-stryke`](https://github.com/MenkeTechnologies/vscode-stryke).

## Schemes

| Scheme | Vibe | Accent | Cyan |
|---|---|---|---|
| **Cyberpunk** | hot pink + cyan neon | `#ff2a6d` | `#05d9e8` |
| **Midnight** | deep blue + electric purple | `#7c3aed` | `#38bdf8` |
| **Matrix** | terminal green on black | `#22c55e` | `#39ff14` |
| **Ember** | warm amber + orange | `#f59e0b` | `#fb923c` |
| **Arctic** | cool whites + icy blue | `#0ea5e9` | `#67e8f9` |
| **Crimson** | rose-red + teal highlight | `#e11d48` | `#2dd4bf` |
| **Toxic** | acid-lime + magenta | `#c6ff00` | `#00e5ff` |
| **Vapor** | vaporwave pastel pink + cyan | `#ff6ec7` | `#72f1ff` |

Each ships a **dark** (e.g. `ZPWR Cyberpunk`) and a **light** (`ZPWR Cyberpunk
Light`) variant. The full per-scheme palette is in
[`palette/schemes.json`](palette/schemes.json) (ported from the canonical HUD
catalog); the
role mapping is in [`PALETTE.md`](PALETTE.md).

## How it's built

Every theme file is **generated** from one palette table so the two editions
never drift. Edit [`palette/schemes.json`](palette/schemes.json), then:

```sh
node scripts/generate.mjs
```

That writes all 16 VS Code themes, 16 JetBrains UI themes + editor schemes, and
rewrites both manifests. CI re-runs it and fails on any uncommitted diff.

## VS Code

The extension lives in [`vscode/`](vscode). Build and install locally:

```sh
cd vscode
npx --yes @vscode/vsce package   # produces zpwr-cyberpunk-hud-<version>.vsix
code --install-extension zpwr-cyberpunk-hud-*.vsix
```

Then **Cmd/Ctrl+K Cmd/Ctrl+T** and pick any **ZPWR** scheme (Cyberpunk,
Midnight, Matrix, Ember, Arctic, Crimson, Toxic, Vapor — dark or light).

## JetBrains (IntelliJ, PyCharm, WebStorm, CLion, Rider, …)

The plugin lives in [`jetbrains/`](jetbrains). A UI-theme plugin is pure
resources, so the build needs only `zip` — no Gradle or IDE SDK download:

```sh
cd jetbrains
./build-plugin.sh                # produces build/zpwr-theme-<version>.zip
```

Install via **Settings → Plugins → ⚙ → Install Plugin from Disk…** → pick the
zip, restart, then **Settings → Appearance & Behavior → Appearance → Theme** and
pick any **ZPWR** scheme.

## Layout

- `palette/schemes.json` — the 8 schemes' dark/light palettes (source of truth, ported from
  `Audio-Haxor` + the canonical `docs/hud-theme.js` HUD catalog).
- `scripts/generate.mjs` — emits every theme file + both manifests from the palette.
- `vscode/` — VS Code theme extension (`contributes.themes` + 16 generated color themes).
- `jetbrains/` — JetBrains theme plugin (`plugin.xml` + 16 generated `*.theme.json`
  UI themes + editor color scheme XMLs) plus the dependency-free packaging script.
- `PALETTE.md` — the role mapping shared by both editions.

## License

MIT — see [`LICENSE`](LICENSE).
