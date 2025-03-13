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
  describe('Parsing comment nodes', () => {
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

    test('parse comment node with multiple children', async () => {
      document = await parse(`
        [  text  ]
      `);
      expect(checkDocumentValid(document)).toEqual('');
      expect(document.parseResult.value).toMatchObject({
        nodes: [
          {
            separator: true,
            children: [' ', 'text', '  '],
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
  });

  describe('Parsing record nodes', () => {
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
        [name[name]  value]
      `);
      expect(checkDocumentValid(document)).toEqual('');
      expect(document.parseResult.value).toMatchObject({
        nodes: [
          {
            name: 'name',
            separator: false,
            children: [{ name: 'name' }, '  ', 'value'],
          },
        ],
      });
    });
  });

  describe('Parsing nodes with quotes', () => {
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
  });

  describe('Parsing nodes with escape characters', () => {
    test('parse nodes with invalid escaped quotes', async () => {
      expect(checkDocumentValid(await parse(` [«name \\»] `))).toMatch('unexpected character');
      expect(checkDocumentValid(await parse(` [ «value \\»] `))).toMatch('unexpected character');
    });

    test('parse record node with a single escape character as its name', async () => {
      document = await parse(`
        [\\ ]
      `);
      expect(checkDocumentValid(document)).toEqual('');
      expect(document.parseResult.value).toMatchObject({
        nodes: [
          {
            name: '\\',
            separator: true,
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
  });

  describe('Parsing nodes with non-text children', () => {
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

    test('parse record node with multiple children with no separator', async () => {
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

    test('parse record node with multiple children with separator', async () => {
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

    test('parse record node with nested children', async () => {
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
  });

  describe('Parsing multiple root nodes', () => {
    test('parse invalid text at root level', async () => {
      expect(checkDocumentValid(await parse(` text `))).toMatch('Expecting end of file');
      expect(checkDocumentValid(await parse(` [] text `))).toMatch('Expecting end of file');
    });

    test('parse two top-level record nodes', async () => {
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
});
