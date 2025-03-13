#!/usr/bin/env bun
import { EmptyFileSystem, createParser, LangiumParser } from 'langium';
import { createSyntaxDiagramsCode } from 'chevrotain';
import { createDocmlServices } from '../src/language/docml-module.js';
import { writeFileSync } from 'fs';

class CustomLangiumParser extends LangiumParser {
  exportHtmlDiagram(): string {
    const rules = this.wrapper.getSerializedGastProductions();
    return createSyntaxDiagramsCode(rules);
  }
}

const { Docml } = createDocmlServices(EmptyFileSystem);
const { definition } = Docml.parser.Lexer;
const parser = new CustomLangiumParser(Docml);
createParser(Docml.Grammar, parser, definition).finalize();
const html = parser.exportHtmlDiagram();

if (process.argv.length > 2) {
  writeFileSync(process.argv[2], html);
} else {
  console.log(html);
}
