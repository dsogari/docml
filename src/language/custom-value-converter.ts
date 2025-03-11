import { CstNode, GrammarAST, DefaultValueConverter, ValueType } from 'langium';

/**
 * @see https://eclipse-langium.github.io/langium-previews/pr-previews/pr-132/guides/multi-mode-lexing/
 */
export class CustomValueConverter extends DefaultValueConverter {
  protected override runConverter(
    rule: GrammarAST.AbstractRule,
    input: string,
    cstNode: CstNode,
  ): ValueType {
    switch (rule.name) {
      case 'NODE_TEXT': // remove escape character
        return input.replace(/\\(?=[\xab\xbb[\]])/g, '');
      case 'NODE_QUOTE': // remove surrounding quotation marks and escape character
        return input.slice(1, -1).replace(/\\(?=[\xab\xbb])/g, '');
      default:
        return super.runConverter(rule, input, cstNode);
    }
  }
}
