/**
 * Grammar for the Lightweight Document Markup Language.
 */
grammar Docml

/**
 * A document is a forest (of node trees).
 */
entry Document:
  (Space? nodes+=Node)* Space?;

/**
 * A node may be either a comment or a record.
 */
Node:
  Comment | Record;

/**
 * A comment is a node with:
 * - a separator and possible children; or
 * - neither separator nor children
 */
Comment:
  LEFT_BRACKET
  (
    /**
     * True if the node contains a separator.
     */
    separator?=SINGLE_SPACE
    /**
     * A child may be either a node or a text sequence.
     */
    children+=(Node | Text)*
  )?
  RIGHT_BRACKET;

/**
 * A record is a node with:
 * - a name; and
 *   - (either a separator or a node child) and possible remaining children; or
 *   - neither separator nor children
 */
Record:
  LEFT_BRACKET
  /**
   * The node name.
   */
  name=Chunk
  (
    (
      /**
       * True if the node contains a separator.
       */
      separator?=SINGLE_SPACE |
      /**
       * The first child will be a node if there is no separator.
       */
      children+=Node
    )
    /**
     * A child may be either a node or a text sequence.
     */
    children+=(Node | Text)*
  )?
  RIGHT_BRACKET;

/**
 * A text sequence may be either chunk or space.
 */
Text returns string:
  Chunk | Space;

/**
 * A chunk consists of visible words or french quotes, in any order.
 */
Chunk returns string:
  (VISIBLE_WORD | FRENCH_QUOTE)+;

/**
 * A space consists of one or more whitespace characters.
 */
Space returns string:
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
  /((?<=\\)[\xab\xbb[\]]|[^\xab\xbb[\]\s])+/;

/**
 * A french quote may appear only within a node, is surrounded by guillemets and consists of:
 * - backslash followed by guillemets; or
 * - anything except guillemets
 */
terminal FRENCH_QUOTE: // NOTE: remove surrounding guillemets and backslash before guillemets
  /\xab((?<=\\)[\xab\xbb]|[^\xab\xbb])*\xbb/;
