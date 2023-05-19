"use strict";
var i18n = require('./dist/vite');
module.exports = typeof i18n['default'] !== undefined ? i18n['default'] : i18n;