const { peerDependencies } = require('./package.json');

module.exports = {
  root: true,
  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 2019,
    ecmaFeatures: {
      impliedStrict: true
    },
  },

  plugins: [
    'prefer-arrow',
  ],

  env: {
    node: true,
    es6: true,
    browser: true,
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
  ],

  rules: {
    'import/no-unresolved': ["error", { ignore: Object.keys(peerDependencies) }],
    'react/prop-types': [0],
    'no-console': [0],
    'class-methods-use-this': [0],
    'object-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': ['error'],
    'no-irregular-whitespace': ['error'],
    'no-await-in-loop': ['off'],
    'object-curly-newline': [0],
    semi: [ 'error', 'always' ],
    indent: ['error', 2],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      }
    ]
  },
};
