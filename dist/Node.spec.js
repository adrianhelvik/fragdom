"use strict";

var _Unconstructable = require("./Unconstructable.js");

var _Node = _interopRequireDefault(require("./Node.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

beforeEach(function () {
  (0, _Unconstructable.enableConstructor)();
});
afterEach(function () {
  _Node["default"].skipChecks = false;
  (0, _Unconstructable.disableConstructor)();
});
describe('appendChild', function () {
  it('appends a child', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    a.appendChild(b);
    expect(a.childNodes).toEqual([b]);
  });
  it('throws if the child contains the parent', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    var message = "Failed to execute 'appendChild' on 'Node': The new child element contains the parent.";
    a.appendChild(b);
    expect(function () {
      return b.appendChild(a);
    }).toThrow(message);
  });
  it('does not throw for containment if skipChecks = true', function () {
    _Node["default"].skipChecks = true;
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    a.appendChild(b);
    expect(function () {
      return b.appendChild(a);
    }).not.toThrow();
  });
  it('throws if the child is not a node', function () {
    var a = new _Node["default"]();
    var b = 'not a Node';
    var message = "Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.";
    expect(function () {
      return a.appendChild(b);
    }).toThrow(message);
  });
});
describe('constains', function () {
  it('is true for itself', function () {
    var node = new _Node["default"]();
    expect(node.contains(node)).toBe(true);
  });
  it('is true for its children', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    a.appendChild(b);
    expect(a.contains(b)).toBe(true);
  });
  it('is false for non-children', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    expect(a.contains(b)).toBe(false);
  });
  it('is transitive', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    var c = new _Node["default"]();
    a.appendChild(b);
    b.appendChild(c);
    expect(a.contains(c)).toBe(true);
  });
});
describe('remove', function () {
  it('removes the node from its parent', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    a.appendChild(b);
    b.remove();
    expect(a.childNodes).toEqual([]);
  });
  it('sets parentNode = null', function () {
    var a = new _Node["default"]();
    var b = new _Node["default"]();
    a.appendChild(b);
    b.remove();
    expect(b.parentNode).toBe(null);
  });
});
describe('[nonstandard] .realNode', function () {
  it('throws without a realNode', function () {
    expect(function () {
      return new _Node["default"]().realNode;
    }).toThrow('[nonstandard] You must reconcile before getting the real node');
  });
  it('does not throw after setting realNode', function () {
    expect(function () {
      var node = new _Node["default"]();
      var element = window.document.createElement('div');
      node.setRealNodeAfterReconciliation(element);
      node.realNode;
    }).not.toThrow();
  });
  it('returns the real node', function () {
    var node = new _Node["default"]();
    var element = window.document.createElement('div');
    node.setRealNodeAfterReconciliation(element);
    expect(node.realNode).toBe(element);
  });
});