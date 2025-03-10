import { CstNode, GrammarAST, DefaultValueConverter, ValueType } from 'langium';

/**
 * @see https://eclipse-langium.github.io/langium-previews/pr-previews/pr-132/guides/multi-mode-lexing/
 */
export class CustomValueConverter extends DefaultValueConverter {
  protected override runConverter(
    rule: GrammarAST.AbstractRule,
    input: string,
    cstNode: CstNode
  ): ValueType {
    switch (rule.name) {
      case 'NODE_TEXT':
        return input.replace(/\\(?=[\xab\xbb\[\]])/g, ''); // remove escape character
      case 'QUOTE_TEXT':
        return input.replace(/\\(?=[\xab\xbb])/g, ''); // remove escape character
      case 'Quote':
        return input.slice(1, -1); // remove quotation marks
      case 'Text1':
        return input.slice(1); // remove leading space
      default:
        return super.runConverter(rule, input, cstNode);
    }
  }
}
