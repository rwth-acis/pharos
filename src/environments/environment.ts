// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDl0ncv-X-9fUPWO-F1Lu4FHIYy8VkofHY',
    authDomain: 'iccd-d439d.firebaseapp.com',
    databaseURL: 'https://iccd-d439d.firebaseio.com',
    projectId: 'iccd-d439d',
    storageBucket: 'iccd-d439d.appspot.com',
    messagingSenderId: '349853320525'
  },
  github: {
    clientId: '92303fd8861b6d3548a7',
    clientSecret: '27854cf0d2cfa6dac5deceb1061e6a47f5c51532'
  }
};
