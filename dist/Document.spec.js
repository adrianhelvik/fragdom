"use strict";

var _Fragment = _interopRequireDefault(require("./Fragment.js"));

var _Document = _interopRequireDefault(require("./Document.js"));

var _Element = _interopRequireDefault(require("./Element.js"));

var _Text = _interopRequireDefault(require("./Text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var document;
beforeEach(function () {
  document = new _Document["default"]();
});
describe('.createElement(tagName)', function () {
  it('can create an element', function () {
    var element = document.createElement('div');
    expect(element).toBeInstanceOf(_Element["default"]);
  });
  it('assigns the tagName', function () {
    var element = document.createElement('div');
    expect(element.tagName).toBe('DIV');
  });
  it('can not override the tagName', function () {
    var element = document.createElement('div');
    element.tagName = 'span';
    expect(element.tagName).toBe('DIV');
  });
  it('[nonstandard] throws if tagName is not a string', function () {
    expect(function () {
      return document.createElement(null);
    }).toThrow(/string/i);
  });
});
describe('[nonstandard] .createFragment()', function () {
  it('creates a fragment', function () {
    var fragment = document.createFragment();
    expect(fragment).toBeInstanceOf(_Fragment["default"]);
  });
});
describe('createTextNode', function () {
  it('creates a text node', function () {
    var text = document.createTextNode('Hello world');
    expect(text).toBeInstanceOf(_Text["default"]);
  });
  it('sets the text of the node', function () {
    var text = document.createTextNode('Hello world');
    expect(text.textContent).toBe('Hello world');
  });
});