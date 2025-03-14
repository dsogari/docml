export const paths = {
  tmLanguage: new URL('../docml.tmLanguage.json', import.meta.url),
  langConfig: new URL('../language-configuration.json', import.meta.url),
  webWorker: new URL('./browser/main', import.meta.url),
};

export { createDocmlServices } from './language/docml-module.js';
export * from './language/generated/ast.js';
