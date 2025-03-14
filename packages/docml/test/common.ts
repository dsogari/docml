import { type LangiumDocument } from 'langium';
import { type Diagnostic } from 'vscode-languageserver-types';
import { DocmlDocument, isDocmlDocument } from '../src/language/generated/ast.js';

/** @ignore */
export function checkDocumentValid(document: LangiumDocument): string {
  return (
    (document.parseResult.lexerErrors.length &&
      `Lexer errors:\n  ${document.parseResult.lexerErrors.map((e) => e.message).join('\n  ')}`) ||
    (document.parseResult.parserErrors.length &&
      `Parser errors:\n  ${document.parseResult.parserErrors
        .map((e) => e.message)
        .join('\n  ')}`) ||
    (document.parseResult.value === undefined && `ParseResult is 'undefined'.`) ||
    (!isDocmlDocument(document.parseResult.value) &&
      `Root AST object is a ${document.parseResult.value.$type}, expected a '${DocmlDocument}'.`) ||
    ''
  );
}

/** @ignore */
export function diagnosticToString(d: Diagnostic) {
  return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
}
