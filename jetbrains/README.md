# ZPWR Cyberpunk HUD — JetBrains

Cyberpunk themes for IntelliJ IDEA, PyCharm, WebStorm, CLion, GoLand, Rider,
RustRover, and the rest of the JetBrains family. Ships the **5 Audio-Haxor
preset colorschemes** (Cyberpunk, Midnight, Matrix, Ember, Arctic) in dark and
light — 10 UI themes, each with a matching editor color scheme, on the
**Strykelang HUD** palette.

## Build

A UI-theme plugin is pure resources, so packaging needs only `zip` — no Gradle,
no IntelliJ SDK download:

```sh
./build-plugin.sh        # -> build/zpwr-theme-<version>.zip
```

The plugin descriptor and all theme files are **generated** by
`../scripts/generate.mjs` from `../palette/schemes.json`; the version comes from
`vscode/package.json`. Don't hand-edit the generated resources.

## Install

**Settings → Plugins → ⚙ → Install Plugin from Disk…** → select
`build/zpwr-theme-<version>.zip` → restart. Then **Settings → Appearance &
Behavior → Appearance → Theme** and pick any **ZPWR** scheme.

## Layout

- `src/main/resources/META-INF/plugin.xml` — plugin descriptor; registers all 10
  theme providers (generated).
- `src/main/resources/zpwr-<scheme>-<variant>.theme.json` — UI theme (named
  colors + component overrides), one per scheme/variant, points at its editor scheme.
- `src/main/resources/zpwr-<scheme>-<variant>.xml` — editor color scheme (syntax);
  dark variants inherit Darcula, light variants inherit Default.
- `build-plugin.sh` — dependency-free packager (globs every generated file).

Palette reference: [`../PALETTE.md`](https://github.com/MenkeTechnologies/zpwr-theme/blob/main/PALETTE.md).

## License

MIT.
