"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Node2 = _interopRequireDefault(require("./Node.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var Text =
/*#__PURE__*/
function (_Node) {
  _inherits(Text, _Node);

  _createClass(Text, [{
    key: "textContent",
    get: function get() {
      return _classPrivateFieldGet(this, _value);
    },
    set: function set(value) {
      _classPrivateFieldSet(this, _value, value);
    }
  }]);

  function Text(text) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this));

    _animationFrame.set(_assertThisInitialized(_this), {
      writable: true,
      value: null
    });

    _value.set(_assertThisInitialized(_this), {
      writable: true,
      value: null
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _value, text);

    return _this;
  }

  _createClass(Text, [{
    key: "reconcile",
    value: function reconcile() {
      if (_classPrivateFieldGet(this, _animationFrame)) {
        cancelAnimationFrame(_classPrivateFieldGet(this, _animationFrame));

        _classPrivateFieldSet(this, _animationFrame, null);
      }

      var realNode = this.getPrivateRealNodeWithoutChecks() || window.document.createTextNode(this.textContent);

      if (realNode.textContent !== this.textContent) {
        realNode.textContent = this.textContent;
      }

      this.setRealNodeAfterReconciliation(realNode);
    }
  }, {
    key: "reconcileAsync",
    value: function reconcileAsync() {
      var _this2 = this;

      if (_classPrivateFieldGet(this, _animationFrame) != null) {
        return;
      }

      _classPrivateFieldSet(this, _animationFrame, requestAnimationFrame(function () {
        _classPrivateFieldSet(_this2, _animationFrame, null);

        _this2.reconcile();
      }));
    }
  }]);

  return Text;
}(_Node2["default"]);

var _animationFrame = new WeakMap();

var _value = new WeakMap();

var _default = Text;
exports["default"] = _default;