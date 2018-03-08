var log = require('bestikk-log');
var Builder = require('opal-compiler').Builder;
var fs = require('fs');
var path = require('path');

function OpalCompiler (config) {
  this.config = config || {};
  this.dynamicRequireLevel = this.config.dynamicRequireLevel || 'warning';
  this.defaultPaths = this.config.defaultPaths || [];
  this.requirable = this.config.requirable || false;
  Opal.config.unsupported_features_severity = 'ignore';
}

OpalCompiler.prototype.compile = function (require, outputFile, includes) {
  var builder = Builder.$new();
  var stdlibPath;
  // do not use absolute path because append_paths does not detect absolute path on Windows
  var stdlibFlatPath = 'node_modules/opal-compiler/src/stdlib'; // flat structure (npm >= 3.x)
  var stdlibHierarchicalPath = 'node_modules/bestikk-opal-compiler/node_modules/opal-compiler/src/stdlib'; // hierarchical structure (npm < 3.x)
  if (fs.existsSync(stdlibHierarchicalPath)) {
    stdlibPath = stdlibHierarchicalPath;
  } else if (fs.existsSync(stdlibFlatPath)) {
    stdlibPath = stdlibFlatPath;
  }
  if (typeof stdlibPath !== 'undefined') { 
    builder.$append_paths(stdlibPath);
  }
  builder.$append_paths('lib');
  for (var i = 0; i < this.defaultPaths.length; i++) {
    builder.$append_paths(this.defaultPaths[i]);
  }
  builder.compiler_options = Opal.hash({'dynamic_require_severity': this.dynamicRequireLevel, 'requirable': this.requirable});
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
