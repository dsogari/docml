import type { CstNode, ValueType, GrammarAST } from 'langium';
import { DefaultValueConverter } from 'langium';

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
      case 'VISIBLE_WORD': // remove backslash before brackets or guillemets
        return input.replace(/\\(?=[\xab\xbb[\]])/g, '');
      case 'FRENCH_QUOTE': // remove surrounding guillemets and backslash before guillemets
        return input.slice(1, -1).replace(/\\(?=[\xab\xbb])/g, '');
      default:
        return super.runConverter(rule, input, cstNode);
    }
  }
}
