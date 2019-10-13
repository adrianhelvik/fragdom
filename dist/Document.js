"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Unconstructable = _interopRequireWildcard(require("./Unconstructable.js"));

var _Fragment = _interopRequireDefault(require("./Fragment.js"));

var _Element = _interopRequireDefault(require("./Element.js"));

var _Text = _interopRequireDefault(require("./Text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Document =
/*#__PURE__*/
function () {
  function Document() {
    _classCallCheck(this, Document);
  }

  _createClass(Document, [{
    key: "createElement",
    value: function createElement(type) {
      return (0, _Unconstructable.withConstructor)(function () {
        return new _Element["default"](type);
      });
    }
  }, {
    key: "createFragment",
    value: function createFragment() {
      return (0, _Unconstructable.withConstructor)(function () {
        return new _Fragment["default"]();
      });
    }
  }, {
    key: "createTextNode",
    value: function createTextNode(text) {
      return (0, _Unconstructable.withConstructor)(function () {
        return new _Text["default"](text);
      });
    }
  }]);

  return Document;
}();

var _default = Document;
exports["default"] = _default;