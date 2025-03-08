import {
  DefaultTokenBuilder,
  isTokenTypeArray,
  type TokenBuilderOptions,
  type GrammarAST,
} from 'langium';
import type { IMultiModeLexerDefinition, TokenType, TokenVocabulary } from 'chevrotain';

const ROOT_MODE = 'root_mode';
const NODE_MODE = 'node_mode';

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

    tokenTypes.push(tokenTypes.shift()!); // https://github.com/eclipse-langium/langium/issues/1828
    tokenTypes.push(tokenTypes.shift()!);

    const rootModeTokens = tokenTypes.filter((token) => !token.name.startsWith('NODE_'));
    const nodeModeTokens = tokenTypes.filter((token) => !token.name.startsWith('ROOT_'));
    const multiModeLexerDef: IMultiModeLexerDefinition = {
      modes: {
        [ROOT_MODE]: rootModeTokens,
        [NODE_MODE]: nodeModeTokens,
      },
      defaultMode: ROOT_MODE,
    };
    return multiModeLexerDef;
  }

  protected override buildTerminalToken(terminal: GrammarAST.TerminalRule): TokenType {
    let tokenType = super.buildTerminalToken(terminal);
    if (tokenType.name === 'OPEN') {
      tokenType.PUSH_MODE = NODE_MODE;
    } else if (tokenType.name === 'CLOSE') {
      tokenType.POP_MODE = true;
    }
    return tokenType;
  }
}
