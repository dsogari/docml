/**
 * Grammar for the Lightweight Document Markup Language.
 */
grammar Docml

/**
 * A document consists of zero or many root nodes.
 */
entry DocmlDocument:
  (DocmlSpace? nodes+=DocmlNode)* DocmlSpace?;

/**
 * A node may be either a comment or a record.
 */
DocmlNode:
  DocmlComment | DocmlRecord;

/**
 * A comment is a node with:
 * - a separator and possible children; or
 * - neither separator nor children
 */
DocmlComment:
  LEFT_BRACKET
  (
    /**
     * True if the node contains a separator.
     */
    separator?=SINGLE_SPACE
    /**
     * A child may be either a node or a text sequence.
     */
    children+=(DocmlNode | DocmlText)*
  )?
  RIGHT_BRACKET;

/**
 * A record is a node with:
 * - a name; and
 *   - (either a separator or a node child) and possible remaining children; or
 *   - neither separator nor children
 */
DocmlRecord:
  LEFT_BRACKET
  /**
   * The node name.
   */
  name=DocmlChunk
  (
    (
      /**
       * True if the node contains a separator.
       */
      separator?=SINGLE_SPACE |
      /**
       * The first child will be a node if there is no separator.
       */
      children+=DocmlNode
    )
    /**
     * A child may be either a node or a text sequence.
     */
    children+=(DocmlNode | DocmlText)*
  )?
  RIGHT_BRACKET;

/**
 * A text sequence may be either chunk or space.
 */
DocmlText returns string:
  DocmlChunk | DocmlSpace;

/**
 * A chunk consists of visible words or french quotes, in any order.
 */
DocmlChunk returns string:
  (VISIBLE_WORD | FRENCH_QUOTE)+;

/**
 * A space consists of one or more whitespace characters.
 */
DocmlSpace returns string:
  SINGLE_SPACE+;

/**
 * A whitespace character may occur anywhere.
 */
terminal SINGLE_SPACE: /\s/;

/**
 * The opening bracket of a node may occur anywhere.
 */
terminal LEFT_BRACKET: /\[/;

/**
 * The closing bracket of a node may occur only within a node.
 */
terminal RIGHT_BRACKET: /]/;

/**
 * A visible word may appear only within a node and consists of:
 * - backslash followed by brackets; or
 * - backslash followed by guillemets; or
 * - non-whitespace, except brackets and guillemets
 */
terminal VISIBLE_WORD: // NOTE: remove backslash before brackets or guillemets
  /(?:(?<=\\)[\xab\xbb[\]]|[^\xab\xbb[\]\s])+/;

/**
 * A french quote may appear only within a node, is surrounded by guillemets and consists of:
 * - backslash followed by any character; or
 * - anything except guillemets; or
 * - nothing at all
 */
terminal FRENCH_QUOTE: // NOTE: remove surrounding guillemets and backslash before guillemets
  /\xab(?:\\.|[^\\\xab\xbb])*\xbb/s;
