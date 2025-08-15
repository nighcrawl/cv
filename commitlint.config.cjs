module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(msg) => /^chore\(release\): /.test(msg)],
  rules: {
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
    'scope-enum': [2, 'always', [
      'templates','styles','i18n','pdf','og','pages','ci','build','data','scripts','repo','release','gitflow'
    ]]
  }
};
