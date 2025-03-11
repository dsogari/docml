export default {
  '*.{js,ts}': (paths) => `eslint ${paths.map((path) => `'${path}'`).join(' ')}`,
  '*': (paths) => [
    `cspell --no-must-find-files ${paths.map((path) => `'${path}'`).join(' ')}`,
    `prettier --write ${paths.map((path) => `'${path}'`).join(' ')}`,
  ],
};
