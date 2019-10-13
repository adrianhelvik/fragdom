"use strict";

var _testUtils = require("../testUtils.js");

var _Document = _interopRequireDefault(require("./Document.js"));

var _Text = _interopRequireDefault(require("./Text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var document = new _Document["default"]();
it('can be created', function () {
  var text = document.createTextNode('Hello world');
  expect(text).toBeInstanceOf(_Text["default"]);
});
it('can set/get textContent', function () {
  var text = document.createTextNode('Hello world');
  text.textContent = 'Foo bar';
  expect(text.textContent).toBe('Foo bar');
});
describe('.reconcile()', function () {
  it('can create the .realNode', function () {
    var text = document.createTextNode('Hello world');
    text.reconcile();
    expect(text.realNode.textContent).toBe('Hello world');
  });
  it('can update the .realNode', function () {
    var text = document.createTextNode('Hello world');
    text.reconcile();
    text.textContent = 'Foo bar';
    text.reconcile();
    expect(text.realNode.textContent).toBe('Foo bar');
  });
});
describe('.reconcileAsync', function () {
  it('runs .reconcile()', function (done) {
    var text = document.createTextNode('Hello world');
    text.reconcile = done;
    text.reconcileAsync();
  });
  it('creates the .realNode after an animation frame', function (done) {
    var text = document.createTextNode('Hello world');
    text.reconcile();
    text.textContent = 'Foo bar';
    text.reconcileAsync();
    expect(text.realNode.textContent).toBe('Hello world');
    requestAnimationFrame(function () {
      expect(text.realNode.textContent).toBe('Foo bar');
      done();
    });
  });
  it('cancels reconcileAsync when running reconcile', function (done) {
    var document = new _Document["default"]();
    var text = document.createTextNode('Hello world');
    var calls = 0;
    (0, _testUtils.interceptMethod)(text, 'reconcile', function () {
      calls += 1;
    });
    text.reconcileAsync();
    text.reconcile();
    requestAnimationFrame(function () {
      expect(calls).toBe(1);
      done();
    });
  });
});