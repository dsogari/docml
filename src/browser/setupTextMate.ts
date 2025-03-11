import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import type { ExtensionConfig, WrapperConfig } from 'monaco-editor-wrapper';
import { useOpenEditorStub } from 'monaco-editor-wrapper/vscode/services';
import { LogLevel } from '@codingame/monaco-vscode-api';
import { languageClientConfig } from './setupCommon.js';

/**
 * Configures the Monaco editor for use with TextMate.
 * @param htmlContainer The HTML div container for the editor
 * @returns The editor configuration
 */
export function setupTextMateConfig(htmlContainer: HTMLElement): WrapperConfig {
  return {
    $type: 'extended',
    htmlContainer,
    logLevel: LogLevel.Debug,
    extensions: [extensionConfig],
    vscodeApiConfig: {
      serviceOverrides: {
        ...getEditorServiceOverride(useOpenEditorStub),
        ...getKeybindingsServiceOverride(),
        ...getTextmateServiceOverride(),
        ...getThemeServiceOverride(),
      },
      userConfiguration: {
        json: JSON.stringify({
          'editor.experimental.asyncTokenization': true,
          'editor.semanticHighlighting.enabled': true,
          'editor.wordBasedSuggestions': 'off',
          'workbench.colorTheme': 'Default Dark Modern',
        }),
      },
    },
    editorAppConfig: {
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
    languageClientConfigs: {
      configs: {
        docml: languageClientConfig,
      },
    },
  };
}

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
    ['/language-configuration.json', new URL('../../language-configuration.json', import.meta.url)],
    ['/docml.tmLanguage.json', new URL('../syntaxes/docml.tmLanguage.json', import.meta.url)],
  ]),
};
