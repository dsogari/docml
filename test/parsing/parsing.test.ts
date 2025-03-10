import { beforeAll, describe, expect, test } from 'bun:test';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import { createDocmlServices } from '../../src/language/docml-module.js';
import { type Doc } from '../../src/language/generated/ast.js';
import { checkDocumentValid } from '../common.js';

let services: ReturnType<typeof createDocmlServices>;
let parse: ReturnType<typeof parseHelper<Doc>>;
let document: LangiumDocument<Doc> | undefined;

beforeAll(async () => {
  services = createDocmlServices(EmptyFileSystem);
  parse = parseHelper<Doc>(services.Docml);

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Parsing tests', () => {
  test('parse single node with no children', async () => {
    document = await parse(`
      [name]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: [],
        },
      ],
    });
  });

  test('parse single node with an empty child', async () => {
    document = await parse(`
      [name ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: [''],
        },
      ],
    });
  });

  test('parse single node with a child with space', async () => {
    document = await parse(`
      [name  ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: [' '],
        },
      ],
    });
  });

  test('parse single node with a child with a word', async () => {
    document = await parse(`
      [name value]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: ['value'],
        },
      ],
    });
  });

  test('parse single node with two children', async () => {
    document = await parse(`
      [name[name] value]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: [{ name: 'name' }, ' value'],
        },
      ],
    });
  });

  test('parse single node with a child with a quoted word with space', async () => {
    document = await parse(`
      [name« value»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    const root = document.parseResult.value;
    expect(root).toMatchObject({
      nodes: [
        {
          name: 'name',
          children: [' value'],
        },
      ],
    });
  });
});
