import { MonacoEditorLanguageClientWrapper, type UserConfig } from 'monaco-editor-wrapper';
import { configureWorker, defineUserServices } from './setupCommon.js';

export const setupConfigExtended = (): UserConfig => {
  const extensionFilesOrContents = new Map();
  extensionFilesOrContents.set(
    '/language-configuration.json',
    new URL('../language-configuration.json', import.meta.url),
  );
  extensionFilesOrContents.set(
    '/docml-grammar.json',
    new URL('../syntaxes/docml.tmLanguage.json', import.meta.url),
  );

  return {
    wrapperConfig: {
      serviceConfig: defineUserServices(),
      editorAppConfig: {
        $type: 'extended',
        languageId: 'docml',
        code: `[ Docml is running in the web! ]`,
        useDiffEditor: false,
        extensions: [
          {
            config: {
              name: 'docml-web',
              publisher: 'generator-langium',
              version: '1.0.0',
              engines: {
                vscode: '*',
              },
              contributes: {
                languages: [
                  {
                    id: 'docml',
                    extensions: ['.docml'],
                    configuration: './language-configuration.json',
                  },
                ],
                grammars: [
                  {
                    language: 'docml',
                    scopeName: 'source.docml',
                    path: './docml-grammar.json',
                  },
                ],
              },
            },
            filesOrContents: extensionFilesOrContents,
          },
        ],
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.semanticHighlighting.enabled': true,
          }),
        },
      },
    },
    languageClientConfig: configureWorker(),
  };
};

export const executeExtended = async (htmlElement: HTMLElement) => {
  const userConfig = setupConfigExtended();
  const wrapper = new MonacoEditorLanguageClientWrapper();
  await wrapper.initAndStart(userConfig, htmlElement);
};
