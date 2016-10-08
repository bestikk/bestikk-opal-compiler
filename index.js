var log = require('bestikk-log');
var Builder = require('opal-compiler').Builder;
var fs = require('fs');

function OpalCompiler (config) {
  this.config = config || {};
  this.dynamicRequireLevel = this.config.dynamicRequireLevel || 'warning';
  this.defaultPaths = this.config.defaultPaths || [];
  Opal.config.unsupported_features_severity = 'ignore';
}

OpalCompiler.prototype.compile = function (require, outputFile, includes) {
  var builder = Builder.$new();
  builder.$append_paths('node_modules/opal-compiler/src/stdlib', 'lib');
  for (var i = 0; i < this.defaultPaths.length; i++) {
    builder.$append_paths(this.defaultPaths[i]);
  }
  builder.compiler_options = Opal.hash({'dynamic_require_severity': this.dynamicRequireLevel});
  if (typeof includes !== 'undefined') {
    var includesLength = includes.length;
    for (var j = 0; j < includesLength; j++) {
      builder.$append_paths(includes[j]);
    }
  }
  log.debug('compile ' + require);
  var result = builder.$build(require);
  fs.writeFileSync(outputFile, result.$to_s(), 'utf8');
};

module.exports = OpalCompiler;
