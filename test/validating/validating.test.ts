import { beforeAll, describe, expect, test } from 'bun:test';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import { createDocmlServices } from '../../src/language/docml-module.js';
import { type Document } from '../../src/language/generated/ast.js';
import { checkDocumentValid, diagnosticToString } from '../common.js';

let services: ReturnType<typeof createDocmlServices>;
let parse: ReturnType<typeof parseHelper<Document>>;
let document: LangiumDocument<Document> | undefined;

beforeAll(async () => {
  services = createDocmlServices(EmptyFileSystem);
  const doParse = parseHelper<Document>(services.Docml);
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
    ).toMatch('[1:7..1:9]: Scope name should not be empty.');
  });
});
