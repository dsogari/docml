# Lightweight Document Markup Language

![logo](assets/logo-wide.png)

Docml is a [lightweight] markup language inspired by [PDML]. Give it a try on the [playground].

## Document structure

The structure of a **Docml** document is very simple: it consists of [nodes](#nodes).

### Nodes

Nodes are delimited by a pair of square brackets (`[]`). Each node represents a subtree in the document hierarchy, and may be of two kinds:

- **comment** &mdash; contains text and possibly [child](#child-node) nodes, but is otherwise indistinct;
- **record** &mdash; contains text and possibly [child](#child-node) nodes, and is distinguished by a [tag](#tag-names)

### Child node

The child of a node may be either another node, visible text, or a sequence of [spaces](#whitespace).

### Whitespace

Spaces are preserved inside nodes, but are ignored outside (i.e., at the document root). This is so that parsers can interpret space elements for their own purposes.

### Tag names

A tag name is a non-empty sequence of any of the following:

- non-whitespace Unicode characters, except square brackets and guillemets; or
- square brackets or guillemets escaped with backslash (`\`); or
- [verbatim](#verbatim-text) text

Note that you can concatenate and interleave multiple of these in any order. Once the first non-matching character is encountered, it is considered a delimiter for the tag name.

### Verbatim text

Verbatim is any sequence of text surrounded by guillemets (`«»`), a.k.a. french quotation marks. We also denote verbatim as a _french quote_, for simplicity. It can be thought of as a literal string in a traditional programming language.

> [!NOTE]
>
> You can type guillemets using the `AltGr` feature of many keyboard layouts (e.g., US International). For the US layout, some operating systems provide the same functionality by means of `Ctrl+Shift` or other key combinations.

### What else?

There is nothing more to the language than this! No corner cases whatsoever &mdash; that is why we call it _lightweight_. Moreover, parsers are free to interpret the source code as they wish, except for [reserved](#reserved-tags) tags.

## Reserved tags

Single-character tag names are reserved for text markup. Below is a list of recognized tags:

- `a` &mdash; anchor or hyperlink
- `b` &mdash; bold intensity
- `c` &mdash; code (monospaced)
- `d` &mdash; document metadata (front matter)
- `e` &mdash; embedded document
- `f` &mdash; embedded figure
- `g` &mdash; legend (caption/label)
- `h` &mdash; header
- `i` &mdash; italic type
- `j` &mdash; embedded audio
- `k` &mdash; blinking or marked (highlighted)
- `l` &mdash; list item
- `m` &mdash; LaTeX math
- `n` &mdash; navigation (toc)
- `o` &mdash; overlined
- `p` &mdash; paragraph
- `q` &mdash; quote (blockquote)
- `r` &mdash; table row
- `s` &mdash; stricken through
- `t` &mdash; calendar time (datetime)
- `u` &mdash; underlined
- `v` &mdash; embedded video
- `w` &mdash; warning or alert (admonition)
- `x` &mdash; spoiler (details)
- `y` &mdash; subscript
- `z` &mdash; superscript

Their uppercase counterparts are not yet defined, although they may refer to text coloring or interactive elements. (This also depends on language adoption and is open to community feedback.)

## Licenses

[MIT License](LICENSE).

For third-party licenses, refer to the upstream project. Here are the most important:

- [Chevrotain] &mdash; Apache License 2.0
- [Langium] &mdash; MIT License &mdash; Copyright 2021 TypeFox GmbH
- [VSCode] &mdash; MIT License &mdash; Copyright (c) Microsoft Corporation

[lightweight]: https://en.wikipedia.org/wiki/Lightweight_markup_language
[PDML]: https://pdml-lang.dev/
[playground]: https://dsogari.github.io/docml/
[Chevrotain]: https://github.com/Chevrotain/chevrotain
[Langium]: https://github.com/eclipse-langium/langium
[VSCode]: https://github.com/Microsoft/vscode-languageserver-node/
