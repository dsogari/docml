grammar Docml

entry Doc:
  (ROOT_WS? nodes+=Node)* ROOT_WS?;

Node:
  OPEN_NODE
  name=Text1                            // node name and...
  (
    children+=Empty |                   // single empty child or...
    (
      children+=Node |                  // first child or...
      NODE_WS children+=(Node | Text2)  // separator and first child and...
    )
    children+=(Node | Text2)*           // the rest of the children or...
  )?                                    // the node may have no children
  CLOSE_NODE;

Empty returns string: // HACK: workaround for empty string
  NODE_WS;

Text1 returns string:
  (QUOTE | NODE_TEXT)+;

Text2 returns string:
  (QUOTE | NODE_TEXT | NODE_WS)+;

terminal OPEN_NODE:   /\[/;
terminal CLOSE_NODE:  /]/;
terminal OPEN_QUOTE:  /\xab/;
terminal CLOSE_QUOTE: /\xbb/;

terminal ROOT_WS:     /\s+/;
terminal NODE_WS:     /\s/;
terminal NODE_TEXT:   /((?<=\\)[\xab\xbb\[\]]|[^\xab\xbb\[\]\s])+/; // NOTE: remove escape character
terminal QUOTE_TEXT:  /((?<=\\)[\xab\xbb]|[^\xab\xbb])+/;           // NOTE: remove escape character
terminal QUOTE:       OPEN_QUOTE QUOTE_TEXT? CLOSE_QUOTE;           // NOTE: remove quotation marks
