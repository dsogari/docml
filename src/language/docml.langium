grammar Docml

entry Doc: (ROOT_WS? nodes+=Node)* ROOT_WS?;

Node:
  OPEN_NODE
  name=Text0
  (
    children+=(Node | Text1)
    (
      children+=(Node | Text2)
    )*
  )?
  CLOSE_NODE;

Text0 returns string: (Quote | NODE_TEXT)+;
Text1 returns string: NODE_WS Text2?;                     // NOTE: remove leading space
Text2 returns string: (Quote | NODE_TEXT | NODE_WS)+;
Quote returns string: OPEN_QUOTE QUOTE_TEXT? CLOSE_QUOTE; // NOTE: remove quotation marks

terminal OPEN_NODE:   /\[/;                               // valid anywhere
terminal CLOSE_NODE:  /]/;                                // valid anywhere
terminal OPEN_QUOTE:  /\xab/;                             // valid inside nodes and quotes
terminal CLOSE_QUOTE: /\xbb/;                             // valid inside nodes and quotes

terminal ROOT_WS:     /\s+/;                              // valid outside nodes
terminal NODE_WS:     /\s/;                               // valid inside any node
terminal NODE_TEXT:   /[^\xab\xbb\[\]\s]+/;               // valid inside any node
terminal QUOTE_TEXT:  /([^\xab\xbb]|(?<=\\)[\xab\xbb])+/; // valid inside any quote
