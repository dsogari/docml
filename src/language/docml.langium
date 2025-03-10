grammar Docml

entry Doc: (ROOT_WS? nodes+=Node)* ROOT_WS?;

Node:
  OPEN_NODE
  name=(Quote | NODE_NAME)
  (
    children+=(Node | Text1)
    (
      children+=(Node | Text2)
    )*
  )?
  CLOSE_NODE;

Text1 returns string: (Quote | Text3) Text2?;
Text2 returns string: (Quote | NODE_TEXT_WITH_SEP | NODE_NAME)+;
Text3 returns string: NODE_TEXT_WITH_SEP; // HACK: remove leading space from just this rule
Quote returns string: OPEN_QUOTE (Quote | QUOTE_TEXT)? CLOSE_QUOTE;
  
terminal OPEN_NODE:           /\[/;   // valid anywhere
terminal CLOSE_NODE:          /]/;    // valid anywhere
terminal OPEN_QUOTE:          /\xab/; // valid inside nodes and quotes
terminal CLOSE_QUOTE:         /\xbb/; // valid inside nodes and quotes

terminal ROOT_WS:             /\s+/;                // valid outside nodes
terminal NODE_NAME:           /[^\s\xab\xbb\[\]]+/; // valid inside any node
terminal NODE_TEXT_WITH_SEP:  /\s[^\xab\xbb\[\]]*/; // valid inside any node
terminal QUOTE_TEXT:          /[^\xab\xbb]+/;       // valid inside any quote
