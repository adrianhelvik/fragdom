"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Unconstructable2 = _interopRequireDefault(require("./Unconstructable.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var Node =
/*#__PURE__*/
function (_Unconstructable) {
  _inherits(Node, _Unconstructable);

  function Node() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Node);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Node)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _realNode.set(_assertThisInitialized(_this), {
      writable: true,
      value: null
    });

    _defineProperty(_assertThisInitialized(_this), "parentNode", null);

    _defineProperty(_assertThisInitialized(_this), "childNodes", []);

    return _this;
  }

  _createClass(Node, [{
    key: "getPrivateRealNodeWithoutChecks",
    value: function getPrivateRealNodeWithoutChecks() {
      return _classPrivateFieldGet(this, _realNode);
    }
  }, {
    key: "setRealNodeAfterReconciliation",
    value: function setRealNodeAfterReconciliation(realNode) {
      _classPrivateFieldSet(this, _realNode, realNode);
    }
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      if (!(child instanceof Node)) {
        throw Error("Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.");
      }

      if (!this.constructor.skipChecks) {
        if (child.contains(this)) {
          throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");
        }
      }

      child.parentNode = this;
      this.childNodes.push(child);
    }
  }, {
    key: "contains",
    value: function contains(node) {
      if (this === node) return true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          if (child.contains(node)) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this.parentNode) {
        throw Error('[nonstandard] Can not remove node with no parent');
      }

      this.parentNode.removeChild(this);
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var index = this.childNodes.indexOf(child);

      if (index === -1) {
        throw Error("Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
      }

      this.childNodes.splice(index, 1);
      child.parentNode = null;
    }
  }, {
    key: "realNode",
    get: function get() {
      if (!_classPrivateFieldGet(this, _realNode)) {
        throw Error('[nonstandard] You must reconcile before getting the real node');
      }

      return _classPrivateFieldGet(this, _realNode);
    }
  }]);

  return Node;
}(_Unconstructable2["default"]);

var _realNode = new WeakMap();

_defineProperty(Node, "skipChecks", false);

var _default = Node;
exports["default"] = _default;