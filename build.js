const builder = require('api-console-builder');

builder({
  src: '../api-console-4.2.1.zip',
  dest: 'build',
  // raml: 'https://cdn.rawgit.com/advanced-rest-client/drive-raml-api-v2/1f85d308/api.raml',
  raml: '../drive-raml-api-v2/api.raml',
  verbose: true,
  useJson: true,
  inlineJson: true,
  noOptimization: false,
  sourceIsZip: true
})
.then(() => console.log('Build complete'))
.catch((cause) => console.log('Build error', cause.message));
