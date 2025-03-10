/**
 * Grammar for the Lightweight Document Markup Language.
 */
grammar Docml

/**
 * A document is a forest of nodes.
 */
entry Document:
  (WS* nodes+=Node)* WS*;

/**
 * A node may be either a comment or a record.
 */
Node:
  Comment | Record;

/**
 * A comment is a node with:
 * - one of
 *   - a separator and children; or
 *   - no separator nor children
 */
Comment:
  OPEN_NODE
  (
    /**
     * True if there is a separator between name and value.
     */
    separator?=WS
    /**
     * The children of this node.
     */
    children+=(Node | Text)*
  )?
  NODE_CLOSE_NODE;

/**
 * A record is a node with:
 * - a name; and
 * - one of
 *   - (a separator or a node child) and remaining children; or
 *   - no separator nor children
 */
Record:
  OPEN_NODE
  /**
   * The node name.
   */
  name=Name
  (
    (
      /**
       * True if there is a separator between name and value.
       */
      separator?=WS |
      /**
       * The children of this node.
       */
      children+=Node
    )
    children+=(Node | Text)*
  )?
  NODE_CLOSE_NODE;

/**
 * A name may consist of non-space or quoted text, in any order.
 */
Name returns string:
  (NODE_QUOTE | NODE_TEXT)+;

/**
 * Text may consist of anything in any order.
 */
Text returns string:
  (NODE_QUOTE | NODE_TEXT | WS)+;

/**
 * Whitespace may occur anywhere.
 */
terminal WS: /\s/;

/**
 * The opening bracket of a node may occur anywhere.
 */
terminal OPEN_NODE: /\[/;

/**
 * The closing bracket of a node may occur only within a node.
 */
terminal NODE_CLOSE_NODE: /]/;

/**
 * Node text can appear only within a node and may consist of:
 * - escaped brackets; or
 * - escaped quotation marks; or
 * - non-space, except brackets and quotation marks
 */
terminal NODE_TEXT: // NOTE: remove escape character
  /((?<=\\)[\xab\xbb\[\]]|[^\xab\xbb\[\]\s])+/;

/**
 * Quoted text can appear only within a node and may consist of:
 * - escaped quotation marks; or
 * - anything except quotation marks
 */
terminal NODE_QUOTE: // NOTE: remove surrounding quotation marks and escape character
  /\xab((?<=\\)[\xab\xbb]|[^\xab\xbb])*\xbb/;
