"use strict";

var _Unconstructable = _interopRequireWildcard(require("./Unconstructable.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

it('is not constructable by default', function () {
  expect(function () {
    return new _Unconstructable["default"]();
  }).toThrow('Illegal constructor');
});
describe('', function () {
  afterEach(function () {
    (0, _Unconstructable.disableConstructor)();
  });
  it('can be constructed when enableConstructor is called', function () {
    (0, _Unconstructable.enableConstructor)();
    expect(function () {
      return new _Unconstructable["default"]();
    }).not.toThrow();
  });
});