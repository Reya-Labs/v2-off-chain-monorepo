require('ts-node/register/transpile-only');
const config = require('./release.config.ts');
module.exports = config.default;