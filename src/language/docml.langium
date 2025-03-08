grammar Docml

entry Doc: ROOT_WS? Node ROOT_WS?;

Node:
  OPEN
  name=NODE_NAME
  (
    children+=(Node | NODE_TEXT_WITH_SEP)
    (
      children+=(Node | NODE_TEXT_WITH_SEP | NODE_TEXT)
    )*
  )?
  CLOSE;

terminal OPEN:                /\[/;                           // valid anywhere
terminal CLOSE:               /]/;                            // valid anywhere
terminal ROOT_WS:             /\s+/;                          // valid outside any node
terminal NODE_NAME:           /[_a-zA-Z:][\w:-]*/;            // valid inside any node
terminal NODE_TEXT:           /([^\[\\\]]|\\\\|\\\[|\\])+/;   // valid inside any node
terminal NODE_TEXT_WITH_SEP:  /\s([^\[\\\]]|\\\\|\\\[|\\])*/; // valid inside any node
