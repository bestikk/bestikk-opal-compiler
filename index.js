var log = require('bestikk-log');
var Builder = require('opal-compiler').Builder;
var fs = require('fs');
var path = require('path');

function OpalCompiler (config) {
  this.config = config || {};
  this.dynamicRequireLevel = this.config.dynamicRequireLevel || 'warning';
  this.defaultPaths = this.config.defaultPaths || [];
  Opal.config.unsupported_features_severity = 'ignore';
}

OpalCompiler.prototype.compile = function (require, outputFile, includes) {
  var builder = Builder.$new();
  var stdlibPath;
  var stdlibHierarchicalPath = path.resolve(__dirname, 'node_modules', 'opal-compiler', 'src', 'stdlib');
  var stdlibFlatPath = path.resolve(__dirname, '..', 'opal-compiler', 'src', 'stdlib'); // flat structure (npm >= 3.x)
  if (fs.existsSync(stdlibHierarchicalPath)) {
    stdlibPath = stdlibHierarchicalPath; // hierarchical structure (npm < 3.x)
  } else if (fs.existsSync(stdlibFlatPath)) {
    stdlibPath = stdlibFlatPath; // flat structure (npm >= 3.x)
  } else {
    stdlibPath = path.join('node_modules', 'opal-compiler', 'src', 'stdlib');
  }
  builder.$append_paths(stdlibPath);
  builder.$append_paths('lib');
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
