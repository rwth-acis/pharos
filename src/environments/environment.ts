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
    clientId: '92303fd8861b6d3548a7'
  },
  learning_layers: {
    clientId: '40998356-803f-4cd9-b52d-67ddf739944d'
  },
  comment_service: {
    service_node: 'https://las2peer.dbis.rwth-aachen.de:9098'
  }
};
