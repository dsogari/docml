# Lightweight Document Markup Language

![logo](static/logo.svg)

Test it on Langium's [playground].

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

[Chevrotain]: https://github.com/Chevrotain/chevrotain
[Langium]: https://github.com/eclipse-langium/langium
[VSCode]: https://github.com/Microsoft/vscode-languageserver-node/
[playground]: https://langium.org/playground?grammar=PQKhCgAIUhxAnAhgW2Y%2BkBmB7DAXACwFNIAZASwHMC8B3IqmyAEWwGMBXZIgOz0gCy6ANYcADmUQ9KHRJSIA6KCGDhKSVOhbtkAG3DhQEaJACCkACbsuvfm2w8AzuUd5HkbJkgAvIvGweGGg8AJ6Q-tj8PNgWRI5K0Kq28GGsnNx8AFxQkAAUAMpiiGxEAPyQ0bGOANQAvAByMUQAlDCFxWUA3AZGymYVTZBoYQBGJAyEfpCIkPaotoHT4UT28BYJKuCNsdmQkADC2PN8kAA%2BkABKK7gW3YZgfeZzGfwuS5UktOSEuzAAtEtHEQikg8LhpjwLJAxNhHM4RroSGwCORdBZ4LxOoE%2BgCeBNiBggSDEGCMNEMMjUejeMpVIdjnhdmQAKIAMQAKgB9ABCF1M%2BwA0sz2Tlcjk9r09lKYOz4BwSOQvJMBrFZg48IhyE5AcD0CTcAkpYlxZAiXrSaVavkAJL1WCkZmc-IABX5zJNkqNMCeKLRQ0Qo3G3wJ70G4JmeCIAA9%2BECAI7ynglQ3S1RGylojE8Oq5bYkc7s6N4Vo5ZqlHIXa2wAASXN5-KF7Luku9y1WULeMw%2BkC%2BPxx7xQRCxUgsfT2ANy%2BKmMzNoPB4ZVSN9FmaEKhMLh5ARJAxaC1Wsos2XWaxuDHkFxU8JurnZPBGepPFp4Cu7aZDo5PL5guFOU9JnZYhFwqQcU02PYeEHWp9gIDgeGEUUTTFI0JQeFC9hlOUFSVIDu3sPhNW1Gcb31eAUy9NMUNnUjLRtO0HSdV19mZM4TVQ4x0JlIDMHIeBXCPKke1RXRIDGUNVUVSBJgxSA3miU0SNJcjUzYgTM14Oo8xNZoPTQr1%2Bgff1A0gK9xJIBdIxjBSE14ZM2PAqUHyzHM8zOSBCxjEs9jLCsq1rL8G2FZs0NbSzYyIGykxIYZRKDaSjzg4RFkcIo7ONDz%2BAxPAOHgbVXHgA8mRgxK3PaEpguMVtkRK-DnFcdxPEgAA3Fwt0RHsbgajBMCzZFIATSI4gAGlkngITCG4-A2OlYPg5Zsty9x8sK0UADVrRtbkGIAdQAeQuZg3NZC5mXqfZq05ABFABVXb2WZZpqgqx5TVSpEHDqtwPC8BxzKCXBPhRSMUo6I89TYSM%2BOm8Ayp3IgFryvACukJk6PtR0XTdJ6ehC-paCBuI3rBpAIamGL2E4DApBCfG-EUZ9IeQLVEBEtGGMx5jMkgYAAB1HGAZ6AKA7AxF4A9RJJ4R4e%2BsyjI8NhKfG2mMWhxnmZEj862-Rsud5gBtAWccq9ygLYXRYXFkZJelxqu0GcmFZyjweF0MJexRMa7diVW-CZyCRMrGstcC9ldYAXUN%2B5jfMFr4Xa2gbjlxAxFFrQHFdoTCC1WWRzVJwXC%2BzxfgvUTimERxdEQRwCCwbBdHN%2BgoRGUZrbcU94H7EYy4rqua5wevsEb0SwhkYSiG4NvsRMXEHD%2BfHvkJjoRujEoxH4K2y-h9xc9H%2Bvx63hnffVyB1s2nb9uYXXgEgeo7uZLnd2wJqSC7thy8r6vYpwGSN7frfFl3oiCejg-y5FKJkMBAAeWoPMebND1jzKMiARiIJGCMBBYcw6nD1gAPUQcg1B6CeZhz5mHR6kcWz9B6rZGuA1IxJxTkQNOLs3bBmzl7IgI03iOByv4OCsQm4jw4GPYBa486fQapgYuAJX7v17rXAeQ9m7jWJsUSG7d%2BzUyztIEyUZV78EAfvSeZ5p4DG0YeEk0x66H3gH7FmkBjqnXOldW690r43zvg-ceT8SA8PgHwyE4tDGiNzrInun8xjfxIMEg%2BEp8EjDAZkWBChsF4NgUglBUY0FkJAIQ4AjhuhAA&content=NoZwhgngBAEgpgGwQeysA7sgTggJgQgF0AoKNKAFwAsBLEKOqMKAY2QFt24A7CqEsgGqw3XGmp1CDeswCOAV2QU4AbuKEgA
