#!/usr/bin/env node
// Generate every editor theme from palette/schemes.json — the single source of
// truth ported from Audio-Haxor's 5 in-app colorschemes. Emits, for each of the
// 5 schemes x {dark, light}:
//   - vscode/themes/zpwr-<scheme>-<variant>-color-theme.json
//   - jetbrains/.../zpwr-<scheme>-<variant>.theme.json  (UI theme)
//   - jetbrains/.../zpwr-<scheme>-<variant>.xml          (editor scheme)
// and rewrites vscode/package.json `contributes.themes` + the JetBrains
// plugin.xml theme providers so the manifests never drift from the file set.
//
// Run: node scripts/generate.mjs   (CI also runs it and fails on any git diff).
// No dependencies — pure Node + fs.

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES = join(root, 'jetbrains', 'src', 'main', 'resources');
const THEMES = join(root, 'vscode', 'themes');

// ---- color helpers ---------------------------------------------------------
const hex = (h) => h.replace('#', '');
const toRgb = (h) => { const v = hex(h); return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)); };
const toHex = ([r, g, b]) => '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => toHex(toRgb(a).map((c, i) => c + (toRgb(b)[i] - c) * t));
const lighten = (h, t) => mix(h, '#ffffff', t);
const darken = (h, t) => mix(h, '#000000', t);
const alpha = (h, aa) => '#' + hex(h) + aa; // 8-digit hex; VS Code understands #rrggbbaa
// Readable text color to place ON an accent fill.
const onAccent = (h) => { const [r, g, b] = toRgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) > 140 ? '#05050a' : '#ffffff'; };
const jb = (h) => hex(h); // JetBrains scheme colors are hex without '#'

// ---- derive the full role set from a scheme's solid palette ----------------
function roles(p, isDark) {
  return {
    ...p,
    cyanBright: lighten(p.cyan, 0.25),
    textSoft: mix(p.text, p.textDim, 0.3),
    comment: isDark ? mix(p.textDim, p.textMuted, 0.45) : p.textDim,
    onAccent: onAccent(p.accent),
    onCyan: onAccent(p.cyan),
    selBg: isDark ? alpha(p.cyan, '40') : alpha(p.cyan, '33'),
    lineHi: isDark ? p.bgCard : darken(p.bgSecondary, 0.03),
    chromeBg: isDark ? darken(p.bgSecondary, 0.25) : darken(p.bgSecondary, 0.04)
  };
}

