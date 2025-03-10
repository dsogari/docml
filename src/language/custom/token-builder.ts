import {
  DefaultTokenBuilder,
  isTokenTypeArray,
  type TokenBuilderOptions,
  type GrammarAST,
} from 'langium';
import type { IMultiModeLexerDefinition, TokenType, TokenVocabulary } from 'chevrotain';

const ROOT_MODE = 'root_mode';
const NODE_MODE = 'node_mode';
const QUOTE_MODE = 'quote_mode';

/**
 * @see https://eclipse-langium.github.io/langium-previews/pr-previews/pr-132/guides/multi-mode-lexing/
 */
export class CustomTokenBuilder extends DefaultTokenBuilder {
  override buildTokens(
    grammar: GrammarAST.Grammar,
    options?: TokenBuilderOptions
  ): TokenVocabulary {
    const tokenTypes = super.buildTokens(grammar, options);

    if (!isTokenTypeArray(tokenTypes)) {
      throw new Error('Invalid token vocabulary received from DefaultTokenBuilder!');
    }

    const rootModeTokens = tokenTypes.filter(
      (token) =>
        !token.name.startsWith('NODE_') && // inside nodes
        !token.name.includes('QUOTE') // open, close and inside quotes
    );
    const nodeModeTokens = tokenTypes.filter(
      (token) =>
        !token.name.startsWith('ROOT_') && // outside nodes
        !token.name.startsWith('QUOTE_') // inside quotes
    );
    const quoteModeTokens = tokenTypes.filter((token) => token.name.includes('QUOTE'));
    const multiModeLexerDef: IMultiModeLexerDefinition = {
      modes: {
        [ROOT_MODE]: rootModeTokens,
        [NODE_MODE]: nodeModeTokens,
        [QUOTE_MODE]: quoteModeTokens,
      },
      defaultMode: ROOT_MODE,
    };
    return multiModeLexerDef;
  }

  protected override buildTerminalToken(terminal: GrammarAST.TerminalRule): TokenType {
    let tokenType = super.buildTerminalToken(terminal);
    if (tokenType.name === 'OPEN_NODE') {
      tokenType.PUSH_MODE = NODE_MODE;
    } else if (tokenType.name === 'OPEN_QUOTE') {
      tokenType.PUSH_MODE = QUOTE_MODE;
    } else if (tokenType.name.includes('CLOSE_')) {
      tokenType.POP_MODE = true;
    }
    return tokenType;
  }
}
