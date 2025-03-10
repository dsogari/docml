import { type LangiumDocument } from 'langium';
import { type Diagnostic } from 'vscode-languageserver-types';
import { Document, isDocument } from '../src/language/generated/ast.js';

export function checkDocumentValid(document: LangiumDocument): string {
  return (
    (document.parseResult.parserErrors.length &&
      `Parser errors:\n  ${document.parseResult.parserErrors
        .map((e) => e.message)
        .join('\n  ')}`) ||
    (document.parseResult.value === undefined && `ParseResult is 'undefined'.`) ||
    (!isDocument(document.parseResult.value) &&
      `Root AST object is a ${document.parseResult.value.$type}, expected a '${Document}'.`) ||
    ''
  );
}

export function diagnosticToString(d: Diagnostic) {
  return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
}
