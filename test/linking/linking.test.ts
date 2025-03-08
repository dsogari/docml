import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { clearDocuments, parseHelper } from "langium/test";
import { createDocmlServices } from "../../src/language/docml-module.js";
import { Doc, isDoc } from "../../src/language/generated/ast.js";

let services: ReturnType<typeof createDocmlServices>;
let parse:    ReturnType<typeof parseHelper<Doc>>;
let document: LangiumDocument<Doc> | undefined;

beforeAll(async () => {
    services = createDocmlServices(EmptyFileSystem);
    parse = parseHelper<Doc>(services.Docml);

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

afterEach(async () => {
    document && clearDocuments(services.shared, [ document ]);
});

describe('Linking tests', () => {

    test('linking of greetings', async () => {
        document = await parse(`
            [name]
        `);

        expect(
            // here we first check for validity of the parsed document object by means of the reusable function
            //  'checkDocumentValid()' to sort out (critical) typos first,
            // and then evaluate the cross references we're interested in by checking
            //  the referenced AST element as well as for a potential error message;
            checkDocumentValid(document)
                // || document.parseResult.value.greetings.map(g => g.person.ref?.name || g.person.error?.message).join('\n')
        ).toBe('');
    });
});

function checkDocumentValid(document: LangiumDocument): string {
    return document.parseResult.parserErrors.length && s`
        Parser errors:
          ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
    `
        || document.parseResult.value === undefined && `ParseResult is 'undefined'.`
        || !isDoc(document.parseResult.value) && `Root AST object is a ${document.parseResult.value.$type}, expected a '${Doc}'.`
        || '';
}
