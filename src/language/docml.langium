/**
 * Grammar for the Lightweight Document Markup Language.
 */
grammar Docml

/**
 * A document is a forest of nodes.
 */
entry Document:
  (ROOT_WS? nodes+=Node)* ROOT_WS?;

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
    separator?=NODE_WS
    children+=(Node | Text)*
  )?
  CLOSE_NODE;

/**
 * A record is a node with:
 * - a name; and
 * - one of
 *   - (a separator or a node child) and remaining children; or
 *   - no separator nor children
 */
Record:
  OPEN_NODE
  name=Name
  (
    (
      separator?=NODE_WS | children+=Node
    )
    children+=(Node | Text)*
  )?
  CLOSE_NODE;

/**
 * A name may consist of non-space or quoted text, in any order.
 */
Name returns string:
  (NODE_QUOTE | NODE_TEXT)+;

/**
 * Text may consist of anything in any order.
 */
Text returns string:
  (NODE_QUOTE | NODE_TEXT | NODE_WS)+;

/**
 * The opening bracket of a node.
 */
terminal OPEN_NODE: /\[/;

/**
 * The closing bracket of a node.
 */
terminal CLOSE_NODE: /]/;

/**
 * Whitespace outside any node.
 */
terminal ROOT_WS: /\s+/;

/**
 * Whitespace within any node.
 */
terminal NODE_WS: /\s/;

/**
 * Node text may consist of:
 * - escaped brackets; or
 * - escaped quotation marks; or
 * - non-space, except brackets and quotation marks
 */
terminal NODE_TEXT: // NOTE: remove escape character
  /((?<=\\)[\xab\xbb\[\]]|[^\xab\xbb\[\]\s])+/;

/**
 * Quoted text may consist of:
 * - escaped quotation marks; or
 * - anything except quotation marks
 */
terminal NODE_QUOTE: // NOTE: remove surrounding quotation marks and escape character
  /\xab((?<=\\)[\xab\xbb]|[^\xab\xbb])*\xbb/;
