import type { ExtensionConfig, LanguageClientConfig, WrapperConfig } from 'monaco-editor-wrapper';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper';
import { LogLevel } from '@codingame/monaco-vscode-api';

/**
 * Configures the Monaco editor for use with TextMate.
 * @param htmlContainer The HTML div container for the editor
 * @returns The editor configuration
 */
export async function setupTextMate(htmlContainer: HTMLElement): Promise<void> {
  const wrapper = new MonacoEditorLanguageClientWrapper();
  await wrapper.init(wrapperConfig);
  return wrapper.start(htmlContainer);
}

/**
 * The language client configuration.
 */
const languageClientConfig: LanguageClientConfig = {
  name: 'Docml Client',
  clientOptions: {
    documentSelector: ['docml'],
  },
  connection: {
    options: {
      $type: 'WorkerDirect',
      worker: new Worker(new URL('@docml/language/browser', import.meta.url), {
        type: 'module',
        name: 'Docml Language Server',
      }),
    },
  },
};

/**
 * The VSCode extension configuration.
 */
const extensionConfig: ExtensionConfig = {
  config: {
    name: 'docml-web',
    publisher: 'dsogari',
    version: '1.0.0',
    engines: {
      vscode: '*',
    },
    contributes: {
      languages: [
        {
          id: 'docml',
          aliases: ['Docml', 'docml'],
          extensions: ['.docml'],
          configuration: 'language-configuration.json',
        },
      ],
      grammars: [
        {
          language: 'docml',
          scopeName: 'source.docml',
          path: 'docml.tmLanguage.json',
        },
      ],
    },
  },
  filesOrContents: new Map([
    ['/docml.tmLanguage.json', new URL('docml/tmLanguage', import.meta.url)],
    ['/language-configuration.json', new URL('docml/langConfig', import.meta.url)],
  ]),
};

/**
 * The Monaco-editor-wrapper configuration.
 */
const wrapperConfig: WrapperConfig = {
  $type: 'extended',
  logLevel: LogLevel.Info,
  extensions: [extensionConfig],
  vscodeApiConfig: {
    userConfiguration: {
      json: JSON.stringify({
        'editor.experimental.asyncTokenization': true,
        'editor.semanticHighlighting.enabled': true,
        'editor.wordBasedSuggestions': 'off',
        'editor.tabSize': 2,
        'editor.stickyScroll.enabled': false, // _BugIndicatingError: Illegal value for lineNumber
        'workbench.colorTheme': 'Default Dark Modern',
      }),
    },
  },
  editorAppConfig: {
    codeResources: {
      modified: {
        text: `[ Docml is running in the web! ]`,
        fileExt: 'docml',
        enforceLanguageId: 'docml',
      },
    },
    monacoWorkerFactory: configureDefaultWorkerFactory,
  },
  languageClientConfigs: {
    configs: {
      docml: languageClientConfig,
    },
  },
};
