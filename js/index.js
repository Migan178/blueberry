/* eslint-disable @typescript-eslint/no-require-imports */
const HanTools = require('hangul-tools')

exports.dueum = function (char) {
  return HanTools.dueum(char)
}
