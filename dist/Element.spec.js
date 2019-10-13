"use strict";

var _testUtils = require("../testUtils.js");

var _Document = _interopRequireDefault(require("./Document.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('setAttribute(key, value)', function () {
  it('updates .attributes', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.setAttribute('class', 'foo');
    expect(element.attributes).toEqual({
      "class": 'foo'
    });
  });
});
describe('[nonstandard] .reconcile()', function () {
  it('creates the real element', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.reconcile();
    expect(element.realNode).toBeInstanceOf(window.Element);
  });
  it('does not create a new element the second time', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.reconcile();
    var a = element.realNode;
    element.reconcile();
    var b = element.realNode;
    expect(a).toBe(b);
  });
  it('appends all element children', function () {
    var document = new _Document["default"]();
    var a = document.createElement('outer');
    var b = document.createElement('inner');
    a.appendChild(b);
    a.reconcile();
    var element = a.realNode;
    expect(element.outerHTML).toBe('<outer><inner></inner></outer>');
  });
  it('can remove children', function () {
    var document = new _Document["default"]();
    var outer = document.createElement('outer');
    var child = document.createElement('child');
    outer.appendChild(child);
    outer.reconcile();
    outer.removeChild(child);
    outer.reconcile();
    var element = outer.realNode;
    expect(element.outerHTML).toBe('<outer></outer>');
  });
  it('can replace children', function () {
    var document = new _Document["default"]();
    var outer = document.createElement('outer');
    var before = document.createElement('before');
    var after = document.createElement('after');
    outer.appendChild(before);
    outer.reconcile();
    outer.removeChild(before);
    outer.appendChild(after);
    outer.reconcile();
    var element = outer.realNode;
    expect(element.outerHTML).toBe('<outer><after></after></outer>');
  });
  it("retains focus when a child isn't (re-/)moved", function () {
    var document = new _Document["default"]();
    var container = document.createElement('container');
    var input = document.createElement('input');
    container.appendChild(input);
    container.reconcile();
    input.realNode.focus();
    container.reconcile();
    expect(window.document.activeElement).toBe(input.realNode);
  });
  it('can add fragments', function () {
    var document = new _Document["default"]();
    var container = document.createElement('container');
    var fragment = document.createFragment();
    var a = document.createElement('a');
    var b = document.createElement('b');
    var c = document.createElement('c');
    container.appendChild(fragment);
    fragment.appendChild(a);
    fragment.appendChild(b);
    fragment.appendChild(c);
    container.reconcile();
    expect(container.realNode.innerHTML).toBe('<a></a><b></b><c></c>');
  });
  it('can remove fragments', function () {
    var document = new _Document["default"]();
    var container = document.createElement('container');
    var fragment = document.createFragment();
    var a = document.createElement('a');
    var b = document.createElement('b');
    var c = document.createElement('c');
    container.appendChild(fragment);
    fragment.appendChild(a);
    fragment.appendChild(b);
    fragment.appendChild(c);
    container.reconcile();
    fragment.removeChild(b);
    container.reconcile();
    expect(container.realNode.innerHTML).toBe('<a></a><c></c>');
  });
  it('can add attributes', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.setAttribute('class', 'foo');
    element.reconcile();
    expect(element.realNode.getAttribute('class')).toBe('foo');
  });
  it('can remove attributes', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.setAttribute('class', 'foo');
    element.reconcile();
    element.removeAttribute('class');
    element.reconcile();
    expect(element.realNode.getAttribute('class')).toBe(null);
  });
  it('can add instance attributes', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.setAttribute('$message', 'Hello world');
    element.reconcile();
    expect(element.realNode.message).toBe('Hello world');
  });
  it('can remove attributes', function () {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.setAttribute('$message', 'Hello world');
    element.reconcile();
    element.removeAttribute('$message');
    element.reconcile();
    expect(element.realNode.message).toBe(null);
  });
});
describe('[nonstandard] .reconcileAsync()', function () {
  it('runs reconcile', function (done) {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    (0, _testUtils.interceptMethod)(element, 'reconcile', function () {
      return done();
    });
    element.reconcileAsync();
  });
  it('runs reconcile after an animation frame', function (done) {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    element.reconcileAsync();
    requestAnimationFrame(function () {
      expect(element.realNode).toEqual(window.document.createElement('div'));
      done();
    });
  });
  it('cancels reconcileAsync when running reconcile', function (done) {
    var document = new _Document["default"]();
    var element = document.createElement('div');
    var calls = 0;
    (0, _testUtils.interceptMethod)(element, 'reconcile', function () {
      calls += 1;
    });
    element.reconcileAsync();
    element.reconcile();
    requestAnimationFrame(function () {
      expect(calls).toBe(1);
      done();
    });
  });
});