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

terminal OPEN_NODE:   /\[/;
terminal CLOSE_NODE:  /]/;
terminal OPEN_QUOTE:  /\xab/;
terminal CLOSE_QUOTE: /\xbb/;

terminal ROOT_WS:     /\s+/;
terminal NODE_WS:     /\s/;
terminal NODE_TEXT:   /((?<=\\)[\xab\xbb\[\]]|[^\xab\xbb\[\]\s])+/; // NOTE: remove escape character
terminal QUOTE_TEXT:  /((?<=\\)[\xab\xbb]|[^\xab\xbb])+/;           // NOTE: remove escape character
