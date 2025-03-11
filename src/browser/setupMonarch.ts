import getEditorServiceOverride from '@codingame/monaco-vscode-editor-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import { defineDefaultWorkerLoaders } from 'monaco-editor-wrapper/workers/workerLoaders';
import { useOpenEditorStub } from 'monaco-editor-wrapper/vscode/services';
import { useWorkerFactory } from 'monaco-languageclient/workerFactory';
import type { WrapperConfig } from 'monaco-editor-wrapper';
import { languageClientConfig } from './setupCommon.js';
import docmlMonarchLanguage from '../syntaxes/docml.monarch.js';

/**
 * Configures the Monaco editor for use with Monarch.
 * @param htmlContainer The HTML div container for the editor
 * @returns The editor configuration
 */
export function setupMonarchConfig(htmlContainer?: HTMLElement): WrapperConfig {
  const workerLoaders = defineDefaultWorkerLoaders();
  delete workerLoaders['TextMateWorker'];
  return {
    $type: 'classic',
    htmlContainer,
    vscodeApiConfig: {
      serviceOverrides: {
        ...getEditorServiceOverride(useOpenEditorStub),
        ...getThemeServiceOverride(),
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
      useDiffEditor: false,
      editorOptions: {
        'semanticHighlighting.enabled': true,
        wordBasedSuggestions: 'off',
        theme: 'vs-dark',
      },
      languageDef: {
        monarchLanguage: docmlMonarchLanguage,
        languageExtensionConfig: { id: 'docml' },
      },
      monacoWorkerFactory: (logger) => {
        useWorkerFactory({ workerLoaders, logger });
      },
    },
    languageClientConfigs: {
      configs: {
        docml: languageClientConfig,
      },
    },
  };
}
