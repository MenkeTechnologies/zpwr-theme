#!/usr/bin/env bash
# Package the ZPWR Cyberpunk HUD JetBrains theme into an installable plugin zip.
#
# A UI-theme plugin is pure resources (plugin.xml + *.theme.json + editor
# scheme), so this needs only `zip` — no Gradle, no IntelliJ SDK download that
# would bit-rot. The output installs via Settings -> Plugins -> gear ->
# "Install Plugin from Disk...", and is the same layout the Marketplace accepts.
#
# Output: build/zpwr-theme-<version>.zip   (version read from plugin.xml)
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
res="$here/src/main/resources"
plugin_xml="$res/META-INF/plugin.xml"
name="zpwr-theme"

# Single source of truth for the version: <version> in plugin.xml.
ver="$(grep -oE '<version>[^<]+</version>' "$plugin_xml" | head -1 | sed -E 's/<\/?version>//g')"
[ -n "$ver" ] || { echo "error: no <version> in $plugin_xml" >&2; exit 1; }

out="$here/build"
stage="$out/$name/lib"
rm -rf "$out"
mkdir -p "$stage"

# The plugin jar is the resources tree zipped with a .jar extension; plugin.xml
# must sit at META-INF/plugin.xml inside it. All generated theme.json + editor
# scheme XML files (one pair per scheme/variant) ship alongside it.
( cd "$res" && zip -qr "$stage/$name.jar" META-INF zpwr-*.theme.json zpwr-*.xml )

# The distributable is <name>/lib/<name>.jar zipped from the build dir.
( cd "$out" && zip -qr "$name-$ver.zip" "$name" )

echo "built $out/$name-$ver.zip (v$ver)"
