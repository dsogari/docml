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
    if (rule.name === 'Quote') {
      return input.slice(1, -1); // remove quotation marks
    }
    if (rule.name === 'Text1') {
      return input.slice(1); // remove leading space
    }
    return super.runConverter(rule, input, cstNode);
  }
}
