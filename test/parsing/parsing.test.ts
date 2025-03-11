import { beforeAll, describe, expect, test } from 'bun:test';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import { createDocmlServices } from '../../src/language/docml-module.js';
import { type Document } from '../../src/language/generated/ast.js';
import { checkDocumentValid } from '../common.js';

let services: ReturnType<typeof createDocmlServices>;
let parse: ReturnType<typeof parseHelper<Document>>;
let document: LangiumDocument<Document> | undefined;

beforeAll(async () => {
  services = createDocmlServices(EmptyFileSystem);
  parse = parseHelper<Document>(services.Docml);

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Parsing tests', () => {
  test('parse comment node with no children', async () => {
    document = await parse(`
      []
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          separator: false,
          children: [],
        },
      ],
    });
  });

  test('parse comment node with an empty child', async () => {
    document = await parse(`
      [ ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          separator: true,
          children: [],
        },
      ],
    });
  });

  test('parse comment node with a text child with space', async () => {
    document = await parse(`
      [  ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          separator: true,
          children: [' '],
        },
      ],
    });
  });

  test('parse comment node with a record child', async () => {
    document = await parse(`
      [ [name]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          separator: true,
          children: [
            {
              name: 'name',
              children: [],
            },
          ],
        },
      ],
    });
  });

  test('parse record node with no children', async () => {
    document = await parse(`
      [name]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: false,
          children: [],
        },
      ],
    });
  });

  test('parse record node with an empty child', async () => {
    document = await parse(`
      [name ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [],
        },
      ],
    });
  });

  test('parse record node with a text child with space', async () => {
    document = await parse(`
      [name  ]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [' '],
        },
      ],
    });
  });

  test('parse record node with a text child with a word', async () => {
    document = await parse(`
      [name value]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: ['value'],
        },
      ],
    });
  });

  test('parse record node with a record child and a text child', async () => {
    document = await parse(`
      [name[name] value]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: false,
          children: [{ name: 'name' }, ' ', 'value'],
        },
      ],
    });
  });

  test('parse record node with a name with quoted word with space', async () => {
    document = await parse(`
      [name« value»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name value',
          separator: false,
          children: [],
        },
      ],
    });
  });

  test('parse record node with a text child with empty quote', async () => {
    document = await parse(`
      [name «»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [''],
        },
      ],
    });
  });

  test('parse record node with a text child with a quoted word with space', async () => {
    document = await parse(`
      [name « value»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [' value'],
        },
      ],
    });
  });

  test('parse record node with a name with quoted word with space', async () => {
    document = await parse(`
      [name« value»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name value',
          separator: false,
          children: [],
        },
      ],
    });
  });

  test('parse record node with a name with escaped brackets', async () => {
    document = await parse(`
      [name\\[ value\\]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name[',
          separator: true,
          children: ['value]'],
        },
      ],
    });
  });

  test('parse record node with a name with escaped quotes', async () => {
    document = await parse(`
      [name\\« value\\»]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name«',
          separator: true,
          children: ['value»'],
        },
      ],
    });
  });

  test('parse record node with a record child', async () => {
    document = await parse(`
      [name [name]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [
            {
              name: 'name',
              separator: false,
              children: [],
            },
          ],
        },
      ],
    });
  });

  test('parse record node with two record children with no separator', async () => {
    document = await parse(`
      [name[name][name]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: false,
          children: [
            {
              name: 'name',
              separator: false,
              children: [],
            },
            {
              name: 'name',
              separator: false,
              children: [],
            },
          ],
        },
      ],
    });
  });

  test('parse record node with two record children with separator', async () => {
    document = await parse(`
      [name [name][name]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: true,
          children: [
            {
              name: 'name',
              separator: false,
              children: [],
            },
            {
              name: 'name',
              separator: false,
              children: [],
            },
          ],
        },
      ],
    });
  });

  test('parse record node with complex hierarchy', async () => {
    document = await parse(`
      [name[name[name]]]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: false,
          children: [
            {
              name: 'name',
              separator: false,
              children: [
                {
                  name: 'name',
                  separator: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('parse two record nodes', async () => {
    document = await parse(`
      [name] [name]
    `);
    expect(checkDocumentValid(document)).toEqual('');
    expect(document.parseResult.value).toMatchObject({
      nodes: [
        {
          name: 'name',
          separator: false,
          children: [],
        },
        {
          name: 'name',
          separator: false,
          children: [],
        },
      ],
    });
  });
});
