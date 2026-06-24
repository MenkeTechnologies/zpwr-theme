# ZPWR Cyberpunk HUD — JetBrains

Cyberpunk dark theme for IntelliJ IDEA, PyCharm, WebStorm, CLion, GoLand, Rider,
RustRover, and the rest of the JetBrains family. Ships a full UI theme plus a
matching editor color scheme, on the **Strykelang HUD** palette.

## Build

A UI-theme plugin is pure resources, so packaging needs only `zip` — no Gradle,
no IntelliJ SDK download:

```sh
./build-plugin.sh        # -> build/zpwr-theme-<version>.zip
```

The version is read from `src/main/resources/META-INF/plugin.xml` (single source
of truth).

## Install

**Settings → Plugins → ⚙ → Install Plugin from Disk…** → select
`build/zpwr-theme-<version>.zip` → restart. Then **Settings → Appearance &
Behavior → Appearance → Theme → ZPWR Cyberpunk HUD**.

## Layout

- `src/main/resources/META-INF/plugin.xml` — plugin descriptor; registers the
  theme provider.
- `src/main/resources/zpwr-cyberpunk-hud.theme.json` — UI theme (named colors +
  component overrides), points at the editor scheme.
- `src/main/resources/zpwr-cyberpunk-hud.xml` — editor color scheme (syntax),
  inherits Darcula and overrides the load-bearing attributes.
- `build-plugin.sh` — dependency-free packager.

Palette reference: [`../PALETTE.md`](https://github.com/MenkeTechnologies/zpwr-theme/blob/main/PALETTE.md).

## License

MIT.
