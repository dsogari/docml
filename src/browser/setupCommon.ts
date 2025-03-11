import { type LanguageClientConfig } from 'monaco-editor-wrapper';

export const languageClientConfig: LanguageClientConfig = {
  name: 'Docml Client',
  clientOptions: {
    documentSelector: ['docml'],
  },
  connection: {
    options: {
      $type: 'WorkerDirect',
      worker: new Worker(new URL('./main', import.meta.url), {
        type: 'module',
        name: 'Docml Language Server',
      }),
    },
  },
};
