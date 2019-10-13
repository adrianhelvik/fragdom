"use strict";

var _testUtils = require("../testUtils.js");

var _Fragment = _interopRequireDefault(require("./Fragment.js"));

var _Document = _interopRequireDefault(require("./Document.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('reconcile', function () {
  it('reconcile all child nodes', function () {
    var document = new _Document["default"]();
    var fragment = document.createFragment();
    var a = document.createElement('a');
    var b = document.createElement('b');
    var c = document.createElement('c');
    fragment.appendChild(a);
    fragment.appendChild(b);
    fragment.appendChild(c);
    fragment.reconcile();
    expect(fragment.realNode).toEqual([window.document.createElement('a'), window.document.createElement('b'), window.document.createElement('c')]);
  });
  it('merges with child fragments', function () {
    var document = new _Document["default"]();
    var fragment = document.createFragment();
    var childFragment = document.createFragment();
    var a = document.createElement('a');
    var b = document.createElement('b');
    var c = document.createElement('c');
    fragment.appendChild(a);
    fragment.appendChild(childFragment);
    childFragment.appendChild(b);
    childFragment.appendChild(c);
    fragment.reconcile();
    expect(fragment.realNode).toEqual([window.document.createElement('a'), window.document.createElement('b'), window.document.createElement('c')]);
  });
});
describe('reconcileAsync', function () {
  it('runs reconcile', function (done) {
    var document = new _Document["default"]();
    var fragment = document.createFragment();
    (0, _testUtils.interceptMethod)(fragment, 'reconcile', function () {
      return done();
    });
    fragment.reconcileAsync();
  });
  it('runs reconcile after an animation frame', function (done) {
    var document = new _Document["default"]();
    var fragment = document.createFragment();
    fragment.appendChild(document.createElement('div'));
    fragment.reconcileAsync();
    requestAnimationFrame(function () {
      expect(fragment.realNode).toEqual([window.document.createElement('div')]);
      done();
    });
  });
  it('cancels reconcileAsync when running reconcile', function (done) {
    var document = new _Document["default"]();
    var fragment = document.createFragment();
    var calls = 0;
    (0, _testUtils.interceptMethod)(fragment, 'reconcile', function () {
      calls += 1;
    });
    fragment.reconcileAsync();
    fragment.reconcile();
    requestAnimationFrame(function () {
      expect(calls).toBe(1);
      done();
    });
  });
});