// ---- VS Code color theme ---------------------------------------------------
function vscodeTheme(label, isDark, p) {
  const r = roles(p, isDark);
  return {
    name: label,
    type: isDark ? 'dark' : 'light',
    semanticHighlighting: true,
    colors: {
      foreground: r.text,
      focusBorder: r.cyan,
      errorForeground: r.red,
      descriptionForeground: r.textDim,
      'icon.foreground': r.cyan,
      'widget.border': r.border,

      'editor.background': r.bgPrimary,
      'editor.foreground': r.text,
      'editorLineNumber.foreground': r.textMuted,
      'editorLineNumber.activeForeground': r.cyan,
      'editorCursor.foreground': r.green,
      'editor.selectionBackground': r.selBg,
      'editor.selectionHighlightBackground': alpha(r.cyan, '26'),
      'editor.inactiveSelectionBackground': r.bgHover,
      'editor.wordHighlightBackground': alpha(r.magenta, '33'),
      'editor.wordHighlightStrongBackground': alpha(r.green, '33'),
      'editor.findMatchBackground': alpha(r.orange, '66'),
      'editor.findMatchHighlightBackground': alpha(r.yellow, '44'),
      'editor.lineHighlightBackground': r.lineHi,
      'editorBracketMatch.background': alpha(r.cyan, '26'),
      'editorBracketMatch.border': r.cyan,
      'editorWhitespace.foreground': r.border,
      'editorIndentGuide.background1': r.bgHover,
      'editorIndentGuide.activeBackground1': r.border,
      'editorRuler.foreground': r.bgHover,
      'editorCodeLens.foreground': r.textMuted,
      'editorError.foreground': r.red,
      'editorWarning.foreground': r.yellow,
      'editorInfo.foreground': r.cyan,
      'editorHint.foreground': r.green,
      'editorGutter.modifiedBackground': r.cyan,
      'editorGutter.addedBackground': r.green,
      'editorGutter.deletedBackground': r.red,

      'editorBracketHighlight.foreground1': r.cyan,
      'editorBracketHighlight.foreground2': r.magenta,
      'editorBracketHighlight.foreground3': r.green,
      'editorBracketHighlight.foreground4': r.orange,
      'editorBracketHighlight.foreground5': r.yellow,
      'editorBracketHighlight.foreground6': r.accent,
      'editorBracketHighlight.unexpectedBracket.foreground': r.red,

      'editorWidget.background': r.bgSecondary,
      'editorWidget.border': r.border,
      'editorHoverWidget.background': r.bgCard,
      'editorHoverWidget.border': r.border,
      'editorSuggestWidget.background': r.bgSecondary,
      'editorSuggestWidget.border': r.border,
      'editorSuggestWidget.foreground': r.text,
      'editorSuggestWidget.highlightForeground': r.cyan,
      'editorSuggestWidget.selectedBackground': r.bgHover,
      'editorGroupHeader.tabsBackground': r.chromeBg,
      'editorGroup.border': r.border,

      'peekView.border': r.cyan,
      'peekViewEditor.background': r.bgSecondary,
      'peekViewResult.background': r.bgSecondary,
      'peekViewTitle.background': r.bgCard,
      'peekViewResult.selectionBackground': r.bgHover,

      'diffEditor.insertedTextBackground': alpha(r.green, '22'),
      'diffEditor.removedTextBackground': alpha(r.red, '22'),

      'tab.activeBackground': r.bgPrimary,
      'tab.inactiveBackground': r.chromeBg,
      'tab.activeForeground': r.text,
      'tab.inactiveForeground': r.textDim,
      'tab.activeBorderTop': r.cyan,
      'tab.activeBorder': r.cyan,
      'tab.border': r.border,
      'tab.hoverBackground': r.bgHover,

      'titleBar.activeBackground': r.chromeBg,
      'titleBar.activeForeground': r.text,
      'titleBar.inactiveBackground': r.bgPrimary,
      'titleBar.inactiveForeground': r.textDim,
      'titleBar.border': r.border,

      'activityBar.background': r.chromeBg,
      'activityBar.foreground': r.cyan,
      'activityBar.inactiveForeground': r.textMuted,
      'activityBar.border': r.border,
      'activityBarBadge.background': r.accent,
      'activityBarBadge.foreground': r.onAccent,

      'sideBar.background': r.bgSecondary,
      'sideBar.foreground': r.textSoft,
      'sideBar.border': r.border,
      'sideBarTitle.foreground': r.textDim,
      'sideBarSectionHeader.background': r.bgCard,
      'sideBarSectionHeader.foreground': r.cyan,
      'sideBarSectionHeader.border': r.border,

      'list.activeSelectionBackground': r.bgHover,
      'list.activeSelectionForeground': r.cyan,
      'list.inactiveSelectionBackground': r.bgCard,
      'list.hoverBackground': r.bgHover,
      'list.focusBackground': r.bgHover,
      'list.highlightForeground': r.green,
      'list.errorForeground': r.red,
      'list.warningForeground': r.yellow,
      'tree.indentGuidesStroke': r.border,

      'statusBar.background': r.chromeBg,
      'statusBar.foreground': r.textDim,
      'statusBar.border': r.border,
      'statusBar.noFolderBackground': r.chromeBg,
      'statusBar.debuggingBackground': r.magenta,
      'statusBar.debuggingForeground': onAccent(r.magenta),
      'statusBarItem.remoteBackground': r.cyan,
      'statusBarItem.remoteForeground': r.onCyan,
      'statusBarItem.prominentBackground': r.accent,
      'statusBarItem.prominentForeground': r.onAccent,

      'panel.background': r.bgSecondary,
      'panel.border': r.border,
      'panelTitle.activeForeground': r.cyan,
      'panelTitle.activeBorder': r.cyan,
      'panelTitle.inactiveForeground': r.textDim,

      'terminal.background': r.bgPrimary,
      'terminal.foreground': r.text,
      'terminalCursor.foreground': r.green,
      'terminal.ansiBlack': r.bgSecondary,
      'terminal.ansiRed': r.red,
      'terminal.ansiGreen': r.green,
      'terminal.ansiYellow': r.yellow,
      'terminal.ansiBlue': r.cyan,
      'terminal.ansiMagenta': r.magenta,
      'terminal.ansiCyan': r.cyan,
      'terminal.ansiWhite': r.text,
      'terminal.ansiBrightBlack': r.textMuted,
      'terminal.ansiBrightRed': lighten(r.red, 0.2),
      'terminal.ansiBrightGreen': lighten(r.green, 0.2),
      'terminal.ansiBrightYellow': lighten(r.yellow, 0.2),
      'terminal.ansiBrightBlue': lighten(r.cyan, 0.2),
      'terminal.ansiBrightMagenta': lighten(r.magenta, 0.2),
      'terminal.ansiBrightCyan': lighten(r.cyan, 0.3),
      'terminal.ansiBrightWhite': isDark ? '#ffffff' : r.text,

      'input.background': r.bgCard,
      'input.foreground': r.text,
      'input.border': r.border,
      'input.placeholderForeground': r.textMuted,
      'inputOption.activeBorder': r.cyan,
      'inputValidation.errorBackground': alpha(r.red, '22'),
      'inputValidation.errorBorder': r.red,
      'dropdown.background': r.bgCard,
      'dropdown.foreground': r.text,
      'dropdown.border': r.border,

      'button.background': r.cyan,
      'button.foreground': r.onCyan,
      'button.hoverBackground': lighten(r.cyan, 0.15),
      'button.secondaryBackground': r.bgHover,
      'button.secondaryForeground': r.text,
      'badge.background': r.accent,
      'badge.foreground': r.onAccent,
      'progressBar.background': r.cyan,

      'scrollbar.shadow': '#00000080',
      'scrollbarSlider.background': alpha(r.border, '80'),
      'scrollbarSlider.hoverBackground': alpha(r.cyan, '40'),
      'scrollbarSlider.activeBackground': alpha(r.cyan, '66'),

      'minimap.background': r.chromeBg,
      'minimapSlider.background': alpha(r.border, '66'),

      'gitDecoration.modifiedResourceForeground': r.yellow,
      'gitDecoration.untrackedResourceForeground': r.green,
      'gitDecoration.deletedResourceForeground': r.red,
      'gitDecoration.ignoredResourceForeground': r.textMuted,
      'gitDecoration.conflictingResourceForeground': r.magenta,

      'breadcrumb.foreground': r.textDim,
      'breadcrumb.focusForeground': r.cyan,
      'breadcrumb.activeSelectionForeground': r.green,
      'breadcrumbPicker.background': r.bgSecondary,

      'notifications.background': r.bgSecondary,
      'notifications.border': r.border,
      'notificationLink.foreground': r.cyan,

      'textLink.foreground': r.cyan,
      'textLink.activeForeground': r.green,
      'textPreformat.foreground': r.orange,
      'textCodeBlock.background': r.bgCard,

      'menu.background': r.bgSecondary,
      'menu.foreground': r.text,
      'menu.selectionBackground': r.bgHover,
      'menu.selectionForeground': r.cyan,
      'menu.border': r.border,

      'charts.red': r.red,
      'charts.green': r.green,
      'charts.yellow': r.yellow,
      'charts.orange': r.orange,
      'charts.blue': r.cyan,
      'charts.purple': r.magenta
    },
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment', 'comment.block.documentation'], settings: { foreground: r.comment, fontStyle: 'italic' } },
      { scope: ['comment.line.shebang', 'comment.line.shebang.stryke'], settings: { foreground: r.textMuted, fontStyle: 'italic' } },
      { scope: ['string', 'string.quoted.double', 'string.quoted.single', 'string.quoted.other'], settings: { foreground: r.green } },
      { scope: ['string.interpolated', 'string.interpolated.backtick', 'string.unquoted.heredoc'], settings: { foreground: lighten(r.green, 0.18) } },
      { scope: ['string.regexp', 'string.regexp.stryke'], settings: { foreground: r.magenta } },
      { scope: ['constant.character.escape', 'constant.other.placeholder'], settings: { foreground: r.orange } },
      { scope: ['constant.numeric', 'constant.numeric.stryke'], settings: { foreground: r.orange } },
      { scope: ['constant.language', 'constant.language.boolean', 'constant.language.magic'], settings: { foreground: r.orange } },
      { scope: ['keyword', 'keyword.control', 'keyword.other.phase', 'storage.type.control'], settings: { foreground: r.accent } },
      { scope: ['keyword.operator', 'keyword.operator.word'], settings: { foreground: r.cyan } },
      { scope: ['keyword.operator.thread', 'keyword.other.concurrent', 'support.function.parallel'], settings: { foreground: r.magenta, fontStyle: 'bold' } },
      { scope: ['keyword.operator.heredoc'], settings: { foreground: r.textDim } },
      { scope: ['storage', 'storage.type', 'storage.modifier'], settings: { foreground: r.accent } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call', 'support.function.builtin'], settings: { foreground: r.cyan } },
      { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'], settings: { foreground: r.yellow } },
      { scope: ['entity.name.tag', 'entity.name.tag.stryke'], settings: { foreground: r.accent } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: r.yellow } },
      { scope: ['variable', 'variable.other', 'variable.other.scalar', 'meta.definition.variable'], settings: { foreground: r.text } },
      { scope: ['variable.other.array', 'variable.other.hash'], settings: { foreground: r.textSoft } },
      { scope: ['variable.language', 'variable.language.special', 'variable.language.this', 'constant.language.stryke'], settings: { foreground: r.magenta, fontStyle: 'italic' } },
      { scope: ['variable.other.interpolated', 'variable.parameter'], settings: { foreground: r.cyanBright } },
      { scope: ['punctuation.definition.variable', 'sign', 'sign.stryke', 'punctuation.definition.sigil'], settings: { foreground: r.magenta } },
      { scope: ['support.type.property-name', 'meta.object-literal.key'], settings: { foreground: r.cyan } },
      { scope: ['markup.heading', 'markup.heading entity.name'], settings: { foreground: r.cyan, fontStyle: 'bold' } },
      { scope: ['markup.bold'], settings: { foreground: r.accent, fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { foreground: r.magenta, fontStyle: 'italic' } },
      { scope: ['markup.inline.raw', 'markup.fenced_code'], settings: { foreground: r.green } },
      { scope: ['markup.underline.link', 'string.other.link'], settings: { foreground: r.cyan, fontStyle: 'underline' } },
      { scope: ['invalid', 'invalid.illegal'], settings: { foreground: r.red, fontStyle: 'underline' } },
      { scope: ['punctuation', 'meta.brace', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: r.textDim } }
    ]
  };
}

// ---- JetBrains UI theme ----------------------------------------------------
function jbTheme(label, isDark, schemeFile, p) {
  const r = roles(p, isDark);
  return {
    name: label,
    author: 'MenkeTechnologies',
    dark: isDark,
    editorScheme: '/' + schemeFile,
    colors: {
      ink: r.bgPrimary, panel: r.bgSecondary, card: r.bgCard, hover: r.bgHover, border: r.border,
      cyan: r.cyan, cyanBright: r.cyanBright, pink: r.accent, magenta: r.magenta, green: r.green,
      orange: r.orange, yellow: r.yellow, text: r.text, textSoft: r.textSoft, textDim: r.textDim, muted: r.textMuted
    },
    ui: {
      '*': {
        background: 'panel', foreground: 'text', infoForeground: 'textDim',
        disabledBackground: 'ink', disabledForeground: 'muted', disabledText: 'muted',
        inactiveForeground: 'textDim', selectionBackground: 'hover', selectionForeground: 'cyan',
        selectionInactiveBackground: 'card', selectionInactiveForeground: 'text',
        borderColor: 'border', separatorColor: 'border', focusColor: 'cyan',
        focusedBorderColor: 'cyan', errorForeground: 'pink', acceleratorForeground: 'cyan'
      },
      Editor: { background: 'ink', shortcutForeground: 'cyan' },
      Panel: { background: 'panel', foreground: 'text' },
      Borders: { color: 'border', ContrastBorderColor: 'border' },
      Button: {
        startBackground: 'card', endBackground: 'card', foreground: 'text',
        startBorderColor: 'border', endBorderColor: 'border', focusedBorderColor: 'cyan',
        default: { startBackground: 'cyan', endBackground: 'cyan', foreground: 'ink', startBorderColor: 'cyan', endBorderColor: 'cyan', focusColor: 'cyanBright' }
      },
      Component: { focusColor: 'cyan', focusedBorderColor: 'cyan', borderColor: 'border', errorFocusColor: 'pink', warningFocusColor: 'yellow' },
      Link: { activeForeground: 'cyan', hoverForeground: 'cyanBright', visitedForeground: 'magenta', pressedForeground: 'green' },
      ProgressBar: { progressColor: 'cyan', indeterminateStartColor: 'cyan', indeterminateEndColor: 'magenta', trackColor: 'card' },
      TextField: { background: 'card', foreground: 'text' },
      TextArea: { background: 'card', foreground: 'text' },
      ComboBox: { background: 'card', nonEditableBackground: 'card', selectionBackground: 'hover', selectionForeground: 'cyan' },
      List: { background: 'panel', selectionBackground: 'hover', selectionForeground: 'cyan', selectionInactiveBackground: 'card', hoverBackground: 'hover' },
      Table: { background: 'panel', selectionBackground: 'hover', selectionForeground: 'cyan', gridColor: 'border', stripeColor: 'card' },
      Tree: { background: 'panel', foreground: 'textSoft', selectionBackground: 'hover', selectionForeground: 'cyan', selectionInactiveBackground: 'card', hoverBackground: 'hover', hash: 'border' },
      Menu: { background: 'panel', borderColor: 'border', selectionBackground: 'hover', selectionForeground: 'cyan' },
      MenuItem: { background: 'panel', selectionBackground: 'hover', selectionForeground: 'cyan', acceleratorForeground: 'textDim' },
      MenuBar: { background: 'ink', borderColor: 'border', selectionBackground: 'hover', selectionForeground: 'cyan' },
      PopupMenu: { background: 'panel', borderColor: 'border' },
      CompletionPopup: { background: 'panel', selectionBackground: 'hover', matchForeground: 'cyan', matchSelectionForeground: 'green' },
      ToolWindow: {
        Header: { background: 'card', inactiveBackground: 'panel', borderColor: 'border' },
        HeaderTab: { selectedBackground: 'hover', selectedInactiveBackground: 'card', hoverBackground: 'hover', underlineColor: 'cyan', inactiveUnderlineColor: 'textDim' },
        Button: { selectedBackground: 'hover', selectedForeground: 'cyan', hoverBackground: 'hover' }
      },
      DefaultTabs: { background: 'ink', borderColor: 'border', underlinedTabBackground: 'panel', underlinedTabForeground: 'text', underlineColor: 'cyan', inactiveUnderlineColor: 'textDim', hoverBackground: 'hover' },
      EditorTabs: { background: 'ink', underlinedTabBackground: 'ink', underlinedTabForeground: 'text', underlineColor: 'cyan', inactiveColoredFileBackground: 'panel', hoverBackground: 'hover', borderColor: 'border' },
      StatusBar: { background: 'ink', borderColor: 'border', hoverBackground: 'hover' },
      NavBar: { borderColor: 'border' },
      ScrollBar: { thumbColor: alpha(r.border, '80'), hoverThumbColor: alpha(r.cyan, '40') },
      TitlePane: { background: 'ink', borderColor: 'border', inactiveBackground: 'ink' },
      MainToolbar: { background: 'ink', Icon: { hoverBackground: 'hover' }, Dropdown: { hoverBackground: 'hover' } },
      ActionButton: { hoverBackground: 'hover', hoverBorderColor: 'border', pressedBackground: 'card' },
      Notification: { background: 'card', borderColor: 'border', errorBackground: alpha(r.red, '22'), errorBorderColor: 'pink' },
      Tooltip: { background: 'card', borderColor: 'border' },
      Counter: { background: 'pink', foreground: 'ink' }
    },
    icons: {
      ColorPalette: {
        'Actions.Blue': r.cyan, 'Actions.Green': r.green, 'Actions.Red': r.red, 'Actions.Yellow': r.yellow, 'Actions.Grey': r.textDim,
        'Objects.Blue': r.cyan, 'Objects.Green': r.green, 'Objects.Pink': r.accent, 'Objects.Purple': r.magenta, 'Objects.Red': r.red, 'Objects.Yellow': r.yellow, 'Objects.Grey': r.textDim
      }
    }
  };
}

// ---- JetBrains editor color scheme (XML) -----------------------------------
function jbScheme(name, isDark, p) {
  const r = roles(p, isDark);
  const parent = isDark ? 'Darcula' : 'Default';
  const attr = (key, fg, fontType, extra = '') =>
    `    <option name="${key}">\n      <value>\n        <option name="FOREGROUND" value="${jb(fg)}" />${fontType ? `\n        <option name="FONT_TYPE" value="${fontType}" />` : ''}${extra}\n      </value>\n    </option>`;
  const lines = [
    `<scheme name="${name}" version="142" parent_scheme="${parent}">`,
    `  <!-- Generated by scripts/generate.mjs from palette/schemes.json. Do not edit by hand. -->`,
    `  <colors>`,
    `    <option name="CARET_COLOR" value="${jb(r.green)}" />`,
    `    <option name="CARET_ROW_COLOR" value="${jb(r.bgCard)}" />`,
    `    <option name="GUTTER_BACKGROUND" value="${jb(r.chromeBg)}" />`,
    `    <option name="INDENT_GUIDE" value="${jb(r.bgHover)}" />`,
    `    <option name="SELECTED_INDENT_GUIDE" value="${jb(r.border)}" />`,
    `    <option name="LINE_NUMBERS_COLOR" value="${jb(r.textMuted)}" />`,
    `    <option name="LINE_NUMBER_ON_CARET_ROW_COLOR" value="${jb(r.cyan)}" />`,
    `    <option name="SELECTION_BACKGROUND" value="${jb(r.bgHover)}" />`,
    `    <option name="SELECTION_FOREGROUND" value="${jb(r.text)}" />`,
    `    <option name="WHITESPACES" value="${jb(r.border)}" />`,
    `    <option name="RIGHT_MARGIN_COLOR" value="${jb(r.bgHover)}" />`,
    `    <option name="CONSOLE_BACKGROUND_KEY" value="${jb(r.bgPrimary)}" />`,
    `  </colors>`,
    `  <attributes>`,
    `    <option name="TEXT">\n      <value>\n        <option name="FOREGROUND" value="${jb(r.text)}" />\n        <option name="BACKGROUND" value="${jb(r.bgPrimary)}" />\n      </value>\n    </option>`,
    attr('DEFAULT_KEYWORD', r.accent, 1),
    attr('DEFAULT_STRING', r.green),
    attr('DEFAULT_VALID_STRING_ESCAPE', r.orange),
    attr('DEFAULT_NUMBER', r.orange),
    attr('DEFAULT_CONSTANT', r.orange, 2),
    attr('DEFAULT_LINE_COMMENT', r.comment, 2),
    attr('DEFAULT_BLOCK_COMMENT', r.comment, 2),
    attr('DEFAULT_DOC_COMMENT', mix(r.comment, r.bgPrimary, 0.15), 2),
    attr('DEFAULT_DOC_COMMENT_TAG', r.textDim, 3),
    attr('DEFAULT_FUNCTION_DECLARATION', r.cyan),
    attr('DEFAULT_FUNCTION_CALL', r.cyan),
    attr('DEFAULT_STATIC_METHOD', r.cyanBright, 2),
    attr('DEFAULT_CLASS_NAME', r.yellow),
    attr('DEFAULT_CLASS_REFERENCE', r.yellow),
    attr('DEFAULT_INTERFACE_NAME', lighten(r.yellow, 0.15), 2),
    attr('DEFAULT_LOCAL_VARIABLE', r.text),
    attr('DEFAULT_GLOBAL_VARIABLE', r.magenta, 2),
    attr('DEFAULT_INSTANCE_FIELD', r.cyanBright),
    attr('DEFAULT_PARAMETER', r.textSoft),
    attr('DEFAULT_OPERATION_SIGN', r.cyan),
    attr('DEFAULT_BRACES', r.textDim),
    attr('DEFAULT_BRACKETS', r.textDim),
    attr('DEFAULT_PARENTHS', r.textDim),
    attr('DEFAULT_COMMA', r.textDim),
    attr('DEFAULT_SEMICOLON', r.textDim),
    attr('DEFAULT_DOT', r.textDim),
    attr('DEFAULT_METADATA', r.magenta),
    attr('DEFAULT_TAG', r.accent),
    attr('DEFAULT_ATTRIBUTE', r.yellow),
    attr('DEFAULT_PREDEFINED_SYMBOL', r.magenta),
    attr('DEFAULT_IDENTIFIER', r.text),
    `    <option name="BAD_CHARACTER">\n      <value>\n        <option name="FOREGROUND" value="${jb(r.red)}" />\n        <option name="BACKGROUND" value="${jb(alpha(r.red, '22').slice(0, 7))}" />\n      </value>\n    </option>`,
    `    <option name="MATCHED_BRACE_ATTRIBUTES">\n      <value>\n        <option name="FOREGROUND" value="${jb(r.green)}" />\n        <option name="BACKGROUND" value="${jb(r.bgHover)}" />\n        <option name="FONT_TYPE" value="1" />\n      </value>\n    </option>`,
    `    <option name="IDENTIFIER_UNDER_CARET_ATTRIBUTES">\n      <value>\n        <option name="BACKGROUND" value="${jb(r.bgHover)}" />\n      </value>\n    </option>`,
    `  </attributes>`,
    `</scheme>`
  ];
  return lines.join('\n') + '\n';
}

// ---- drive ----------------------------------------------------------------
const data = JSON.parse(readFileSync(join(root, 'palette', 'schemes.json'), 'utf8'));
const variants = ['dark', 'light'];

// Clean previously generated outputs so renames/removals don't leave stragglers.
for (const f of readdirSync(THEMES)) if (/^zpwr-.*-color-theme\.json$/.test(f)) unlinkSync(join(THEMES, f));
for (const f of readdirSync(RES)) if (/^zpwr-.*\.(theme\.json|xml)$/.test(f)) unlinkSync(join(RES, f));

const vscodeThemes = [];
const providers = [];
const writeJson = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');

for (const [scheme, def] of Object.entries(data.schemes)) {
  for (const variant of variants) {
    const isDark = variant === 'dark';
    const label = `ZPWR ${def.label}${isDark ? '' : ' Light'}`;
    const base = `zpwr-${scheme}-${variant}`;
    const p = def[variant];

    writeJson(join(THEMES, `${base}-color-theme.json`), vscodeTheme(label, isDark, p));
    vscodeThemes.push({ label, uiTheme: isDark ? 'vs-dark' : 'vs', path: `./themes/${base}-color-theme.json` });

    const schemeFile = `${base}.xml`;
    writeJson(join(RES, `${base}.theme.json`), jbTheme(label, isDark, schemeFile, p));
    writeFileSync(join(RES, schemeFile), jbScheme(label, isDark, p));
    providers.push({ id: base, label });
  }
}

// Rewrite vscode/package.json contributes.themes (preserve all other fields).
const pkgPath = join(root, 'vscode', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.contributes = pkg.contributes || {};
pkg.contributes.themes = vscodeThemes;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Regenerate plugin.xml (version sourced from vscode/package.json — one source).
const pluginXml = `<idea-plugin>
  <id>com.menketechnologies.zpwr-theme</id>
  <name>ZPWR Cyberpunk HUD</name>
  <version>${pkg.version}</version>
  <vendor email="MenkeTechnologies@gmail.com" url="https://github.com/MenkeTechnologies">MenkeTechnologies</vendor>

  <description><![CDATA[
    <p>The MenkeTechnologies cyberpunk editor themes — the 5 Audio-Haxor preset
    colorschemes (Cyberpunk, Midnight, Matrix, Ember, Arctic), each in dark and
    light, with matching editor color schemes. Shared palette with
    <code>zpwrchrome</code>, <code>zpwr</code>, and <code>strykelang</code>.</p>
  ]]></description>

  <depends>com.intellij.modules.platform</depends>
  <idea-version since-build="191" />

  <extensions defaultExtensionNs="com.intellij">
${providers.map((p) => `    <themeProvider id="${p.id}" path="/${p.id}.theme.json" />`).join('\n')}
  </extensions>
</idea-plugin>
`;
writeFileSync(join(RES, 'META-INF', 'plugin.xml'), pluginXml);

console.log(`generated ${vscodeThemes.length} VS Code themes + ${providers.length} JetBrains themes (${Object.keys(data.schemes).length} schemes x ${variants.length} variants)`);
