import { beforeAll, describe, expect, test } from 'bun:test';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { expandToString as s } from 'langium/generate';
import { parseHelper } from 'langium/test';
import { type Diagnostic } from 'vscode-languageserver-types';
import { createDocmlServices } from '../../src/language/docml-module.js';
import { Doc, isDoc } from '../../src/language/generated/ast.js';

let services: ReturnType<typeof createDocmlServices>;
let parse: ReturnType<typeof parseHelper<Doc>>;
let document: LangiumDocument<Doc> | undefined;

beforeAll(async () => {
  services = createDocmlServices(EmptyFileSystem);
  const doParse = parseHelper<Doc>(services.Docml);
  parse = (input: string) => doParse(input, { validation: true });

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Validating', () => {
  test('check no errors', async () => {
    document = await parse(`  
      [test]
    `);

    expect(
      // here we first check for validity of the parsed document object by means of the reusable function
      //  'checkDocumentValid()' to sort out (critical) typos first,
      // and then evaluate the diagnostics by converting them into human readable strings;
      // note that 'toHaveLength()' works for arrays and strings alike ;-)
      checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
    ).toEqual('');
  });

  test('check scope name validation', async () => {
    document = await parse(`
      [::]
    `);

    expect(
      checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
    ).toEqual(
      // 'expect.stringContaining()' makes our test robust against future additions of further validation rules
      expect.stringContaining(s`
        [1:7..1:9]: Scope name should not be empty.
      `)
    );
  });
});

function checkDocumentValid(document: LangiumDocument): string | undefined {
  return (
    (document.parseResult.parserErrors.length &&
      s`
        Parser errors:
          ${document.parseResult.parserErrors.map((e) => e.message).join('\n  ')}
    `) ||
    (document.parseResult.value === undefined && `ParseResult is 'undefined'.`) ||
    (!isDoc(document.parseResult.value) &&
      `Root AST object is a ${document.parseResult.value.$type}, expected a '${Doc}'.`) ||
    undefined
  );
}

function diagnosticToString(d: Diagnostic) {
  return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
}
