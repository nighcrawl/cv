module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Optionnel : verrouille quelques scopes utilisés dans ton repo
  rules: {
    'scope-enum': [2, 'always', [
      'templates','styles','i18n','pdf','og','pages','ci','build','data','scripts','repo'
    ]]
  }
};
