const { peerDependencies } = require('./package.json');

module.exports = {

  extends: [
    '@edwmurph/eslint-config',
    '@edwmurph/eslint-config/react',
  ],

  rules: {
    'import/no-unresolved': ['error', { ignore: Object.keys(peerDependencies) }],
  },
};
