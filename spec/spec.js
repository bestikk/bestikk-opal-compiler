var fs = require('fs');
var path = require('path');
var os = require('os');
var chai = require('chai');
var assert = chai.assert;

var main = require('../index.js');

describe('Bestikk', function() {

  var OUTPUT_FILE;

  beforeEach(function () {
    OUTPUT_FILE = path.join(os.tmpdir(), 'test-opal-compiler-output.js');
    if (fs.existsSync(OUTPUT_FILE)) { fs.unlinkSync(OUTPUT_FILE); }
  });

  afterEach(function () {
    if (fs.existsSync(OUTPUT_FILE)) { fs.unlinkSync(OUTPUT_FILE); }
  });

  describe('#compile', function() {
    it('should compile a simple Ruby script', function() {
      var compiler = new main({});
      assert(!fs.existsSync(OUTPUT_FILE));
      compiler.compile('hello.rb', OUTPUT_FILE, ['spec']);
      assert(fs.existsSync(OUTPUT_FILE));
      assert.include(fs.readFileSync(OUTPUT_FILE, {encoding: 'utf8'}), 'Hello world');
    });

    it('should compile a simple Ruby script with a default path', function() {
      var compiler = new main({defaultPaths: ['spec']});
      assert(!fs.existsSync(OUTPUT_FILE));
      compiler.compile('hello.rb', OUTPUT_FILE);
      assert(fs.existsSync(OUTPUT_FILE));
      assert.include(fs.readFileSync(OUTPUT_FILE, {encoding: 'utf8'}), 'Hello world');
    });

    it('should create a module if the requirable option is used', function() {
      var compiler = new main({requirable: true});
      assert(!fs.existsSync(OUTPUT_FILE));
      compiler.compile('hello.rb', OUTPUT_FILE, ['spec']);
      assert(fs.existsSync(OUTPUT_FILE));
      assert.include(fs.readFileSync(OUTPUT_FILE, {encoding: 'utf8'}), 'Opal.modules["hello"]');
    });
  });
});
